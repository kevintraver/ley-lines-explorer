import React, { useEffect, useState } from 'react'

import { Polygon } from '@react-google-maps/api'

function Buffer({ pointA, pointB }) {
  const [rectangleCoords, setRectangleCoords] = useState([])

  function computeBearing(pointA, pointB) {
    return window.google.maps.geometry.spherical.computeHeading(
      new window.google.maps.LatLng(pointA),
      new window.google.maps.LatLng(pointB)
    )
  }

  function computeRectangleBuffer(pointA, pointB, bufferDistance) {
    const bearing = computeBearing(pointA, pointB)

    // Ensure bearings are in [0, 360) range
    const leftBearing = (bearing - 90 + 360) % 360
    const rightBearing = (bearing + 90) % 360

    // Compute the four corner points
    const topLeft = window.google.maps.geometry.spherical.computeOffset(
      new window.google.maps.LatLng(pointA.lat, pointA.lng),
      bufferDistance / 2,
      leftBearing
    )
    const topRight = window.google.maps.geometry.spherical.computeOffset(
      new window.google.maps.LatLng(pointA.lat, pointA.lng),
      bufferDistance / 2,
      rightBearing
    )
    const bottomLeft = window.google.maps.geometry.spherical.computeOffset(
      new window.google.maps.LatLng(pointB.lat, pointB.lng),
      bufferDistance / 2,
      leftBearing
    )
    const bottomRight = window.google.maps.geometry.spherical.computeOffset(
      new window.google.maps.LatLng(pointB.lat, pointB.lng),
      bufferDistance / 2,
      rightBearing
    )

    return [
      topLeft.toJSON(),
      topRight.toJSON(),
      bottomRight.toJSON(),
      bottomLeft.toJSON()
    ]
  }

  const bufferDistance = 1000 // 1 km

  useEffect(() => {
    setRectangleCoords(computeRectangleBuffer(pointA, pointB, bufferDistance))
  }, [pointA, pointB])

  return (
    <>
      <Polygon
        path={rectangleCoords}
        options={{
          geodesic: true,
          fillColor: '#00FF00',
          fillOpacity: 0.2,
          strokeWeight: 0
        }}
      />
    </>
  )
}

export default Buffer
