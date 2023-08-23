import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

function Controls() {
  return (
    <>
      <button className="absolute top-4 left-8 z-10 bg-white px-4 h-8 flex items-center border border-gray-300 rounded cursor-pointer">
        <FontAwesomeIcon icon={faExpand} />
      </button>
    </>
  );
}

export default Controls;
