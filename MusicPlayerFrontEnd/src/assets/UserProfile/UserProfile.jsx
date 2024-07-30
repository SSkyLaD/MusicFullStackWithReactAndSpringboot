import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import { TokenContext } from "../../pages/MainUserPage/user";
import DeleteAccountConfirm from "./DeleteAccountConfirm/DeleteAccountConfirm";
import "./UserProfile.scss";
import { failedNotification, successNotification } from "../notification";
import axios from "axios";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function UserProfile() {
    const { tokenData, getUserAvatar , getUserBackground} = React.useContext(TokenContext);
    const [username, setUsername] = React.useState("Unknow");
    const [createDate, setCreateDate] = React.useState("Unknow");
    const [numberOfSongs, setNumberOfSongs] = React.useState("Unknow");
    const [nuberOfPlaylists, setNumberOfPlaylists] = React.useState("Unknow");
    const [availableMemory, setAvailableMemory] = React.useState(0);
    const [avatar, setAvatar] = React.useState("");
    const [background, setBackground] = React.useState("");
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [changeImage, setChangeImage] = React.useState(false);
    const [avatarImageFile, setAvatarImageFile] = React.useState(null);
    const [backgroundImageFile, setBackgroundImageFile] = React.useState(null);

    const changeImageContainerRef = React.useRef(null);
    const changeImageButtonRef = React.useRef(null);

    const changeAvatarRef = React.useRef(null);
    const changeBackgroundRef = React.useRef(null);

    const dateConvert = (input) => {
        if (!input) {
            return "...";
        }
        const dateFromDB = new Date(input);
        const day = String(dateFromDB.getDate()).padStart(2, "0");
        const month = String(dateFromDB.getMonth() + 1).padStart(2, "0");
        const year = dateFromDB.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    const handleDeleteAcc = () => {
        setDeleteConfirm(true);
    };

    const handleOpenChangeImage = () => {
        setChangeImage((prev) => !prev);
    };

    const getUserData = () => {
        axios
            .get(`${APIurl}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                setUsername(res.data.data.username);
                setCreateDate(dateConvert(res.data.data.accountCreateDate));
                setNumberOfSongs(res.data.data.numberOfSong);
                setNumberOfPlaylists(res.data.data.numberOfPlaylist);
                setAvailableMemory(res.data.data.availableMemory);
                setAvatar(res.data.data.avatarImage);
                setBackground(res.data.data.backgroundImage);
            })
            .catch((err) => {
                failedNotification(err.response.data.msg);
            });
    };

    const handleAvatarImageChange = (e) => {
        setAvatarImageFile(e.target.files);
    };

    const handleBackgroundImageChange = (e) =>{
        setBackgroundImageFile(e.target.files);
    }

    const uploadAvatarImage = () => {
        if (!avatarImageFile) {
            failedNotification("No file selected");
            return;
        }

        const fd = new FormData();
        fd.append("file", avatarImageFile[0]);

        axios
            .post(`${APIurl}/api/v1/users/avatar/upload`, fd, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then(() => {
                successNotification("Avatar changed successfully");
                setAvatarImageFile(null);
                changeAvatarRef.current.value = null;
                getUserAvatar();
                getUserData();
            })
            .catch((err) => {
                failedNotification(err.data.msg);
            });
    };

    const uploadBackgroundImage = () => {
        if (!backgroundImageFile) {
            failedNotification("No file selected");
            return;
        }

        const fd = new FormData();
        fd.append("file", backgroundImageFile[0]);

        axios
            .post(`${APIurl}/api/v1/users/background/upload`, fd, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then(() => {
                successNotification("Avatar changed successfully");
                setBackgroundImageFile(null);
                changeBackgroundRef.current.value = null;
                getUserBackground();
                getUserData();
            })
            .catch((err) => {
                failedNotification(err.data.msg);
            });
    };

    React.useEffect(() => {
        getUserData();
    }, []);

    React.useEffect(() => {
        const handler = (e) => {
            if (
                changeImageContainerRef.current &&
                !changeImageContainerRef.current.contains(e.target) &&
                !changeImageButtonRef.current.contains(e.target)
            ) {
                setChangeImage(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div
            className="back-ground"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
            }}
        >
            <div className="main-container">
                <div className="main-left">
                    <FontAwesomeIcon
                        icon={faPencil}
                        className="edit-pic"
                        onClick={handleOpenChangeImage}
                        ref={changeImageButtonRef}
                    />
                    {changeImage ? (
                        <div
                            className="upload-container"
                            ref={changeImageContainerRef}
                        >
                            <input
                                type="file"
                                accept=".jpg, .png"
                                onChange={handleAvatarImageChange}
                                ref={changeAvatarRef}
                            />
                            <button onClick={uploadAvatarImage}>
                                Change avatar
                            </button>
                            <input
                                type="file"
                                accept=".jpg, .png"
                                onChange={handleBackgroundImageChange}
                                ref={changeBackgroundRef}
                            />
                            <button onClick={uploadBackgroundImage}>Change background</button>
                        </div>
                    ) : (
                        ""
                    )}
                    <div
                        className="ava-container"
                        style={{
                            backgroundImage: `url(${avatar})`,
                            backgroundSize: "cover",
                        }}
                    ></div>
                    <div className="username-container">
                        <h3>{username}</h3>
                    </div>
                </div>
                <div className="main-right">
                    <h2>Some of your data...</h2>
                    <ul>
                        <li>
                            <h3>Username: </h3>
                            <p>{username}</p>
                        </li>
                        <li>
                            <h3>Account create date: </h3>
                            <p>{createDate}</p>
                        </li>
                        <li>
                            <h3>Number of songs: </h3>
                            <p>{numberOfSongs}</p>
                        </li>
                        <li>
                            <h3>Number of playlist: </h3>
                            <p>{nuberOfPlaylists}</p>
                        </li>
                        <li>
                            <h3>Your available memory: </h3>
                            <p>
                                {Math.round(availableMemory * 100) / 100}MB /
                                1024MB
                            </p>
                        </li>
                    </ul>
                    <div className="memory-bar">
                        <div
                            className="memory-progress"
                            style={{
                                width: `${
                                    100 - (availableMemory / 1024) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                    <div className="right-bot">
                        <button
                            className="delete-acc"
                            onClick={handleDeleteAcc}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <p>Delete Account</p>
                        </button>
                    </div>
                </div>
                <DeleteAccountConfirm
                    username={username}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                />
            </div>
        </div>
    );
}
