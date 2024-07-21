import axios from "axios";
import React from "react";
import { TokenContext } from "../../../pages/UserPage/user";
import { successNotification } from "../../notification";
import "./CreateListConfirm.scss";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function CreateListConfirm({ createList, setCreateList,getUserLists }) {
    const { tokenData } = React.useContext(TokenContext);
    const [listName, setListName] = React.useState("");
    const [warning, setWarning] = React.useState("");

    const handleConfirmButton = () => {
        if (!listName) {
            setWarning("Playlist name cannot empty");
            return;
        }
        axios
            .post(
                `${APIurl}/api/v1/users/lists`,
                {
                    name: `${listName}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then((res) => {
                successNotification(res.data.msg);
                setCreateList(false);
                setListName("");
                getUserLists(tokenData.token);
            })
            .catch((err) => {
                setWarning(err.response.data.msg);
            });
    };

    const handleCancelButton = () => {
        setListName("");
        setCreateList(false);
    };

    const handleChange = (event) => {
        setListName(event.target.value);
    };

    return createList ? (
        <div className="create-popup">
            <div className="create-container">
                <div className="top-section">
                    <h3>Create new playlist</h3>
                    <input
                        type="text"
                        className="name-input"
                        placeholder="Enter playlist name..."
                        value={listName}
                        onChange={handleChange}
                    />
                    <p className="warning">{warning}</p>
                </div>
                <div className="bottom-section">
                    <button className="confirm" onClick={handleConfirmButton}>
                        Create
                    </button>
                    <button className="cancel" onClick={handleCancelButton}>
                        Cancle
                    </button>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}
