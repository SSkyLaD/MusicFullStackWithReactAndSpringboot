import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Loading.scss";

export default function Loading() {
    return (
        <div className="container">
            <FontAwesomeIcon className="spinner" icon={faSpinner} />
        </div>
    );
}
