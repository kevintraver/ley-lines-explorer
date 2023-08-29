/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMagnifyingGlassLocation,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus
} from '@fortawesome/free-solid-svg-icons'

import Path from './Path'
import Controls from './Controls'
import Search from './Search'
import EndpointMarker from './EndpointMarker'

const googleMapsLibraries = ['places', 'geometry']

const mapContainerStyle = {
  width: '100vw',
  height: '100svh'
}

const options = {
  zoom: 4,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeId: 'hybrid',
  mapTypeControl: false,
  zoomControl: false
}

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries
  })

  const [map, setMap] = useState(null)

  const [currentZoomLevel, setCurrentZoomLevel] = useState(null)

  const [pointA, setPointA] = useState({
    // Oracle Park, San Francisco, CA
    lat: 37.77877314966314,
    lng: -122.38914105684685
  })
  const [pointB, setPointB] = useState({
    // Wright Brothers Memorial, Kill Devil Hills, NC
    lat: 36.01426826716314,
    lng: -75.66779406480183
  })

  const [midPoint, setMidPoint] = useState([])
  const [antipodalMidpoint, setAntipodalMidpoint] = useState([])

  const [searchLocation, setSearchLocation] = useState([])
  const [searchLocationPoint, setSearchLocationPoint] = useState([])

  const calculateMidpoint = (pointA, pointB) => {
    const midPointLatLng = window.google.maps.geometry.spherical.interpolate(
      new window.google.maps.LatLng(pointA),
      new window.google.maps.LatLng(pointB),
      0.5
    )
    const midPointObj = {
      lat: midPointLatLng.lat(),
      lng: midPointLatLng.lng()
    }
    setMidPoint(midPointObj)

    const antipodalMidpointObj = {
      lat: -midPointObj.lat,
      lng: (midPointObj.lng + 180) % 360
    }
    setAntipodalMidpoint(antipodalMidpointObj)
  }

  const fitMapBoundsToPoints = (map) => {
    const points = [pointA, pointB]
    if (
      searchLocationPoint &&
      searchLocationPoint.lat &&
      searchLocationPoint.lng
    ) {
      points.push(searchLocationPoint)
    }
    const bounds = new window.google.maps.LatLngBounds()
    points.forEach((point) => bounds.extend(point))
    map.fitBounds(bounds)
  }

  const fitMapBoundsToViewport = (map, viewport) => {
    if (viewport) {
      map.fitBounds(viewport)
    } else {
      map.setZoom(14)
    }
  }

  const centerMap = (point) => {
    if (map && point.lat && point.lng) {
      map.panTo(point)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      calculateMidpoint(pointA, pointB)
    }
  }, [pointA, pointB])

  const onLoad = React.useCallback(function callback(map) {
    calculateMidpoint(pointA, pointB)
    fitMapBoundsToPoints(map)
    setMap(map)
    map.addListener('zoom_changed', () => {
      setCurrentZoomLevel(map.getZoom())
    })
    map.addListener('dragend', () => {})
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      options={options}
      onLoad={onLoad}
    >
      <Controls
        fitMapBoundsToPoints={fitMapBoundsToPoints}
        currentZoomLevel={currentZoomLevel}
        map={map}
        centerMap={centerMap}
        pointA={pointA}
        pointB={pointB}
        searchLocation={searchLocation} // Make sure you have this state in your parent component
      />
      <Search
        map={map}
        pointA={pointA}
        pointB={pointB}
        centerMap={centerMap}
        fitMapBoundsToViewport={fitMapBoundsToViewport}
        searchLocation={searchLocation}
        searchLocationPoint={searchLocationPoint}
        setSearchLocation={setSearchLocation}
        setSearchLocationPoint={setSearchLocationPoint}
      />
      <EndpointMarker
        point={pointA}
        updatePoint={setPointA}
        centerMap={centerMap}
      />
      <Path
        pointA={pointA}
        pointB={pointB}
        midPoint={midPoint}
        antipodalMidpoint={antipodalMidpoint}
      ></Path>
      <EndpointMarker
        point={pointB}
        updatePoint={setPointB}
        centerMap={centerMap}
      />
    </GoogleMap>
  ) : (
    <></>
  )
}

export default Map
