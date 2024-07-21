import React from "react";
import axios from "axios";
import "./List.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TokenContext } from "../../pages/UserPage/user";
import Empty from "../Empty/empty";
import MusicCard from "../MusicCard/MusicCard";
import { successNotification, failedNotification } from "../notification";
import Home from "../Home/Home";
import Loading from "../Loading/Loading";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function List({ listName, listId }) {
    const { tokenData, handlePlayAll, setMainComponent, getUserLists } =
        React.useContext(TokenContext);
    const [songs, setSongs] = React.useState([]);
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [nameOfList, setNameOfList] = React.useState(listName);
    const [isLoading, setIsLoading] = React.useState(false);
    const renameTextBox = React.useRef();

    const getSongInList = () => {
        setIsLoading(true);
        axios
            .get(`${APIurl}/api/v1/users/lists/${listId}`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                setSongs(res.data.data);
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false);
                failedNotification(err.response.data.msg);
                console.log(err);
            });
    };

    const handleDeleteList = () => {
        axios
            .delete(`${APIurl}/api/v1/users/lists/${listId}`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                successNotification(res.data.msg);
                setMainComponent(<Home />);
                getUserLists(tokenData.token);
            })
            .catch((err) => {
                failedNotification(err.response.data.msg);
            });
    };

    const handleOnChange = (e) => {
        setNameOfList(e.target.value);
    };

    const handleRenameList = () => {
        axios
            .patch(
                `${APIurl}/api/v1/users/lists/${listId}`,
                {
                    name: nameOfList,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then((res) => {
                successNotification(res.data.msg);
                getUserLists(tokenData.token);
                setIsEditingName(false);
                setMainComponent(
                    <List listId={listId} listName={nameOfList} key={listId} />
                );
            })
            .catch((err) => {
                failedNotification(err.response.data.msg);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleRenameList();
        }
    };

    let songlistHTML;

    if (songs) {
        songlistHTML = songs.map((songData) => (
            <MusicCard
                songData={songData}
                key={songData.id}
                controlRender={getSongInList}
                playlistId={listId}
            />
        ));
    }

    React.useEffect(() => {
        getSongInList();
    }, []);

    React.useEffect(() => {
        const handler = (e) => {
            if (
                renameTextBox.current &&
                !renameTextBox.current.contains(e.target)
            ) {
                setIsEditingName(false);
                setNameOfList(listName);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="music">
            <div className="top-bar">
                <div className="top-left">
                    <div className="top-left-top">
                        {isEditingName ? (
                            <input
                                type="text"
                                className="rename-textbox"
                                value={nameOfList}
                                onChange={handleOnChange}
                                onKeyDown={handleKeyDown}
                                onBlur={handleRenameList}
                                ref={renameTextBox}
                            />
                        ) : (
                            <h2>{listName}</h2>
                        )}
                        <button onClick={() => setIsEditingName(true)}>
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button onClick={handleDeleteList}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                    <div className="play-all">
                        <button onClick={() => handlePlayAll(songs)}>
                            <FontAwesomeIcon icon={faPlay} />
                            <p>Play all</p>
                        </button>
                        <p>{songs.length}</p>
                        {isLoading ? <Loading/> : ""}
                    </div>
                </div>
            </div>
            {songs && songs.length === 0 ? (
                <div className="bottom-section">
                    <Empty />
                </div>
            ) : (
                <div className="music-list-container">{songlistHTML}</div>
            )}
        </div>
    );
}
