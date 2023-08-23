import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline
} from "@react-google-maps/api";
import SearchComponent from "./SearchComponent";

const mapContainerStyle = {
  height: "700px",
  width: "100%"
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
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    fitBoundsToMarkers(map);
    setMap(map);
  }, []);

  const fitBoundsToMarkers = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(marker1Position);
    bounds.extend(marker2Position);
    map.fitBounds(bounds);
  };

  const [path, setPath] = useState([
    initialMarker1Position,
    initialMarker2Position
  ]);

  const [marker1Position, setMarker1Position] = useState(
    initialMarker1Position
  );
  const [marker2Position, setMarker2Position] = useState(
    initialMarker2Position
  );

  const handlePlaceSelected = (location) => {
    setMapCenter({ lat: location.lat(), lng: location.lng() });
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCg3GhYlgSqmae3ql20SCuQoMhr90bUyD8"
      libraries={["places"]}
    >
      <button
        className="absolute top-6 left-6 z-10 bg-white px-4 py-2 border border-gray-300 rounded cursor-pointer"
        onClick={() => fitBoundsToMarkers(map)}
      >
        Recenter
      </button>

      <SearchComponent onPlaceSelected={handlePlaceSelected} />
      <GoogleMap
        zoom={initialMapZoom}
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onLoad}
      >
        <Marker
          position={marker1Position}
          onDrag={(event) => {
            setPath((prevPath) => [
              { lat: event.latLng.lat(), lng: event.latLng.lng() },
              prevPath[1]
            ]);
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
            setPath((prevPath) => [
              prevPath[0],
              { lat: event.latLng.lat(), lng: event.latLng.lng() }
            ]);
          }}
          onDragEnd={(event) => {
            setMarker2Position({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }}
        />
        <Polyline
          path={path}
          options={{
            geodesic: true,
            strokeWeight: 2
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
