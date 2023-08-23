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

const initialCenterCoordinates = {
  lat: 39.0853,
  lng: -94.5851
};

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
  zoom: 4,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeId: "hybrid",
  mapTypeControl: false,
  center: initialCenterCoordinates
};

function MapComponent() {
  const [mapCenter, setMapCenter] = useState(initialCenterCoordinates);

  const [marker1Position, setMarker1Position] = useState(
    initialMarker1Position
  );
  const [marker2Position, setMarker2Position] = useState(
    initialMarker2Position
  );

  const handlePlaceSelected = (location) => {
    setMapCenter({ lat: location.lat(), lng: location.lng() });
  };

  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCg3GhYlgSqmae3ql20SCuQoMhr90bUyD8"
      libraries={["places"]}
    >
      <SearchComponent onPlaceSelected={handlePlaceSelected} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={options}
        center={mapCenter}
      >
        <Marker
          position={marker1Position}
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
          onDragEnd={(event) => {
            setMarker2Position({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }}
        />
        <Polyline
          path={[marker1Position, marker2Position]}
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
