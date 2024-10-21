import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faEllipsisVertical,
    faHeart,
    faTrash,
    faDownload,
    faCircleInfo,
    faPlus,
    faEraser,
} from "@fortawesome/free-solid-svg-icons";
import "./MusicCard.scss";
import {
    successNotification,
    failedNotification,
    notification,
} from "../notification";
import MusicInfo from "./MusicInfo/MusicInfo";
import DeletePopup from "./DeleteConfirm/DelelePopup";
import AddPlaylistPopup from "./AddToPlaylist/AddPlaylistPopup";
import { fetchRemoveSongFromPlaylist, Song } from "../../userSlice";
import userSlice from "../../userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import useResetAndNavigate from "../../../../CustomHook/useResetAndNavigate";
import getDeviceFingerprint from "../../../../utilities/getDeviceFingerprint";
const APIurl = import.meta.env.VITE_APIServerUrl;

interface MusicCardPrams {
    songData: Song;
    playlistId: number | null;
}

export default function MusicCard({ songData, playlistId }: MusicCardPrams) {
    const dispatch = useDispatch<AppDispatch>();
    const resetAndNavigate = useResetAndNavigate();

    const [moreButton, setMoreButton] = React.useState(false);
    const [addPLaylist, setAddPlaylist] = React.useState(false);
    const [songInfo, setSongInfo] = React.useState(false);
    const [deletePopup, setDeletePopup] = React.useState(false);

    const moreButtonRef = React.useRef<HTMLDivElement | null>(null);
    //Setup Download
    const handleFileDownload = (data: Song) => {
        const tokenString = localStorage.getItem("token");
        if (!tokenString) {
            return;
        }
        const tokenData = JSON.parse(tokenString);

        notification(`Start download: ${data.name} - ${data.artist} `);
        axios
            .get(`${APIurl}/api/v1/users/songs/download/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    Fingerprint: getDeviceFingerprint(),
                },
                responseType: "blob",
            })
            .then((response) => {
                const contentType = response.headers["content-type"];
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {
                        type: contentType,
                    })
                );

                //Sai filename
                const filename = data.artist + " - " + data.name;
                console.log(filename);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                successNotification(
                    `Downnload completed: ${data.name} - ${data.artist}`
                );
            })
            .catch((error) => {
                if (error.response.data.code == 444) {
                    resetAndNavigate();
                    failedNotification(
                        "Your account logged in different location"
                    );
                    return;
                } else {
                    failedNotification(
                        `Have error when downloading: ${data.name} - ${data.artist}`
                    );
                }
            });
    };

    const handleFavoriteToggle = (id: number, favorite: boolean) => {
        const tokenString = localStorage.getItem("token");
        if (!tokenString) {
            return;
        }
        const tokenData = JSON.parse(tokenString);

        axios
            .patch(
                `${APIurl}/api/v1/users/songs/favorites/${id}`,
                {
                    isFavorite: !favorite,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            )
            .then(() => {
                if (favorite) {
                    successNotification(
                        `${songData.name} - ${songData.artist} removed from favorite list`
                    );
                } else {
                    successNotification(
                        `${songData.name} - ${songData.artist} added to favorite list`
                    );
                }
                dispatch(
                    userSlice.actions.handleFavoriteToggle({ id, favorite })
                );
            })
            .catch((error) => {
                if (error.response.data.code == 444) {
                    resetAndNavigate();
                    failedNotification(
                        "Your account logged in different location"
                    );
                    return;
                } else {
                    failedNotification("Oops... Something went wrong");
                    console.log(error);
                }
            });
    };

    const handleRemoveFromPlaylist = (playlistId: number, songId: number) => {
        dispatch(fetchRemoveSongFromPlaylist({ playlistId, songId }))
            .unwrap()
            .then((res) => {
                successNotification(res.msg);
            })
            .catch((err) => {
                if (err.response.data.code == 444) {
                    resetAndNavigate();
                    failedNotification(
                        "Your account logged in different location"
                    );
                    return;
                }
                failedNotification(err.msg);
            });
    };

    //Hiện moreButton và xử lý ClickOutside
    const moreButtonClickHandle = () => {
        setMoreButton((prev) => !prev);
    };

    const infoButtonClickHandle = () => {
        setSongInfo(true);
        setMoreButton(false);
    };

    const handleAddToPlaylist = () => {
        setAddPlaylist(true);
        setMoreButton(false);
    };

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!moreButtonRef.current!.contains(e.target as Node)) {
                setMoreButton(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div
            className="song-card"
            key={songData.id}
            style={{
                boxShadow:
                    songData.favorite && !playlistId
                        ? "0px 0px 5px rgba(255, 0, 0, 1), 0px 0px 25px rgba(255, 0, 0, 1)"
                        : "",
            }}
        >
            <div className="top-section">
                <img src={songData.albumImageBase64} alt="" />
                <div
                    className="play"
                    onClick={() =>
                        dispatch(userSlice.actions.setCurrentSongPlay(songData))
                    }
                    style={{ display: moreButton ? "none" : "" }} // Không Hiện nút play khi có more button
                >
                    <FontAwesomeIcon icon={faPlay} />
                </div>
            </div>
            <div className="more-option" ref={moreButtonRef}>
                <div
                    className="more-option-button"
                    onClick={moreButtonClickHandle}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} size="xl" />
                </div>
                {moreButton && (
                    <div className="popup-option">
                        <ul>
                            {playlistId ? (
                                ""
                            ) : (
                                <li onClick={handleAddToPlaylist}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </li>
                            )}
                            <li onClick={infoButtonClickHandle}>
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </li>
                            {!playlistId ? (
                                <li
                                    onClick={() =>
                                        handleFavoriteToggle(
                                            songData.id,
                                            songData.favorite
                                        )
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        style={{
                                            color: songData.favorite
                                                ? "red"
                                                : "",
                                            filter: songData.favorite
                                                ? "drop-shadow(0 0 5px red)"
                                                : "",
                                        }}
                                    />
                                </li>
                            ) : (
                                ""
                            )}

                            {playlistId ? (
                                <li
                                    onClick={() =>
                                        handleRemoveFromPlaylist(
                                            playlistId,
                                            songData.id
                                        )
                                    }
                                >
                                    <FontAwesomeIcon icon={faEraser} />
                                </li>
                            ) : (
                                <li onClick={() => setDeletePopup(true)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </li>
                            )}

                            <li onClick={() => handleFileDownload(songData)}>
                                <FontAwesomeIcon icon={faDownload} />
                            </li>
                        </ul>
                        <div className="shape"></div>
                    </div>
                )}
            </div>
            <p className="name">{songData.name}</p>
            <p className="artist">{songData.artist}</p>
            <MusicInfo
                songData={songData}
                songInfo={songInfo}
                setSongInfo={setSongInfo}
            />
            <DeletePopup
                songData={songData}
                deletePopup={deletePopup}
                setDeletePopup={setDeletePopup}
            />
            <AddPlaylistPopup
                songData={songData}
                addPlaylist={addPLaylist}
                setAddPlaylist={setAddPlaylist}
            />
        </div>
    );
}
