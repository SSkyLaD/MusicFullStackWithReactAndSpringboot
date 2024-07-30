import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faUser,
    faMusic,
    faHeart,
    faRightFromBracket,
    faPlus,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import Home from "../Home/Home";
import Music from "../Music/Music";
import Favorite from "../Favorite/Favorite";
import List from "../List/List";
import UserProfile from "../UserProfile/UserProfile";
import CreateListConfirm from "./CreateListConfirm/CreateListConfirm";
import "./NavBar.scss";
import { TokenContext } from "../../pages/MainUserPage/user";

NavBar.propTypes = {
    handleLogout: PropTypes.func.isRequired,
    mainComponent: PropTypes.object.isRequired,
    setMainComponent: PropTypes.func.isRequired,
};

export default function NavBar({
    handleLogout,
    setMainComponent,
    mainComponent,
}) {
    const { tokenData, userLists, getUserLists, avatar, getUserAvatar} =
        React.useContext(TokenContext);
    const [createList, setCreateList] = React.useState(false);

    const navProfile = () => {
        setMainComponent(<UserProfile key="userProfile" />);
    };

    const navHome = () => {
        setMainComponent(<Home key="home" />);
    };

    const navMusic = () => {
        setMainComponent(<Music key="music" />);
    };

    const navFavorite = () => {
        setMainComponent(<Favorite key="favorite" />);
    };

    const navList = (listName, listId) => {
        setMainComponent(
            <List listId={listId} listName={listName} key={listId} />
        );
    };

    const handleCreatePlaylist = () => {
        setCreateList(true);
    };

    const songListButtonHTML = userLists.map((songList) => {
        return (
            <div
                className={
                    mainComponent.key == songList.id
                        ? "button-selected"
                        : "button"
                }
                key={songList.id}
                onClick={() => navList(songList.name, songList.id)}
            >
                <FontAwesomeIcon icon={faBookmark} />
                <p>{songList.name}</p>
            </div>
        );
    });

    React.useEffect(() => {
        if (tokenData.token) {
            getUserLists();
            getUserAvatar();
        }
    }, [tokenData.token]);

    return (
        <div className="nav-bar">
            <div className="main-nav">
                <div
                    className={
                        mainComponent.key == "userProfile"
                            ? "button-avatar-selected"
                            : "button-avatar"
                    }
                    onClick={navProfile}
                >
                    <div
                        className="avatar-container"
                        style={{
                            backgroundImage: `url(${avatar})`,
                            backgroundSize: "cover",
                        }}
                    >
                        {avatar ? "" : <FontAwesomeIcon icon={faUser} size="xl" width={25} />}
                    </div>
                    <p>{tokenData.username}</p>
                </div>
                <div
                    className={
                        mainComponent.key == "home"
                            ? "button-selected"
                            : "button"
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
                        mainComponent.key == "music"
                            ? "button-selected"
                            : "button"
                    }
                    onClick={navMusic}
                >
                    <FontAwesomeIcon icon={faMusic} size="xl" />
                    <p>Music</p>
                </div>
                <div
                    className={
                        mainComponent.key == "favorite"
                            ? "button-selected"
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
                {songListButtonHTML}
            </div>
            <div className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    size="xl"
                    width={25}
                />
                <p>Logout</p>
            </div>
            <CreateListConfirm
                createList={createList}
                setCreateList={setCreateList}
                getUserLists={getUserLists}
            />
        </div>
    );
}
