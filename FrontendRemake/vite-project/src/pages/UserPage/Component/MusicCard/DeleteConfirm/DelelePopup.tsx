import React from "react";
import "./DeletePopup.scss";
import axios from "axios";
import { successNotification, failedNotification } from "../../notification";
import { Song } from "../../../userSlice";
import { useDispatch } from "react-redux";
import userSlice from "../../../userSlice";
const APIurl = import.meta.env.VITE_APIServerUrl;

interface DelelePopupParams {
    deletePopup: boolean;
    setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
    songData: Song;
}

function DeletePopup({
    deletePopup,
    setDeletePopup,
    songData,
}: DelelePopupParams) {
    const dispatch = useDispatch();

    const handleDeleteSong = () => {
        const tokenString = localStorage.getItem("token");
        if (!tokenString) {
            return;
        }
        const tokenData = JSON.parse(tokenString);
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
                dispatch(userSlice.actions.handleDeleteSong(songData.id));
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
                        <h3>
                            DELETE: "{songData.name} - {songData.artist}"?
                        </h3>
                        <p>
                            This action wil delete data PERMENTLY and cannot be
                            undone.
                        </p>
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
