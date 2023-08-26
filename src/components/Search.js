/* eslint-disable no-undef */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback } from 'react'
import { StandaloneSearchBox, Marker } from '@react-google-maps/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMagnifyingGlassLocation
} from '@fortawesome/free-solid-svg-icons'
import OffsetPath from './OffsetPath'

function Search({
  map,
  pointA,
  pointB,
  centerMap,
  searchLocation,
  searchLocationPoint,
  setSearchLocation,
  setSearchLocationPoint
}) {
  const searchBoxRef = useRef(null)
  const searchInputRef = useRef(null)

  const onLoad = useCallback((ref) => {
    searchBoxRef.current = ref
  }, [])

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces()
      if (places.length === 0) return

      const location = places[0].geometry.location
      setSearchLocation(location)
      setSearchLocationPoint({
        lat: location.lat(),
        lng: location.lng()
      })
      centerMap(location)
    }
  }

  return (
    <>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <>
          <div className="flex items-center absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="border border-gray-300 w-60 h-8 px-3 rounded-md shadow-md text-sm outline-none overflow-ellipsis"
            />
            <button
              className="ml-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
              onClick={() => centerMap(searchLocationPoint)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
            </button>
          </div>
        </>
      </StandaloneSearchBox>
      {searchLocation.lat && searchLocation.lng && (
        <Marker
          position={searchLocation}
          draggable={true}
          onDrag={(event) => {
            setSearchLocationPoint(event.latLng.toJSON())
          }}
          onDragEnd={(event) => {
            if (searchInputRef.current) {
              searchInputRef.current.value = ''
            }
          }}
          icon={{
            url: 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png'
          }}
        />
      )}
      {/* {searchLocation.lat && searchLocation.lng && (
        <OffsetPath
          pointA={pointA}
          pointB={pointB}
          offsetPoint={searchLocationPoint}
        />
      )} */}
    </>
  )
}

export default Search
