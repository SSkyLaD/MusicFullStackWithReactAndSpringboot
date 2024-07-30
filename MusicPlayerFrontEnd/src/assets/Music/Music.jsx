import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Music.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlay,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { TokenContext } from "../../pages/MainUserPage/user";
import { successNotification, failedNotification } from "../notification";
import Empty from "../Empty/empty";
import MusicCard from "../MusicCard/MusicCard";
import Loading from "../Loading/Loading";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function Music() {
    const { tokenData, handlePlayAll } = React.useContext(TokenContext);
    const [songs, setSongs] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchBy, setSearchBy] = useState("name");
    const [sortBy, setSortBy] = useState("uploadDate");
    const [sortDirection, setSortDirection] = useState("asc");
    const [searchValue, setSearchValue] = useState("");
    const [timeoutId, setTimeoutId] = useState(null); // State to store the timeout ID
    const inputFileRef = useRef(null);
    const filterRef = useRef(null);

    const getSongsPaging = (page = 0) => {
        setIsLoading(true);
        axios
            .get(
                `${APIurl}/api/v1/users/songs?pageNo=${page}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then((res) => {
                if (page === 0) {
                    setSongs([]);
                }
                if (res.data.data.length > 0) {
                    setSongs((prevSongs) => [...prevSongs, ...res.data.data]);
                    getSongsPaging(page + 1);
                } else {
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                failedNotification(err.response.data.msg);
            });
    };

    const handleFileChange = (e) => {
        setUploadedFiles(e.target.files);
    };

    const handleFileUpload = () => {
        if (!uploadedFiles) {
            failedNotification("No file selected");
            return;
        }

        const fd = new FormData();
        for (let i = 0; i < uploadedFiles.length; i++) {
            fd.append("files", uploadedFiles[i]);
        }

        axios
            .post(`${APIurl}/api/v1/users/songs/upload/multi`, fd, {
                onUploadProgress: (progressEvent) => {
                    console.log(progressEvent.progress * 100);
                },
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                successNotification("File uploaded successfully");
                setUploadedFiles(null);
                inputFileRef.current.value = null;
                setSongs((prev) => [...prev, ...res.data.data]); // Clear the current songs before fetching again
            })
            .catch((err) => {
                failedNotification(err.response.data.msg);
                console.log(err);
                setUploadedFiles(null);
                inputFileRef.current.value = null;
            });
    };

    const searchSongsPaging = (inputFiltered, page = 0) => {
        setIsLoading(true);
        axios
            .get(
                `${APIurl}/api/v1/users/songs/search?pageNo=${page}&${searchBy}=${inputFiltered}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then((res) => {
                if (page === 0) {
                    setSongs([]);
                }
                if (res.data.data.length !== 0) {
                    setSongs((prevSongs) => [...prevSongs, ...res.data.data]);
                    searchSongsPaging(inputFiltered, page + 1);
                } else {
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                failedNotification(err.response.data.msg);
            });
    };

    const handleSearchChange = (e) => {
        const inputFiltered = e.target.value.replace(/[|{}\\[\]^`"<>]/g, "");
        setSearchValue(inputFiltered);

        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
        }

        const newTimeoutId = setTimeout(() => {
            if (!inputFiltered) {
                getSongsPaging();
                return;
            }

            searchSongsPaging(inputFiltered);
        }, 500); // Delay 0.5s

        setTimeoutId(newTimeoutId);
    };

    let songlistHTML;

    if (songs.length > 0) {
        songlistHTML = songs.map((songData) => {
            return (
                <MusicCard
                    songData={songData}
                    key={songData.id}
                    controlRender={() => getSongsPaging()}
                />
            );
        });
    }

    useEffect(() => {
        getSongsPaging();
    }, [sortBy, sortDirection]);

    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
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
                    <h2>Discover your music</h2>
                    <div className="play-all">
                        <button onClick={() => handlePlayAll(songs)}>
                            <FontAwesomeIcon icon={faPlay} />
                            <p>Play all</p>
                        </button>
                        <p>{songs.length}</p>
                        {isLoading ? <Loading /> : ""}
                    </div>
                </div>
                <div className="search">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search here..."
                        value={searchValue}
                        onChange={handleSearchChange} // Use handleSearchChange
                    ></input>
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <div
                        className="filter"
                        onClick={() => setShowFilter((prev) => !prev)}
                    >
                        <FontAwesomeIcon icon={faFilter} />
                    </div>
                    {!showFilter ? (
                        ""
                    ) : (
                        <div className="filter-option" ref={filterRef}>
                            <h3>Search by</h3>
                            <div className="button-container">
                                <div
                                    style={{
                                        backgroundColor:
                                            searchBy === "name"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSearchBy("name")}
                                >
                                    Name
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            searchBy === "artist"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSearchBy("artist")}
                                >
                                    Artist
                                </div>
                            </div>
                            <h3>Sort By</h3>
                            <div className="button-container">
                                <div
                                    style={{
                                        backgroundColor:
                                            sortBy === "name"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortBy("name")}
                                >
                                    Name
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            sortBy === "artist"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortBy("artist")}
                                >
                                    Artist
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            sortBy === "uploadDate"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortBy("uploadDate")}
                                >
                                    Upload date
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            sortBy === "size"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortBy("size")}
                                >
                                    File size
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            sortBy === "duration"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortBy("duration")}
                                >
                                    Duration
                                </div>
                            </div>
                            <h3>Sort Direction</h3>
                            <div className="button-container">
                                <div
                                    style={{
                                        backgroundColor:
                                            sortDirection === "asc"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortDirection("asc")}
                                >
                                    Ascending
                                </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            sortDirection === "desc"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => setSortDirection("desc")}
                                >
                                    Descending
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="upload">
                    <input
                        type="file"
                        accept=".mp3, .flac"
                        onChange={handleFileChange}
                        ref={inputFileRef}
                        multiple
                    />
                    <button onClick={handleFileUpload}>Upload</button>
                </div>
            </div>
            {songs.length === 0 && !isLoading ? (
                <div className="bottom-section">
                    <Empty />
                </div>
            ) : (
                <div className="music-list-container">{songlistHTML}</div>
            )}
        </div>
    );
}
