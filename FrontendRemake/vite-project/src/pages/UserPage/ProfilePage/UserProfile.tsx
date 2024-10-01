import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import DeleteAccountConfirm from "./DeleteAccountConfirm/DeleteAccountConfirm";
import "./UserProfile.scss";
import {
    failedNotification,
    successNotification,
} from "../Component/notification";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { uploadAvatarImage, uploadBackgroundImage } from "../userSlice";
import useResetAndNavigate from "../../../CustomHook/useResetAndNavigate";

export default function UserProfile() {

    const { createDate, numberOfSongs, numberOfPlaylist, availableMemory, fetchUploadUserAvatarStatus, fetchUploadUserBackgroundImgStatus } =
        useSelector((state: RootState) => state.users.profileState);

    const { userAvatarImage } = useSelector(
        (state: RootState) => state.users.navBarState
    );

    const { userBackgroundImage } = useSelector(
        (state: RootState) => state.users.homePageState
    );
    const dispatch = useDispatch<AppDispatch>();

    const resetAndNavigate = useResetAndNavigate()

    const { username } = useSelector(
        (state: RootState) => state.users.navBarState
    );

    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [changeImage, setChangeImage] = React.useState(false);
    const [avatarImageFile, setAvatarImageFile] =
        React.useState<FileList | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] =
        React.useState<FileList | null>(null);

    const changeImageContainerRef = React.useRef<HTMLDivElement | null>(null);
    const changeImageButtonRef = React.useRef<SVGSVGElement | null>(null);

    const changeAvatarRef = React.useRef<HTMLInputElement | null>(null);
    const changeBackgroundRef = React.useRef<HTMLInputElement | null>(null);

    const dateConvert = (input: string) => {
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

    const handleAvatarImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAvatarImageFile(e.target.files);
    };

    const handleBackgroundImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setBackgroundImageFile(e.target.files);
    };

    const uploadAvatarImageHandler = () => {
        if (!avatarImageFile) {
            failedNotification("No file selected");
            return;
        }

        const fd = new FormData();
        fd.append("file", avatarImageFile[0]);

        dispatch(uploadAvatarImage(fd))
            .unwrap()
            .then(() => {
                successNotification("Avatar changed successfully!!!");
                setAvatarImageFile(null);
                changeAvatarRef.current!.value = "";
            })
            .catch((err) => {
                if(err.code == 444){
                    resetAndNavigate();
                    failedNotification("Your account logged in different location");
                }
                else{
                    failedNotification("Something wrong when change your avatar...");
                }
            });
    };

    const uploadBackgroundImageHandler = () => {
        if (!backgroundImageFile) {
            failedNotification("No file selected!!!");
            return;
        }
    
        const fd = new FormData();
        fd.append("file", backgroundImageFile[0]);
    
        dispatch(uploadBackgroundImage(fd))
            .unwrap() // Sửa lỗi từ 'unwarp' thành 'unwrap'
            .then(() => {
                successNotification("Background image changed successfully!!!");
                setAvatarImageFile(null);
                changeBackgroundRef.current!.value = "";
            })
            .catch((err) => {
                if(err.code == 444){
                    resetAndNavigate();
                    failedNotification("Your account logged in different location");
                }
                else{
                    failedNotification("Something wrong when change your avatar...");
                }
            });
    };

    React.useEffect(() => {
        const handler = (e : MouseEvent) => {
            if (
                changeImageContainerRef.current &&
                !changeImageContainerRef.current.contains(e.target as Node) &&
                !changeImageButtonRef.current!.contains(e.target as Node)
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
                backgroundImage: `url(${userBackgroundImage})`,
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
                            <button disabled={fetchUploadUserAvatarStatus === "pending" ? true : false} onClick={uploadAvatarImageHandler}>
                                Change avatar
                            </button>
                            <input
                                type="file"
                                accept=".jpg, .png"
                                onChange={handleBackgroundImageChange}
                                ref={changeBackgroundRef}
                            />
                            <button disabled={fetchUploadUserBackgroundImgStatus === "pending" ? true : false} onClick={uploadBackgroundImageHandler}>
                                Change background
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    <div
                        className="ava-container"
                        style={{
                            backgroundImage: `url(${userAvatarImage})`,
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
                            <p>{dateConvert(createDate)}</p>
                        </li>
                        <li>
                            <h3>Number of songs: </h3>
                            <p>{numberOfSongs}</p>
                        </li>
                        <li>
                            <h3>Number of playlist: </h3>
                            <p>{numberOfPlaylist}</p>
                        </li>
                        <li>
                            <h3>Your available memory: </h3>
                            <p>
                                {Math.round(availableMemory! * 100) / 100}MB /
                                1024MB
                            </p>
                        </li>
                    </ul>
                    <div className="memory-bar">
                        <div
                            className="memory-progress"
                            style={{
                                width: `${
                                    100 - (availableMemory! / 1024) * 100
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
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                />
            </div>
        </div>
    );
}
