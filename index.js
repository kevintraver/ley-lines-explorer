// array to track lines
let polylines = []

// Maps and related configurations
let leftMap
let rightMap
let centerMap

let leftMapMarkerPosition
let centerMapMarkerPosition
let rightMapMarkerPosition

// Markers for different maps
let leftMarkers = []
let centerMarkers = []
let rightMarkers = []

// Specific markers to track updating on events
let leftMarker
let centerMarker
let rightMarker

// variable to track which marker is locked
let lockedMarker

let leftMarkerLockedToBearing = false;
let centerMarkerLockedToBearing = false;
let rightMarkerLockedToBearing = false;

async function initMaps () {
  lockedMarker = 'right'

  const leftSearchBox = new google.maps.places.SearchBox(
    document.getElementById('left-search-input')
  )
  leftSearchBox.addListener('places_changed', () => {
    const places = leftSearchBox.getPlaces()
    if (places.length === 0) return
    const location = places[0].geometry.location
    const viewport = places[0].geometry.viewport
    leftMapMarkerPosition = { lat: location.lat(), lng: location.lng() }
    leftMarker.setPosition(leftMapMarkerPosition)
    markerMoved(leftMarker)
    centerMaps([leftMap])
    fitMapToBounds(leftMap, viewport)
  })

  const centerSearchBox = new google.maps.places.SearchBox(
    document.getElementById('center-search-input')
  )
  centerSearchBox.addListener('places_changed', () => {
    const places = centerSearchBox.getPlaces()
    if (places.length === 0) return
    const location = places[0].geometry.location
    const viewport = places[0].geometry.viewport
    centerMapMarkerPosition = { lat: location.lat(), lng: location.lng() }
    centerMarker.setPosition(centerMapMarkerPosition)
    markerMoved(centerMarker) // Trigger markerMoved function for centerMarker
    centerMaps([centerMap])
    fitMapToBounds(centerMap, viewport)
  })

  const rightSearchBox = new google.maps.places.SearchBox(
    document.getElementById('right-search-input')
  )
  rightSearchBox.addListener('places_changed', () => {
    const places = rightSearchBox.getPlaces()
    if (places.length === 0) return
    const location = places[0].geometry.location
    const viewport = places[0].geometry.viewport
    rightMapMarkerPosition = { lat: location.lat(), lng: location.lng() }
    rightMarker.setPosition(rightMapMarkerPosition)
    markerMoved(rightMarker)
    centerMaps([rightMap])
    fitMapToBounds(rightMap, viewport)
  })

  const { Map } = await google.maps.importLibrary('maps')
  const { Marker } = await google.maps.importLibrary('marker')

  const mapOptions = {
    zoom: 14,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'hybrid',
    mapTypeControl: false
  }

  leftMap = new Map(document.getElementById('left-map'), {
    ...mapOptions,
    mapId: 'LEFT_MAP'
  })
  centerMap = new Map(document.getElementById('center-map'), {
    ...mapOptions,
    mapId: 'CENTER_MAP'
  })
  rightMap = new Map(document.getElementById('right-map'), {
    ...mapOptions,
    mapId: 'RIGHT_MAP'
  })

  const redSvgMarker = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: 1.0,
    strokeColor: 'black',
    strokeWeight: 1,
    scale: 6 // You can adjust the size by changing the scale
  }

  // Create leftMarker on all three maps
  leftMarkers = [
    new Marker({ map: leftMap, title: 'Left Marker', draggable: true }),
    new Marker({ map: centerMap, title: 'Left Marker', draggable: false, icon: redSvgMarker }),
    new Marker({ map: rightMap, title: 'Left Marker', draggable: false, icon: redSvgMarker })
  ]
  leftMarker = leftMarkers[0]

  // Create centerMarker on all three maps
  centerMarkers = [
    new Marker({ map: leftMap, title: 'Center Marker', draggable: false, icon: redSvgMarker }),
    new Marker({ map: centerMap, title: 'Center Marker', draggable: true }),
    new Marker({ map: rightMap, title: 'Center Marker', draggable: false, icon: redSvgMarker })
  ]
  centerMarker = centerMarkers[1]

  // Create rightMarker on all three maps
  rightMarkers = [
    new Marker({ map: leftMap, title: 'Right Marker', draggable: false, icon: redSvgMarker }),
    new Marker({ map: centerMap, title: 'Right Marker', draggable: false, icon: redSvgMarker }),
    new Marker({ map: rightMap, title: 'Right Marker', draggable: true })
  ]
  rightMarker = rightMarkers[2]

  document.getElementById('left-recenter-button').addEventListener('click', () => {
    leftMap.setCenter(leftMapMarkerPosition)
  })

  document.getElementById('center-recenter-button').addEventListener('click', () => {
    centerMap.setCenter(centerMapMarkerPosition)
  })

  document.getElementById('right-recenter-button').addEventListener('click', () => {
    rightMap.setCenter(rightMapMarkerPosition)
  })

  document.getElementById('lock-left-marker').addEventListener('change', () => {
    lockedMarker = 'left'
  })
  document.getElementById('lock-right-marker').addEventListener('change', () => {
    lockedMarker = 'right'
  })
  
  document.getElementById('lock-left-marker-to-bearing').addEventListener('change', (event) => {
    leftMarkerLockedToBearing = event.target.checked;
  });

  leftMapMarkerPosition = { lat: 37.778379, lng: -122.389711 } // Oracle Park, San Francisco, CA
  rightMapMarkerPosition = { lat: 36.014313, lng: -75.66791 } // Wright Brothers Memorial, Kill Devil Hills, NC
  centerMapMarkerPosition = { lat: 38.624745, lng: -90.185258 } // Gateway Arch, St. Louis, MO

  leftMarker.addListener('drag', debounce(() => markerMoved(leftMarker), 10))
  centerMarker.addListener('drag', debounce(() => markerMoved(centerMarker), 10))
  rightMarker.addListener('drag', debounce(() => markerMoved(rightMarker), 10))

  leftMarker.addListener('dragend', () => {
    clearSearchInput(leftMarker)
    centerMaps([leftMap])
  })
  centerMarker.addListener('dragend', () => {
    clearSearchInput(centerMarker)
    centerMaps([centerMap])
  })
  rightMarker.addListener('dragend', () => {
    clearSearchInput(rightMarker)
    centerMaps([rightMap])
  })

  // Recenter on the placemarks
  leftMap.setCenter(leftMapMarkerPosition)
  centerMap.setCenter(centerMapMarkerPosition)
  rightMap.setCenter(rightMapMarkerPosition)

  updateMaps()
}

function drawGeodesicLine (start, end, map) {
  // Calculate the midpoint between start and end
  const midpoint = google.maps.geometry.spherical.interpolate(
    new google.maps.LatLng(start),
    new google.maps.LatLng(end),
    0.5
  )

  // Calculate the antipodal point of the midpoint
  const antipodalMidpoint = {
    lat: -midpoint.lat(),
    lng: (midpoint.lng() + 180) % 360
  }

  // Shortest path (geodesic)
  const pathShortest = [start, end]

  // Longer path (geodesic) that goes around the Earth in the opposite direction
  const pathLonger = [start, antipodalMidpoint, end]

  // Create the polyline for the shorter path and add it to the map
  const geodesicLineShortest = new google.maps.Polyline({
    path: pathShortest,
    geodesic: true,
    map
  })

  // Create the polyline for the longer path, set geodesic to true, and add it to the map
  // Set strokeOpacity to 0.5 to make it slightly transparent
  const geodesicLineLonger = new google.maps.Polyline({
    path: pathLonger,
    geodesic: true,
    map,
    strokeWeight: 3,
    strokeOpacity: 0.33
  })

  return [geodesicLineShortest, geodesicLineLonger]
}

function markerMoved (movedMarker) {
  if (movedMarker === centerMarker) {
    centerMarkerMoved(movedMarker)
  } else {
    endpointMarkerMoved(movedMarker)
  }
}

function debounce (func, wait) {
  let timeout
  return function () {
    const context = this; const args = arguments
    const later = function () {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function centerMarkerMoved (centerMarker) {
  const newPosition = centerMarker.getPosition().toJSON()
  centerMapMarkerPosition.lat = newPosition.lat
  centerMapMarkerPosition.lng = newPosition.lng

  // Determine the target and opposite positions based on the locked marker
  const targetPosition = lockedMarker === 'right' ? leftMapMarkerPosition : rightMapMarkerPosition
  const oppositePosition = lockedMarker === 'right' ? rightMapMarkerPosition : leftMapMarkerPosition

  // Calculate the distance and bearing from the center marker to the target position
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(newPosition),
    new google.maps.LatLng(targetPosition)
  )
  const bearing = google.maps.geometry.spherical.computeHeading(
    new google.maps.LatLng(newPosition),
    new google.maps.LatLng(oppositePosition)
  )

  // Calculate the opposite position based on the distance and bearing
  const oppositeLatLng = google.maps.geometry.spherical.computeOffset(
    new google.maps.LatLng(newPosition),
    distance,
    bearing + 180
  )

  // Update the global position objects based on the locked marker
  if (lockedMarker === 'right') {
    leftMapMarkerPosition.lat = oppositeLatLng.lat()
    leftMapMarkerPosition.lng = oppositeLatLng.lng()
  } else {
    rightMapMarkerPosition.lat = oppositeLatLng.lat()
    rightMapMarkerPosition.lng = oppositeLatLng.lng()
  }

  // Update the maps
  updateMaps()

  // Center the map on the opposite marker that has been moved
  centerMaps([lockedMarker === 'right' ? leftMap : rightMap])
}

function endpointMarkerMoved (movedMarker) {
  const movedMarkerPosition =
    movedMarker === leftMarker ? leftMapMarkerPosition : rightMapMarkerPosition
  const oppositeMarkerPosition =
    movedMarker === leftMarker ? rightMapMarkerPosition : leftMapMarkerPosition

  const oppositeMap = movedMarker === leftMarker ? rightMap : leftMap

  // Get the current position of the moved marker
  const newPosition = movedMarker.getPosition().toJSON()

  // Calculate the distance and bearing from the center marker to the new moved marker position
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(centerMapMarkerPosition),
    new google.maps.LatLng(oppositeMarkerPosition) // Use the moved marker position to keep the distance the same
  )
  const bearing = google.maps.geometry.spherical.computeHeading(
    new google.maps.LatLng(centerMapMarkerPosition),
    new google.maps.LatLng(newPosition)
  )

  // Calculate the position of the opposite marker by moving the same distance from the center marker
  // using the new bearing
  const oppositeLatLng = google.maps.geometry.spherical.computeOffset(
    new google.maps.LatLng(centerMapMarkerPosition),
    distance,
    bearing + 180
  )

  // Update the global position objects
  movedMarkerPosition.lat = newPosition.lat
  movedMarkerPosition.lng = newPosition.lng
  oppositeMarkerPosition.lat = oppositeLatLng.lat()
  oppositeMarkerPosition.lng = oppositeLatLng.lng()

  // Update the maps
  updateMaps()
  centerMaps([oppositeMap])
}

function centerMaps (maps) {
  // inteterate over each maps and call setCenter
  maps.forEach((map) => {
    if (map === leftMap) {
      leftMap.setCenter(leftMapMarkerPosition)
    }
    if (map === centerMap) {
      centerMap.setCenter(centerMapMarkerPosition)
    }
    if (map === rightMap) {
      rightMap.setCenter(rightMapMarkerPosition)
    }
  })
}

function clearSearchInput (movedMarker) {
  let inputId
  if (movedMarker === leftMarker) {
    inputId = 'left-search-input'
  } else if (movedMarker === centerMarker) {
    inputId = 'center-search-input'
  } else if (movedMarker === rightMarker) {
    inputId = 'right-search-input'
  }

  if (inputId) {
    document.getElementById(inputId).value = ''
  }
}

function fitMapToBounds (map, viewport) {
  if (viewport) {
    map.fitBounds(viewport)
  } else {
    map.setZoom(14)
  }
}

function updateMaps () {
  polylines.forEach((polyline) => polyline.setMap(null))
  polylines = []

  // Update the placemarks on all three maps
  leftMarkers.forEach(marker => marker.setPosition(leftMapMarkerPosition))
  centerMarkers.forEach(marker => marker.setPosition(centerMapMarkerPosition))
  rightMarkers.forEach(marker => marker.setPosition(rightMapMarkerPosition))

  // Draw the new geodesic lines on all three maps and store them
  polylines.push(...drawGeodesicLine(leftMapMarkerPosition, rightMapMarkerPosition, leftMap))
  polylines.push(...drawGeodesicLine(leftMapMarkerPosition, rightMapMarkerPosition, centerMap))
  polylines.push(...drawGeodesicLine(leftMapMarkerPosition, rightMapMarkerPosition, rightMap))
}

window.initMaps = initMaps
