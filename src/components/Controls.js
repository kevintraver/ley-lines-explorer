/* eslint-disable react/prop-types */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMagnifyingGlassLocation
} from '@fortawesome/free-solid-svg-icons'

function Controls({
  fitMapBoundsToPoints,
  map,
  centerMap,
  pointA,
  pointB,
  searchLocation
}) {
  return (
    <>
      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => fitMapBoundsToPoints(map)}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </button>

      <button
        className="absolute bottom-8 left-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointA)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
      </button>

      <button
        className="absolute bottom-8 right-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointB)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
      </button>
    </>
  )
}

export default Controls
