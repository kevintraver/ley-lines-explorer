/* eslint-disable react/prop-types */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

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
        <FontAwesomeIcon icon={faExpand} />
      </button>

      {/* New Button to Center on pointA */}
      <button
        className="absolute bottom-24 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointA)}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        Point A
      </button>

      {/* New Button to Center on pointB */}
      <button
        className="absolute bottom-16 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(pointB)}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        Point B
      </button>

      {/* New Button to Center on searchLocation */}
      <button
        className="absolute bottom-8 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => centerMap(searchLocation)}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        Search Location
      </button>
    </>
  )
}

export default Controls
