import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Loading.scss"

export default function Loading() {
    return <FontAwesomeIcon className="spinner" icon={faSpinner} />;
}
