import React, { useState } from "react";

import { GoogleMap, LoadScript } from "@react-google-maps/api";

import Path from "./Path";
import Controls from "./Controls";
import Search from "./Search";

const mapContainerStyle = {
  height: "700px",
  width: "100%"
};

const options = {
  zoom: 4,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeId: "hybrid",
  mapTypeControl: false
};

function Map() {
  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [pointA, setPointA] = useState({
    // Oracle Park, San Francisco, CA
    lat: 37.7785951,
    lng: -122.389269
  });
  // eslint-disable-next-line no-unused-vars
  const [pointB, setPointB] = useState({
    // Wright Brothers Memorial, Kill Devil Hills, NC
    lat: 36.0183,
    lng: -75.6671
  });

  const fitBoundsToPathMarkers = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pointA);
    bounds.extend(pointB);
    map.fitBounds(bounds);
  };

  const onLoad = React.useCallback(function callback(map) {
    fitBoundsToPathMarkers(map);
    setMap(map);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCg3GhYlgSqmae3ql20SCuQoMhr90bUyD8"
      libraries={["places", "geometry"]}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onLoad}
      >
        <Controls
          fitBoundsToPathMarkers={fitBoundsToPathMarkers}
          map={map}
        ></Controls>
        <Search />
        <Path
          pointA={pointA}
          pointB={pointB}
          updatePointA={setPointA}
          updatePointB={setPointB}
        ></Path>
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
