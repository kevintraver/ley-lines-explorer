/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Globe, MapPin } from '@phosphor-icons/react'

function Controls({
  fitMapBoundsToPoints,
  map,
  centerMap,
  pointA,
  pointB,
  searchLocation,
  currentZoomLevel
}) {
  return (
    <>
      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => fitMapBoundsToPoints(map)}
      >
        <Globe></Globe>
      </button>

      <button
        className="absolute bottom-8 left-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => {}}
      >
        <MapPin></MapPin>
      </button>

      <button
        className="absolute bottom-8 right-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => {}}
      >
        <MapPin></MapPin>
      </button>
    </>
  )
}

export default Controls
