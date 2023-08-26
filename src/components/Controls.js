/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMagnifyingGlassLocation,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus
} from '@fortawesome/free-solid-svg-icons'

function Controls({
  fitMapBoundsToPoints,
  map,
  centerMap,
  pointA,
  pointB,
  searchLocation,
  currentZoomLevel,
  shouldZoomInA,
  setShouldZoomInA,
  shouldZoomInB,
  setShouldZoomInB,
  iconStateA,
  setIconStateA,
  iconStateB,
  setIconStateB
}) {
  // Local state to track the previous zoom levels and icon state
  const [prevZoomLevelA, setPrevZoomLevelA] = useState(currentZoomLevel)
  const [prevZoomLevelB, setPrevZoomLevelB] = useState(currentZoomLevel)

  // Generalized function to handle centering and zooming
  const handleCenterAndZoom = (
    point,
    shouldZoomIn,
    setShouldZoomIn,
    setPrevZoomLevel,
    setIconState
  ) => {
    if (map) {
      centerMap(point)
      if (shouldZoomIn) {
        setPrevZoomLevel(currentZoomLevel)
        map.setZoom(8) // Zoom to level 8
        setIconState(faMagnifyingGlassMinus) // Set icon to minus
      } else {
        map.setZoom(prevZoomLevelA || currentZoomLevel) // Zoom to previous level or current level if null
        setIconState(faMagnifyingGlassPlus) // Reset icon to plus
      }
      setShouldZoomIn(!shouldZoomIn)
    }
  }

  return (
    <>
      {/* Existing buttons */}
      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => fitMapBoundsToPoints(map)}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </button>

      {/* Button for point A */}
      <button
        className="absolute bottom-8 left-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() =>
          handleCenterAndZoom(
            pointA,
            shouldZoomInA,
            setShouldZoomInA,
            setPrevZoomLevelA,
            setIconStateA
          )
        }
      >
        <FontAwesomeIcon icon={iconStateA} />
      </button>

      {/* Button for point B */}
      <button
        className="absolute bottom-8 right-4 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() =>
          handleCenterAndZoom(
            pointB,
            shouldZoomInB,
            setShouldZoomInB,
            setPrevZoomLevelB,
            setIconStateB
          )
        }
      >
        <FontAwesomeIcon icon={iconStateB} />
      </button>
    </>
  )
}

export default Controls
