/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import Path from './Path'
import Controls from './Controls'
import Search from './Search'

const googleMapsLibraries = ['places', 'geometry']

const mapContainerStyle = {
  height: '700px',
  width: '100%'
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

  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null)

  // eslint-disable-next-line no-unused-vars
  const [pointA, setPointA] = useState({
    // Oracle Park, San Francisco, CA
    lat: 37.7785951,
    lng: -122.389269
  })
  // eslint-disable-next-line no-unused-vars
  const [pointB, setPointB] = useState({
    // Wright Brothers Memorial, Kill Devil Hills, NC
    lat: 36.0183,
    lng: -75.6671
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

  useEffect(() => {
    if (isLoaded) {
      calculateMidpoint(pointA, pointB)
    }
  }, [pointA, pointB])

  const fitBoundsToPoints = (map) => {
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

  const centerMap = (point) => {
    if (map && point.lat && point.lng) {
      map.panTo(point)
    }
  }

  const onLoad = React.useCallback(function callback(map) {
    calculateMidpoint(pointA, pointB)
    fitBoundsToPoints(map)
    setMap(map)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      options={options}
      onLoad={onLoad}
    >
      <Controls
        fitBoundsToPoints={fitBoundsToPoints}
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
        searchLocation={searchLocation}
        searchLocationPoint={searchLocationPoint}
        setSearchLocation={setSearchLocation}
        setSearchLocationPoint={setSearchLocationPoint}
      />
      {midPoint && midPoint.lat && midPoint.lng ? (
        <Path
          pointA={pointA}
          pointB={pointB}
          midPoint={midPoint}
          antipodalMidpoint={antipodalMidpoint}
          updatePointA={setPointA}
          updatePointB={setPointB}
        ></Path>
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default Map
