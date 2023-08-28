/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Polyline } from '@react-google-maps/api'
// import Buffer from "./Buffer";

function Path({ pointA, pointB, midPoint, antipodalMidpoint }) {
  const [pathShortest, setPathShortest] = useState([])
  const [pathLongest, setPathLongest] = useState([])

  useEffect(() => {
    setPathShortest([pointA, pointB])
    setPathLongest([pointA, antipodalMidpoint, pointB])
  }, [pointA, pointB, midPoint, antipodalMidpoint])

  return (
    <>
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
      {/* <Buffer pointA={pointA} pointB={pointB} /> */}
    </>
  )
}

export default Path
