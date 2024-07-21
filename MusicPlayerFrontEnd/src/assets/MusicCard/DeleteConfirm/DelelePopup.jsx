/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import "./DeletePopup.scss";
import axios from "axios";
import { TokenContext } from "../../../pages/UserPage/user";
import { successNotification, failedNotification } from "../../notification";
const APIurl = import.meta.env.VITE_APIServerUrl;

function DeletePopup({ deletePopup, setDeletePopup, songData, controlRender }) {
    const { tokenData, tracklist } = React.useContext(TokenContext);

    const handleDeleteSong = () => {
        tracklist.current = tracklist.current.filter(
            (song) => song.id !== songData.id
        );
        axios
            .delete(`${APIurl}/api/v1/users/songs/${songData.id}`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then(() => {
                successNotification(
                    `${songData.name} - ${songData.artist} DELETED successfully`
                );
                controlRender();
            })
            .catch((error) => {
                failedNotification("Oops... Something went wrong");
                console.log(error);
            });
    };

    return deletePopup ? (
        <div>
            <div className="popup-delete">
                <div className="popup-container">
                    <div className="pop-top">
                        <h3>DELETE: "{songData.name} - {songData.artist}"?</h3>
                        <p>This action wil delete data PERMENTLY and cannot be undone.</p>
                    </div>
                    <div className="pop-bot">
                        <button onClick={handleDeleteSong}>Confirm</button>
                        <button
                            className="close"
                            onClick={() => setDeletePopup(false)}
                        >
                            Cancle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default DeletePopup;
