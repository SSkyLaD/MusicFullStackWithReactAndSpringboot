import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import React, { useEffect, useState, useRef } from "react";
import "./List.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Empty from "../Component/Empty/Empty";
import MusicCard from "../Component/MusicCard/MusicCard";
import Loading from "../../../assets/Loading/Loading";
import userSlice, {
    fetchDeletePlaylist,
    fetchRenameUserPlaylist,
    fetchUserPlaylistSongs,
} from "../userSlice";
import {
    failedNotification,
    successNotification,
} from "../Component/notification";

export default function PlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const playlist = useSelector(
        (state: RootState) => state.users.playListState
    );

    const navBarState = useSelector(
        (state: RootState) => state.users.navBarState
    );
    const navigate = useNavigate();

    const selectedPlaylist = playlist.find((ele) => ele.id === parseInt(id!));
    const playlistData = navBarState.playlist.find(
        (ele) => ele.id === parseInt(id!)
    );

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameOfList, setNameOfList] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingRename, setPendingRename] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);
    const renameTextBox = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!selectedPlaylist) {
            setIsLoading(true);
            dispatch(fetchUserPlaylistSongs(parseInt(id!)))
                .unwrap()
                .then(() => setIsLoading(false))
                .catch(() => {
                    
                });
        }
    });

    useEffect(() => {
        if (playlistData?.name) {
            setNameOfList(playlistData?.name);
        }
    }, [playlistData?.name]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameOfList(e.target.value);
    };

    const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const playlistId = parseInt(id!);
            const newPlaylistName = nameOfList;
            setPendingRename(true);
            dispatch(fetchRenameUserPlaylist({ playlistId, newPlaylistName }))
                .unwrap()
                .then((res) => {
                    setPendingRename(false)
                    setIsEditingName(false);
                    successNotification(res.msg);
                })
                .catch((err) => {
                    setPendingRename(false)
                    setIsEditingName(false);
                    failedNotification(err.msg);
                });
        }
    };

    const handleDeletePlaylist = () =>{
        const playlistId = parseInt(id!);
        setPendingDelete(true);
        dispatch(fetchDeletePlaylist(playlistId))
        .unwrap()
        .then((res)=>{
            setPendingDelete(false);
            successNotification(res.msg);
            navigate("/user/home");
        })
        .catch((err)=>{
            setPendingDelete(false);
            failedNotification(err.msg);
        })
    }

    const handlePlayAll = () => {
        dispatch(userSlice.actions.handlePlayAll(selectedPlaylist?.songs));
    };

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                renameTextBox.current &&
                !renameTextBox.current.contains(e.target as Node)
            ) {
                setIsEditingName(false);
                setNameOfList(playlistData!.name);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="playlist-display">
            <div className="top-bar">
                <div className="top-left">
                    <div className="top-left-top">
                        {isEditingName ? (
                            <input
                                type="text"
                                className="rename-textbox"
                                value={nameOfList}
                                onChange={handleOnChange}
                                onKeyDown={handleRename}
                                ref={renameTextBox}
                            />
                        ) : navBarState.fetchPlaylistStatus === "success" ? (
                            <h2>{playlistData?.name}</h2>
                        ) : (
                            <Loading />
                        )}
                        <button
                            disabled={isLoading && pendingRename}
                            onClick={() => setIsEditingName(true)}
                        >
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button disabled={pendingDelete} onClick={() => handleDeletePlaylist()}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <div className="play-all">
                        <button onClick={() => handlePlayAll()}>
                            <FontAwesomeIcon icon={faPlay} />
                            <p>Play all</p>
                        </button>
                        <p>
                            {selectedPlaylist?.songs
                                ? selectedPlaylist!.songs.length
                                : 0}
                        </p>
                        {isLoading && <Loading />}
                    </div>
                </div>
            </div>
            {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
                <div className="music-list-container">
                    {selectedPlaylist.songs.map((ele) => (
                        <MusicCard
                            songData={ele}
                            key={ele.id}
                            playlistId={parseInt(id!)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bottom-section">
                    {isLoading ? <Loading /> : <Empty />}
                </div>
            )}
        </div>
    );
}
