import React, { useRef, useCallback } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

function SearchComponent({ onPlaceSelected }) {
  const searchBoxRef = useRef(null);

  const onLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places.length === 0) return;
      onPlaceSelected(places[0]);
    }
  }, [onPlaceSelected]);

  return (
    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 w-60 h-8 px-3 rounded-md shadow-md text-sm outline-none overflow-ellipsis absolute top-8 left-1/2 transform -translate-x-1/2 z-10"
      />
    </StandaloneSearchBox>
  );
}

export default SearchComponent;
