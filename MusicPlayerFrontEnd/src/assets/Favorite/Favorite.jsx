import "./Favorite.scss";
import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlay,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { TokenContext } from "../../pages/MainUserPage/user";
import Empty from "../Empty/empty";
import MusicCard from "../MusicCard/MusicCard";
import { failedNotification } from "../notification";
import Loading from "../Loading/Loading";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function Favorite() {
    const { tokenData, handlePlayAll } = React.useContext(TokenContext);
    const [songs, setSongs] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [showFilter, setShowFilter] = React.useState(false);
    const [searchBy, setSearchBy] = React.useState("name");
    const [sortBy, setSortBy] = React.useState("uploadDate");
    const [sortDirection, setSortDirection] = React.useState("asc");
    const [timeoutId, setTimeoutId] = React.useState(null); // State to store the timeout ID
    const [isLoading, setIsLoading] = React.useState(false);
    const filterRef = React.useRef(null);

    const getFavoriteSongs = (page = 0) => {
        setIsLoading(true);
        axios
            .get(
                `${APIurl}/api/v1/users/songs/favorites?pageNo=${page}&sortField=${sortBy}&direction=${sortDirection}`,
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
                    getFavoriteSongs(page + 1);
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

    const searchSongsPaging = (input, page = 0) => {
        axios
            .get(
                `${APIurl}/api/v1/users/songs/favorites/search?pageNo=${page}&${searchBy}=${input}&sortField=${sortBy}&direction=${sortDirection}`,
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
                    searchSongsPaging(input, page + 1);
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

    const searchFilter = (e) => {
        const inputFiltered = e.target.value.replace(/[|{}\\[\]^`"<>]/g, "");
        setSearchValue(inputFiltered);

        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
        }

        const newTimeoutId = setTimeout(() => {
            if (!inputFiltered) {
                searchSongsPaging(inputFiltered);
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
                    controlRender={() => getFavoriteSongs()}
                />
            );
        });
    }

    React.useEffect(() => {
        getFavoriteSongs();
    }, [sortBy, sortDirection]);

    React.useEffect(() => {
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
        <div className="favorite">
            <div className="top-bar">
                <div className="top-left">
                    <h2>Your most favorite music</h2>
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
                            <h3>Direction</h3>
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
                                    A-Z
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
                                    Z-A
                                </div>
                            </div>
                        </div>
                    )}
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search here..."
                        value={searchValue}
                        onChange={searchFilter}
                    ></input>
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
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
