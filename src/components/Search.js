import React, { useState, useRef, useCallback } from "react";
import { StandaloneSearchBox, Marker } from "@react-google-maps/api";

function Search({ ...props }) {
  const searchBoxRef = useRef(null);

  const [dropdownSelection, setDropdownSelection] = useState("search");
  const [searchLocation, setSearchLocation] = useState(null);

  const handleDropdownChange = (e) => {
    setDropdownSelection(e.target.value);
  };

  const onLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places.length === 0) return;

      const location = places[0].geometry.location;

      switch (dropdownSelection) {
        case "search":
          setSearchLocation(location);
          break;
        case "updateA":
          props.updatePointA(location);
          break;
        case "updateB":
          props.updatePointB(location);
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <>
          <div className="flex items-center absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <input
              type="text"
              className="border border-gray-300 w-60 h-8 px-3 rounded-md shadow-md text-sm outline-none overflow-ellipsis"
            />
            <select
              value={dropdownSelection}
              onChange={handleDropdownChange}
              className="ml-2 border border-gray-300 h-8 rounded-md shadow-md text-sm outline-none"
            >
              <option value="search">Search</option>
              <option value="updateA">Update Point A</option>
              <option value="updateB">Update Point B</option>
            </select>
          </div>
        </>
      </StandaloneSearchBox>
      {searchLocation && <Marker position={searchLocation} draggable={true} />}
    </>
  );
}

export default Search;
