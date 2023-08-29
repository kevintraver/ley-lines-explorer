/* eslint-disable react/prop-types */
import React from 'react'
import { Marker } from '@react-google-maps/api'

function EndpointMarker({ point, updatePoint, centerMap }) {
  return (
    <>
      <Marker
        position={point}
        draggable={true}
        onDrag={(event) => {
          updatePoint({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          })
        }}
        onDragEnd={(event) => {
          centerMap(event.latLng.toJSON())
        }}
        icon={{
          url: 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png'
        }}
      />
    </>
  )
}

export default EndpointMarker
