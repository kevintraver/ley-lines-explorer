/* eslint-disable react/prop-types */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMagnifyingGlassLocation
} from '@fortawesome/free-solid-svg-icons'

function Controls({
  fitBoundsToPoints,
  map,
  centerMap,
  pointA,
  pointB,
  searchLocation
}) {
  return (
    <>
      <button
        className="absolute bottom-32 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => fitBoundsToPoints(map)}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </button>

      <button
        className="absolute bottom-24 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointA)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />A
      </button>

      <button
        className="absolute bottom-16 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointB)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />B
      </button>

      <button
        className="absolute bottom-8 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(searchLocation)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
        Search Location
      </button>
    </>
  )
}

export default Controls
