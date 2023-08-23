import React, { useEffect, useState } from "react";
import { Marker, Polyline } from "@react-google-maps/api";

function Path({ pointA, pointB }) {
  const [pathShortest, setPathShortest] = useState([]);
  const [pathLongest, setPathLongest] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Marker
        position={pointA}
        onDrag={(event) => {}}
        draggable={true}
        onDragEnd={(event) => {}}
      />
      <Polyline
        path={pathShortest}
        options={{
          geodesic: true
        }}
      />

      <Marker
        position={{ lat: 36.0183, lng: -75.6671 }}
        draggable={true}
        onDragEnd={(event) => {}}
      />
      <Polyline
        path={pathLongest}
        options={{
          geodesic: true,
          strokeOpacity: 0.33
        }}
      />
    </>
  );
}

export default Path;
