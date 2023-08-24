import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

function Controls({ ...props }) {
  return (
    <>
      <button
        className="absolute bottom-32 right-2 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer"
        onClick={() => props.fitBoundsToPoints(props.map)}
      >
        <FontAwesomeIcon icon={faExpand} />
      </button>
    </>
  );
}

export default Controls;