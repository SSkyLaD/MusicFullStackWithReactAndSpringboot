import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./AddPlaylistPopup.scss";
import { TokenContext } from "../../../pages/UserPage/user";
import { successNotification, failedNotification } from "../../notification";
import axios from "axios";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function AddPlaylistPopup({
    addPlaylist,
    setAddPlaylist,
    songData,
}) {
    const { tokenData, userLists } = React.useContext(TokenContext);

    const addSongToPlaylist = (playlistId, songId) => {
        axios
            .post(
                `${APIurl}/api/v1/users/lists/${playlistId}/songs/${songId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then((res) => {
                successNotification(res.data.msg);
                setAddPlaylist(false);
            })
            .catch((err) => {
                failedNotification(err.response.data.msg);
            });
    };
    

    const playlistIcon = userLists.map((ele) => {
        return (
            <div
                className="playlist-box"
                key={ele.id}
                onClick={() => addSongToPlaylist(ele.id, songData.id)}
            >
                <FontAwesomeIcon icon={faPlus} />
                <p>{ele.name}</p>
            </div>
        );
    });

    return addPlaylist ? (
        <div className="add-page">
            <div className="add-container">
                <div className="pop-top">
                    <h3>Add song to your playlist</h3>
                    <div className="playlist-container">{playlistIcon}</div>
                </div>
                <div className="pop-bot">
                    <button onClick={() => setAddPlaylist(false)}>Close</button>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}
