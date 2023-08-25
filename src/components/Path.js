/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Marker, Polyline } from '@react-google-maps/api'
// import Buffer from "./Buffer";

function Path({ pointA, pointB, midPoint, antipodalMidpoint, ...props }) {
  const [pathShortest, setPathShortest] = useState([])
  const [pathLongest, setPathLongest] = useState([])

  useEffect(() => {
    setPathShortest([pointA, pointB])
    setPathLongest([pointA, antipodalMidpoint, pointB])
  }, [pointA, pointB, midPoint, antipodalMidpoint])

  return (
    <>
      <Marker
        position={pointA}
        draggable={true}
        onDrag={(event) => {
          const newPointA = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
          props.updatePointA(newPointA)
        }}
      />
      <Polyline
        path={pathShortest}
        options={{
          geodesic: true
        }}
      />

      <Marker
        position={pointB}
        draggable={true}
        onDrag={(event) => {
          const newPointB = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
          props.updatePointB(newPointB)
        }}
      />
      <Polyline
        path={pathLongest}
        options={{
          geodesic: true,
          strokeOpacity: 0.33
        }}
      />
      {/* <Buffer pointA={pointA} pointB={pointB} /> */}
    </>
  )
}

export default Path
