import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faMusic,
    faHeart,
    faRightFromBracket,
    faPlus,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import "./NavBar.scss";
import { useDispatch, useSelector } from "react-redux";
import userSlice, { fetchUserPlaylist, fetchUserProfile } from "../userSlice";
import Loading from "../../../assets/Loading/Loading";
import { RootState, AppDispatch } from "../../../redux/store";
import CreateListConfirm from "./CreateListConfirm/CreateListConfirm";

export default function NavBar() {
    const [createList, setCreateList] = useState(false);
    const [selected, setSelected] = useState("home");
    const { username, playlist, userAvatarImage, fetchPlaylistStatus } =
        useSelector((state: RootState) => state.users.navBarState);

    const { fetchProfileStatus } = useSelector(
        (state: RootState) => state.users.profileState
    );
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const navProfile = () => {
        setSelected("profile");
        navigate("/user/profile");
    };

    const navHome = () => {
        setSelected("home");
        navigate("/user/home");
    };

    const navMusic = () => {
        setSelected("music");
        navigate("/user/music");
    };

    const navFavorite = () => {
        setSelected("favorite-music");
        navigate("/user/favorite-music");
    };

    const handleCreatePlaylist = () => {
        setCreateList(true);
    };

    const handleLogout = () => {
        dispatch(userSlice.actions.resetState());
        navigate("/login");
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) {
            navigate("/login");
            return;
        }
        if (fetchProfileStatus === "idle" || fetchProfileStatus === "failed") {
            dispatch(fetchUserProfile());
        }
        if (
            fetchPlaylistStatus === "idle" ||
            fetchPlaylistStatus === "failed"
        ) {
            dispatch(fetchUserPlaylist());
        }
    }, [fetchProfileStatus, fetchPlaylistStatus]);

    return (
        <div className="nav-bar">
            <div className="main-nav">
                <div
                    className={
                        selected === "profile"
                            ? "button-avatar-selected"
                            : "button-avatar"
                    }
                    onClick={navProfile}
                >
                    <div
                        className="avatar-container"
                        style={{
                            backgroundImage: `url(${userAvatarImage})`,
                            backgroundSize: "cover",
                        }}
                    >
                        {fetchProfileStatus == "pending" ? <Loading /> : ""}
                    </div>
                    <p>{username}</p>
                </div>
                <div
                    className={
                        selected === "home" ? "selected-button" : "button"
                    }
                    onClick={navHome}
                >
                    <FontAwesomeIcon icon={faHouse} size="xl" />
                    <p>Home</p>
                </div>
            </div>
            <div className="your-library-nav">
                <p>YOUR LIBRARY</p>
                <div
                    className={
                        selected === "music" ? "selected-button" : "button"
                    }
                    onClick={navMusic}
                >
                    <FontAwesomeIcon icon={faMusic} size="xl" />
                    <p>Music</p>
                </div>
                <div
                    className={
                        selected === "favorite-music"
                            ? "selected-button"
                            : "button"
                    }
                    onClick={navFavorite}
                >
                    <FontAwesomeIcon icon={faHeart} size="xl" />
                    <p>Favorite</p>
                </div>
            </div>
            <div className="playlist">
                <p>YOUR PLAYLIST</p>
                <div className="add-button" onClick={handleCreatePlaylist}>
                    <FontAwesomeIcon icon={faPlus} />
                    <p>Add Playlist</p>
                </div>
                {fetchPlaylistStatus === "pending" ? (
                    <div className="loading">
                        <Loading />
                    </div>
                ) : (
                    playlist.map((songList) => {
                        return (
                            <div
                                className={
                                    selected === `${songList.id}`
                                        ? "selected-button"
                                        : "button"
                                }
                                key={songList.id}
                                onClick={() => {
                                    setSelected(`${songList.id}`);
                                    navigate(`/user/playlist/${songList.id}`);
                                }}
                            >
                                <FontAwesomeIcon icon={faBookmark} />
                                <p>{songList.name}</p>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    size="xl"
                    width={25}
                />
                <p onClick={handleLogout}>Logout</p>
            </div>
            <CreateListConfirm
                createList={createList}
                setCreateList={setCreateList}
            />
        </div>
    );
}
