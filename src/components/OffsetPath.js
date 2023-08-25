import React from 'react'

import { Polyline } from '@react-google-maps/api'

function OffsetPath({ pointA, pointB, offsetPoint }) {
  return (
    <>
      <Polyline
        path={[pointA, offsetPoint]}
        options={{
          geodesic: true,
          strokeOpacity: 0.5,
          strokeWeight: 2
        }}
      />
    </>
  )
}

export default OffsetPath
