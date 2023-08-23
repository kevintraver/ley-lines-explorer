import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
  Polyline
} from "@react-google-maps/api";
import SearchComponent from "./SearchComponent";

const mapContainerStyle = {
  height: "700px",
  width: "100%"
};

const userLocale = window.navigator.language;

// Format the distance based on the user's locale
const formatDistance = (distanceInMeters) => {
  if (["en-US", "en-GB"].includes(userLocale)) {
    // Use miles for US & UK
    const miles = distanceInMeters * 0.000621371;
    return `${miles.toFixed(2)} miles`;
  } else {
    // Use kilometers for other countries
    const kilometers = distanceInMeters / 1000;
    return `${kilometers.toFixed(2)} km`;
  }
};

const initialMapZoom = 4;

const initialMarker1Position = {
  // Oracle Park, San Francisco, CA
  lat: 37.7785951,
  lng: -122.389269
};

const initialMarker2Position = {
  // Wright Brothers Memorial, Kill Devil Hills, NC
  lat: 36.0183,
  lng: -75.6671
};

const options = {
  zoom: initialMapZoom,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeId: "hybrid",
  mapTypeControl: false
};

function MapComponent() {
  const [selectedPlacePosition, setSelectedPlacePosition] = useState(null);
  const [distanceToPath, setDistanceToPath] = useState(null);
  const [midpointOfLine, setMidpointOfLine] = useState(null);

  const [map, setMap] = React.useState(null);

  const computeClosestPointAndMidpoint = (point) => {
    const bearing = window.google.maps.geometry.spherical.computeHeading(
      new window.google.maps.LatLng(marker1Position),
      new window.google.maps.LatLng(marker2Position)
    );

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(marker1Position),
        new window.google.maps.LatLng(point)
      );

    const adjustedPosition =
      window.google.maps.geometry.spherical.computeOffset(
        new window.google.maps.LatLng(marker1Position),
        distance,
        bearing
      );

    const distanceToAdjustedPosition =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(point),
        adjustedPosition
      );

    const midpoint = window.google.maps.geometry.spherical.interpolate(
      new window.google.maps.LatLng(point),
      adjustedPosition,
      0.5
    );

    setDistanceToPath(distanceToAdjustedPosition);
    setMidpointOfLine(midpoint);

    return {
      adjustedPosition: {
        lat: adjustedPosition.lat(),
        lng: adjustedPosition.lng()
      }
    };
  };

  const onLoad = React.useCallback(function callback(map) {
    fitBoundsToMarkers(map);
    updatePathsBasedOnMarkers(marker1Position, marker2Position);
    setMap(map);
  }, []);

  const fitBoundsToMarkers = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(marker1Position);
    bounds.extend(marker2Position);
    map.fitBounds(bounds);
  };

  const updatePathsBasedOnMarkers = (pointA, pointB) => {
    // eslint-disable-next-line new-cap
    const midpoint = new window.google.maps.geometry.spherical.interpolate(
      new window.google.maps.LatLng(pointA),
      new window.google.maps.LatLng(pointB),
      0.5
    );

    const antipodalMidpoint = {
      lat: -midpoint.lat(),
      lng: (midpoint.lng() + 180) % 360
    };

    setPathShortest([pointA, pointB]);
    setPathLongest([pointA, antipodalMidpoint, pointB]);
  };

  const [pathShortest, setPathShortest] = useState([]);
  const [pathLongest, setPathLongest] = useState([]);
  const [lineToClosestPoint, setLineToClosestPoint] = useState([]);

  const [marker1Position, setMarker1Position] = useState(
    initialMarker1Position
  );
  const [marker2Position, setMarker2Position] = useState(
    initialMarker2Position
  );

  const handlePlaceSelected = (place) => {
    setSelectedPlacePosition({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    });
    // Extract latitude and longitude from the place object
    const point = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    const { adjustedPosition } = computeClosestPointAndMidpoint(point);

    // Set the line to the closest point
    setLineToClosestPoint([point, adjustedPosition]);

    // Create new bounds
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(point);
    bounds.extend(adjustedPosition);

    // Adjust the map to fit these bounds
    map.fitBounds(bounds);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCg3GhYlgSqmae3ql20SCuQoMhr90bUyD8"
      libraries={["places", "geometry"]}
    >
      <button
        className="absolute top-8 left-8 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => fitBoundsToMarkers(map)}
      >
        <FontAwesomeIcon icon={faExpand} />
      </button>

      <SearchComponent onPlaceSelected={handlePlaceSelected} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onLoad}
      >
        <Marker
          position={marker1Position}
          onDrag={(event) => {
            const newMarker1Position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            updatePathsBasedOnMarkers(newMarker1Position, marker2Position);
          }}
          draggable={true}
          onDragEnd={(event) => {
            setMarker1Position({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }}
        />
        <Marker
          position={marker2Position}
          draggable={true}
          onDrag={(event) => {
            const newMarker2Position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            updatePathsBasedOnMarkers(marker1Position, newMarker2Position);
          }}
          onDragEnd={(event) => {
            setMarker2Position({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }}
        />
        {selectedPlacePosition && (
          <Marker
            position={selectedPlacePosition}
            draggable={false}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#0000FF",
              fillOpacity: 0.8,
              strokeWeight: 0
            }}
          />
        )}

        <Polyline
          path={lineToClosestPoint}
          options={{
            strokeColor: "#00f",
            strokeWeight: 2
          }}
        />
        {midpointOfLine && (
          <OverlayView
            position={{ lat: midpointOfLine.lat(), lng: midpointOfLine.lng() }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 rounded shadow-md">
              {formatDistance(distanceToPath)}
            </div>
          </OverlayView>
        )}
        <Polyline
          path={pathShortest}
          options={{
            geodesic: true
          }}
        />
        <Polyline
          path={pathLongest}
          options={{
            geodesic: true,
            strokeOpacity: 0.33
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
