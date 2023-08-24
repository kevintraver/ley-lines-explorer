import React, { useState } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import Path from "./Path";
import Controls from "./Controls";
import Search from "./Search";

const googleMapsLibraries = ["places", "geometry"];

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
  const { isLoaded } = useJsApiLoader({
    id: "google-maps",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries
  });

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

  const fitBoundsToPoints = (map, points = [pointA, pointB]) => {
    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);
  };

  const onLoad = React.useCallback(function callback(map) {
    fitBoundsToPoints(map);
    setMap(map);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      options={options}
      onLoad={onLoad}
    >
      <Controls fitBoundsToPoints={fitBoundsToPoints} map={map}></Controls>
      <Search
        map={map}
        pointA={pointA}
        pointB={pointB}
        fitBoundsToPoints={fitBoundsToPoints}
        updatePointA={setPointA}
        updatePointB={setPointB}
      />
      <Path
        pointA={pointA}
        pointB={pointB}
        updatePointA={setPointA}
        updatePointB={setPointB}
      ></Path>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default Map;
