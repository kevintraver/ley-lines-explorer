Certainly! Below is a detailed README and specification for the given JavaScript and HTML code.

---

# Ley Lines Explorer

## Overview

The Ley Lines Explorer is a web application that allows the user to explore and manipulate markers on three different maps. The markers can represent different locations, and the user can search for locations, recenter the maps, lock the markers to geodesic lines, and drag the markers to update their positions.

## Features

### Maps

- **Three Maps**: The application contains three separate maps representing different views. These are called the left map, center map, and right map.
- **Marker Types**: Each map has three markers titled "Left Marker", "Center Marker", and "Right Marker".
- **Geodesic Lines**: Lines are drawn between the left and right markers, displaying both the shortest and longer geodesic paths.
- **Draggable Markers**: Some markers can be dragged, updating the positions of other markers and the geodesic lines.

### Search Boxes

- **Search Locations**: Users can search for locations using the search boxes above each map. The result will update the corresponding marker's position and viewport.
- **Recenter Buttons**: Next to each search box is a recenter button that recenters the map to the corresponding marker's position.

### Controls

- **Lock To Line Checkboxes**: These checkboxes allow the user to lock the left, center, or right markers to the geodesic lines.
- **Move Radio Buttons**: These buttons control the movement of the center marker relative to the left and right markers.

## Specifications

### Variables

- `polylines`: An array to track lines drawn on the maps.
- `leftMap`, `rightMap`, `centerMap`: Map objects for each map.
- `leftMarkers`, `centerMarkers`, `rightMarkers`: Arrays holding markers for each map.
- `leftMarker`, `centerMarker`, `rightMarker`: Specific markers to track updating on events.
- `previewMarker`: Marker used for previewing the adjusted position.
- `redCircleIcon`: Icon configuration for some markers.
- `lockedMarker`: Variable to track which marker is locked.
- `leftMarkerLockedToBearing`, `centerMarkerLockedToBearing`, `rightMarkerLockedToBearing`: Booleans to track if markers are locked to a bearing.

### Functions

- `initMaps()`: Initializes the maps, markers, and event listeners.
- `drawGeodesicLine(start, end, map)`: Draws geodesic lines between two points.
- `markerMoved(movedMarker)`: Handles marker movement.
- `debounce(func, wait)`: Debounces function calls.
- `centerMarkerMoved(centerMarker)`: Handles center marker movement.
- `endpointMarkerMoved(movedMarker)`: Handles endpoint marker movement.
- `centerMaps(maps)`: Centers maps to their corresponding markers.
- `clearSearchInput(movedMarker)`: Clears the search input box.
- `fitMapToBounds(map, viewport)`: Fits the map to given bounds.
- `updateMarkers(...)`: Updates the markers' positions.
- `adjustPositionToGeodesicLine(...)`: Adjusts a marker's position to lie on a geodesic line.
- `updatePreviewMarker(position, map)`: Updates the preview marker.
- `toggleMoveRadioButtons(disabled)`: Toggles the radio buttons for moving the center marker.
- `unsetLockToLines()`: Unsets the lock to lines for all markers.
- `drawLines()`: Draws the geodesic lines on the maps.

## HTML Structure

- Three columns, each containing a search box, recenter button, and map.
- A controls row with checkboxes and radio buttons for controlling the marker behavior.

## Dependencies

- Google Maps JavaScript API: Used to render the maps and provide geolocation functionality.
- Tailwind CSS: Used for styling the HTML components.

## Note

Please make sure to replace the Google Maps API key in the script tag with your own.

---

The code provided creates a comprehensive and interactive map experience, allowing users to explore and manipulate the relationships between different locations on three maps. It offers various functionalities such as searching, recentering, locking to lines, and dragging to make the application highly interactive and user-friendly.