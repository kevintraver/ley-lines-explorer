/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Marker, Polyline } from '@react-google-maps/api'
// import Buffer from "./Buffer";

function Path({ pointA, pointB, ...props }) {
  const [midPoint, setMidPoint] = useState([])
  const [antipodalMidpoint, setAntipodalMidpoint] = useState([])

  const [pathShortest, setPathShortest] = useState([])
  const [pathLongest, setPathLongest] = useState([])

  useEffect(() => {
    const midPointLatLng = window.google.maps.geometry.spherical.interpolate(
      new window.google.maps.LatLng(pointA),
      new window.google.maps.LatLng(pointB),
      0.5
    )

    const midPointObj = {
      lat: midPointLatLng.lat(),
      lng: midPointLatLng.lng()
    }
    setMidPoint(midPointObj)

    const antipodalMidpointObj = {
      lat: -midPointObj.lat,
      lng: (midPointObj.lng + 180) % 360
    }
    setAntipodalMidpoint(antipodalMidpointObj)

    setPathShortest([pointA, pointB])
    setPathLongest([pointA, antipodalMidpointObj, pointB])
  }, [pointA, pointB])

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
