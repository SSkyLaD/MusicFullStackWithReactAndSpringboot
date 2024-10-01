import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./AddPlaylistPopup.scss";
import { successNotification, failedNotification } from "../../notification";
import { fetchAddSongToPlaylist, Song } from "../../../userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import useResetAndNavigate from "../../../../../CustomHook/useResetAndNavigate";

interface AddPlaylistPopupParams {
    songData: Song;
    addPlaylist: boolean;
    setAddPlaylist: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddPlaylistPopup({
    songData,
    addPlaylist,
    setAddPlaylist,
}: AddPlaylistPopupParams) {
    const dispatch = useDispatch<AppDispatch>();
    const resetAndNavigate = useResetAndNavigate();
    const { playlist } = useSelector(
        (state: RootState) => state.users.navBarState
    );

    const handleAddSongToPlaylist = (playlistId: number, songId: number) => {
        dispatch(fetchAddSongToPlaylist({ playlistId, songId }))
            .unwrap()
            .then((res) => {
                successNotification(res.msg);
                setAddPlaylist(false);
            })
            .catch((err) => {
                if(err.response.data.code == 444){
                    resetAndNavigate()
                    failedNotification(
                        "Your account logged in different location"
                    );
                    return;
                }
                failedNotification(err.msg);
            });
    };

    const playlistIcon = playlist.map((ele) => {
        return (
            <div
                className="playlist-box"
                key={ele.id}
                onClick={() => handleAddSongToPlaylist(ele.id, songData.id)}
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
