// Global variables to store the markers and path
let path;

let polylines = [];

let lockedMarker;

let leftMap;
let rightMap;
let centerMap;

let leftMarker;
let centerMarker;
let rightMarker;

let leftMapMarkerPosition;
let centerMapMarkerPosition;
let rightMapMarkerPosition;

async function initMaps() {

  lockedMarker = 'right';

  const leftSearchBox = new google.maps.places.SearchBox(
    document.getElementById("left-search-input")
  );
  leftSearchBox.addListener("places_changed", () => {
    const places = leftSearchBox.getPlaces();
    if (places.length === 0) return;
    const location = places[0].geometry.location;
    leftMapMarkerPosition = { lat: location.lat(), lng: location.lng() };
    leftMarker.setPosition(leftMapMarkerPosition);
    markerMoved(leftMarker);
    centerMaps([leftMap]);
  });
  
  const centerSearchBox = new google.maps.places.SearchBox(
    document.getElementById("center-search-input")
  );
  centerSearchBox.addListener("places_changed", () => {
    const places = centerSearchBox.getPlaces();
    if (places.length === 0) return;
    const location = places[0].geometry.location;
    centerMapMarkerPosition = { lat: location.lat(), lng: location.lng() };
    centerMarker.setPosition(centerMapMarkerPosition);
    markerMoved(centerMarker); // Trigger markerMoved function for centerMarker
    centerMaps([centerMap]);
  });
  

  const rightSearchBox = new google.maps.places.SearchBox(
    document.getElementById("right-search-input")
  );
  rightSearchBox.addListener("places_changed", () => {
    const places = rightSearchBox.getPlaces();
    if (places.length === 0) return;
    const location = places[0].geometry.location;
    rightMapMarkerPosition = { lat: location.lat(), lng: location.lng() };
    rightMarker.setPosition(rightMapMarkerPosition);
    markerMoved(rightMarker);
    centerMaps([rightMap]);
  });

  const { Map } = await google.maps.importLibrary("maps");
  const { Marker } = await google.maps.importLibrary("marker");
  const { spherical } = await google.maps.importLibrary("geometry");

  const mapOptions = {
    zoom: 14,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: "hybrid",
    mapTypeControl: false,
  };

  leftMap = new Map(document.getElementById("left-map"), {
    ...mapOptions,
    mapId: "LEFT_MAP",
  });
  centerMap = new Map(document.getElementById("center-map"), {
    ...mapOptions,
    mapId: "CENTER_MAP",
  });
  rightMap = new Map(document.getElementById("right-map"), {
    ...mapOptions,
    mapId: "RIGHT_MAP",
  });

  leftMarker = new Marker({
    map: leftMap,
    title: "Left Marker",
    draggable: true,
  });
  centerMarker = new Marker({
    map: centerMap,
    title: "Center",
    draggable: true,
  });
  rightMarker = new Marker({
    map: rightMap,
    title: "Right Marker",
    draggable: true,
  });
  
  document.getElementById("left-recenter-button").addEventListener("click", () => {
    leftMap.setCenter(leftMapMarkerPosition);
  });

  document.getElementById("center-recenter-button").addEventListener("click", () => {
    centerMap.setCenter(centerMapMarkerPosition);
  });

  document.getElementById("right-recenter-button").addEventListener("click", () => {
    rightMap.setCenter(rightMapMarkerPosition);
  });

  document.getElementById("lock-left-marker").addEventListener("change", () => {
    lockedMarker = 'left';
  });
  document.getElementById("lock-right-marker").addEventListener("change", () => {
    lockedMarker = 'right';
  });
  
  leftMapMarkerPosition = { lat: 37.778379, lng: -122.389711 }; // Oracle Park, San Francisco, CA
  rightMapMarkerPosition = { lat: 36.014313, lng: -75.66791 }; // Wright Brothers Memorial, Kill Devil Hills, NC
  centerMapMarkerPosition = { lat: 38.624745, lng: -90.185258 }; // Gateway Arch, St. Louis, MO

  leftMarker.addListener("drag", debounce(() => markerMoved(leftMarker), 10));
  centerMarker.addListener("drag", debounce(() => markerMoved(centerMarker), 10));
  rightMarker.addListener("drag", debounce(() => markerMoved(rightMarker), 10));

  leftMarker.addListener("dragend", () => {
    clearSearchInput(leftMarker);
    centerMaps([leftMap]);
  });
  centerMarker.addListener("dragend", () => {
    clearSearchInput(centerMarker);
    centerMaps([centerMap]);
  });
  rightMarker.addListener("dragend", () => {
    clearSearchInput(rightMarker);
    centerMaps([rightMap]);
  });

  // Recenter on the placemarks
  leftMap.setCenter(leftMapMarkerPosition);
  centerMap.setCenter(centerMapMarkerPosition);
  rightMap.setCenter(rightMapMarkerPosition);


  updateMaps();
}

function drawGeodesicLine(path, map) {
  // Create a new polyline with the path, set geodesic to true, and add it to the map
  const geodesicLine = new google.maps.Polyline({    path: path,
    geodesic: true, // This makes the line follow the curvature of the Earth
    map: map,
  });

  return geodesicLine;
}

function markerMoved(movedMarker) {
  if (movedMarker === centerMarker) {
    centerMarkerMoved(movedMarker);
  } else {
    endpointMarkerMoved(movedMarker);
  }
}

function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function centerMarkerMoved(centerMarker) {
  const newPosition = centerMarker.getPosition().toJSON();
  centerMapMarkerPosition.lat = newPosition.lat;
  centerMapMarkerPosition.lng = newPosition.lng;

  // Determine the target and opposite positions based on the locked marker
  const targetPosition = lockedMarker === 'right' ? leftMapMarkerPosition : rightMapMarkerPosition;
  const oppositePosition = lockedMarker === 'right' ? rightMapMarkerPosition : leftMapMarkerPosition;

  // Calculate the distance and bearing from the center marker to the target position
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(newPosition),
    new google.maps.LatLng(targetPosition)
  );
  const bearing = google.maps.geometry.spherical.computeHeading(
    new google.maps.LatLng(newPosition),
    new google.maps.LatLng(oppositePosition)
  );

  // Calculate the opposite position based on the distance and bearing
  const oppositeLatLng = google.maps.geometry.spherical.computeOffset(
    new google.maps.LatLng(newPosition),
    distance,
    bearing + 180
  );

  // Update the global position objects based on the locked marker
  if (lockedMarker === 'right') {
    leftMapMarkerPosition.lat = oppositeLatLng.lat();
    leftMapMarkerPosition.lng = oppositeLatLng.lng();
  } else {
    rightMapMarkerPosition.lat = oppositeLatLng.lat();
    rightMapMarkerPosition.lng = oppositeLatLng.lng();
  }

  // Update the maps
  updateMaps();

  // Center the map on the opposite marker that has been moved
  centerMaps([lockedMarker === 'right' ? leftMap : rightMap]);
}

function endpointMarkerMoved(movedMarker) {
  const movedMarkerPosition =
    movedMarker === leftMarker ? leftMapMarkerPosition : rightMapMarkerPosition;
  const oppositeMarkerPosition =
    movedMarker === leftMarker ? rightMapMarkerPosition : leftMapMarkerPosition;

  const oppositeMap = movedMarker === leftMarker ? rightMap : leftMap;

  // Get the current position of the moved marker
  const newPosition = movedMarker.getPosition().toJSON();

  // Calculate the distance and bearing from the center marker to the new moved marker position
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(centerMapMarkerPosition),
    new google.maps.LatLng(oppositeMarkerPosition) // Use the moved marker position to keep the distance the same
  );
  const bearing = google.maps.geometry.spherical.computeHeading(
    new google.maps.LatLng(centerMapMarkerPosition),
    new google.maps.LatLng(newPosition)
  );

  // Calculate the position of the opposite marker by moving the same distance from the center marker
  // using the new bearing
  const oppositeLatLng = google.maps.geometry.spherical.computeOffset(
    new google.maps.LatLng(centerMapMarkerPosition),
    distance,
    bearing + 180
  );

  // Update the global position objects
  movedMarkerPosition.lat = newPosition.lat;
  movedMarkerPosition.lng = newPosition.lng;
  oppositeMarkerPosition.lat = oppositeLatLng.lat();
  oppositeMarkerPosition.lng = oppositeLatLng.lng();

  // Update the maps
  updateMaps();
  centerMaps([oppositeMap]);
}

function centerMaps(maps) {
  // inteterate over each maps and call setCenter
  maps.forEach((map) => {
    if (map === leftMap) {
      leftMap.setCenter(leftMapMarkerPosition);
    }
    if (map === centerMap) {
      centerMap.setCenter(centerMapMarkerPosition);
    }
    if (map === rightMap) {
      rightMap.setCenter(rightMapMarkerPosition);
    }
  });
}

function clearSearchInput(movedMarker) {
  let inputId;
  if (movedMarker === leftMarker) {
    inputId = "left-search-input";
  } else if (movedMarker === centerMarker) {
    inputId = "center-search-input";
  } else if (movedMarker === rightMarker) {
    inputId = "right-search-input";
  }

  if (inputId) {
    document.getElementById(inputId).value = "";
  }
}

function updateMaps() {
  polylines.forEach((polyline) => polyline.setMap(null));
  polylines = [];

  // Update the path based on the current marker positions
  path = [leftMapMarkerPosition, rightMapMarkerPosition];

  // Update the placemarks
  leftMarker.setPosition(leftMapMarkerPosition);
  centerMarker.setPosition(centerMapMarkerPosition);
  rightMarker.setPosition(rightMapMarkerPosition);

  // Draw the new geodesic lines on all three maps and store them
  polylines.push(drawGeodesicLine(path, leftMap));
  polylines.push(drawGeodesicLine(path, centerMap));
  polylines.push(drawGeodesicLine(path, rightMap));
}

window.initMaps = initMaps;