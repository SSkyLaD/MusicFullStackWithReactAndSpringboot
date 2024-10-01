import "./Favorite.scss";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlay,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import Empty from "../Component/Empty/Empty";
import MusicCard from "../Component/MusicCard/MusicCard";
import Loading from "../../../assets/Loading/Loading";
import userSlice, {
    fetchUserFavSongsByPage,
    fetchUserSearchFavSongsByPage,
} from "../userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { failedNotification } from "../Component/notification";
import useResetAndNavigate from "../../../CustomHook/useResetAndNavigate";

export default function Favorite() {
    const { favoritePageState } = useSelector(
        (state: RootState) => state.users
    );
    const dispatch = useDispatch<AppDispatch>();
    const resetAndNavigate = useResetAndNavigate();

    const [showFilter, setShowFilter] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number>();
    const filterOptionRef = useRef<HTMLDivElement | null>(null);

    const { songs, currentPage, endFetch } = favoritePageState;
    const { searchValue, searchBy, sortBy, sortDirection } =
        favoritePageState.filter;

    const handleFilterChange = () => {
        dispatch(userSlice.actions.resetCurrentPageFavPage());
        dispatch(userSlice.actions.resetSongsInFavPage());
        dispatch(userSlice.actions.setEndFetchInFavPage(false));
    };

    const songCards = favoritePageState.songs.map((ele) => {
        return <MusicCard songData={ele} key={ele.id} playlistId={null} />;
    });

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputFiltered = e.target.value.replace(/[|{}\\[\]^`"<>]/g, "");

        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
        }

        const newTimeoutId = setTimeout(() => {
            dispatch(userSlice.actions.setSearchValueInFavPage(inputFiltered));
            handleFilterChange();
        }, 500); // Delay 0.5s

        setTimeoutId(newTimeoutId);
    };

    const handlePlayAll = () => {
        if (!endFetch) {
            return;
        }
        dispatch(userSlice.actions.handlePlayAll(songs));
    };

    React.useEffect(() => {
        if (!endFetch) {
            if (!searchValue) {
                dispatch(
                    fetchUserFavSongsByPage({
                        currentPage,
                        sortBy,
                        sortDirection,
                    })
                )
                    .unwrap()
                    .catch((err) => {
                        if (err.code == 444) {
                            resetAndNavigate();
                            failedNotification(
                                "Your account logged in different location"
                            );
                        }
                    });
            }
            if (searchValue) {
                dispatch(
                    fetchUserSearchFavSongsByPage({
                        currentPage,
                        searchValue,
                        searchBy,
                        sortBy,
                        sortDirection,
                    })
                )
                    .unwrap()
                    .catch((err) => {
                        if (err.code == 444) {
                            resetAndNavigate();
                            failedNotification(
                                "Your account logged in different location"
                            );
                        }
                    });
            }
        }
    }, [currentPage, endFetch, searchValue, searchBy, sortBy, sortDirection]);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                filterOptionRef.current &&
                !filterOptionRef.current.contains(e.target as Node)
            ) {
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
                        <button onClick={() => handlePlayAll()}>
                            <FontAwesomeIcon icon={faPlay} />
                            <p>Play all</p>
                        </button>
                        <p>{songs.length}</p>
                        {!endFetch ? <Loading /> : ""}
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
                        <div className="filter-option" ref={filterOptionRef}>
                            <h3>Search by</h3>
                            <div className="button-container">
                                <div
                                    style={{
                                        backgroundColor:
                                            searchBy === "name"
                                                ? "orange"
                                                : "initial",
                                    }}
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSearchByInFavPage(
                                                "name"
                                            )
                                        ),
                                            handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSearchByInFavPage(
                                                "artist"
                                            )
                                        ),
                                            handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortByInFavPage(
                                                "name"
                                            )
                                        ),
                                            handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortByInFavPage(
                                                "artist"
                                            )
                                        ),
                                            handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortByInFavPage(
                                                "uploadDate"
                                            )
                                        ),
                                            handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortByInFavPage(
                                                "size"
                                            )
                                        );
                                        handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortByInFavPage(
                                                "duration"
                                            )
                                        );
                                        handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortDirectionByInFavPage(
                                                "asc"
                                            )
                                        );
                                        handleFilterChange();
                                    }}
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
                                    onClick={() => {
                                        dispatch(
                                            userSlice.actions.setSortDirectionByInFavPage(
                                                "desc"
                                            )
                                        );
                                        handleFilterChange();
                                    }}
                                >
                                    Descending
                                </div>
                            </div>
                        </div>
                    )}
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search here..."
                        onChange={handleSearchInputChange}
                    ></input>
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
            </div>
            {songs.length === 0 && endFetch ? (
                <div className="bottom-section">
                    <Empty />
                </div>
            ) : (
                <div className="music-list-container">{songCards}</div>
            )}
        </div>
    );
}
