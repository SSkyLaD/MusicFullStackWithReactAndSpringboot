import "./Favorite.scss";
import React, { useState, useRef, useEffect } from "react";
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
    fetchUserSearchFavSongsByPage
} from "../userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { failedNotification} from "../Component/notification";
import useResetAndNavigate from "../../../CustomHook/useResetAndNavigate";

export default function Favorite() {
    const musicPage = useSelector(
        (state: RootState) => state.users.favoritePageState
    );
    const dispatch = useDispatch<AppDispatch>();
    const resetAndNavigate = useResetAndNavigate();

    const [showFilter, setShowFilter] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number>();
    const filterOptionRef = useRef<HTMLDivElement | null>(null);

    const { searchValue, searchBy, sortBy, sortDirection } = musicPage.filter;
    const {
        currentPage,
        fetchCurrentPageStatus,
        totalPage,
        totalSongs,
    } = musicPage;
    const handleFilterChange = () => {
        dispatch(userSlice.actions.setCurrentPageFavPage(0));
        dispatch(userSlice.actions.resetSongsInFavPage());
        dispatch(userSlice.actions.setFetchStatusFavPage());
    };

    const handlePageSelect = (page: number) => {
        if (currentPage === page) {
            return;
        }
        dispatch(userSlice.actions.setCurrentPageFavPage(page));
        dispatch(userSlice.actions.resetSongsInFavPage());
        dispatch(userSlice.actions.setFetchStatusFavPage());
    };

    const songCards = musicPage.songs.map((ele) => {
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
            dispatch(
                userSlice.actions.setSearchValueInFavPage(inputFiltered)
            );
            handleFilterChange();
        }, 500); // Delay 0.5s

        setTimeoutId(newTimeoutId);
    };


    useEffect(() => {
        if (
            fetchCurrentPageStatus == "idle" ||
            fetchCurrentPageStatus == "failed"
        ) {
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
    }, [currentPage, searchValue, searchBy, sortBy, sortDirection, fetchCurrentPageStatus]);

    useEffect(() => {
        const handleEvent = (e: MouseEvent) => {
            if (
                filterOptionRef.current &&
                !filterOptionRef.current.contains(e.target as Node)
            ) {
                setShowFilter(false);
            }
        };
        document.addEventListener("mousedown", handleEvent);
        return () => {
            document.removeEventListener("mousedown", handleEvent);
        };
    }, []);

    return (
        <div className="favorite">
            <div className="top-bar">
                <div className="top-left">
                    <h2>Explore your favorite songs</h2>
                    <div className="play-all">
                        <button
                            disabled={
                                fetchCurrentPageStatus !== "success"
                                    ? true
                                    : false
                            }
                            // onClick={handlePlayAll}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            {/* <p>Play All This Page </p> */}
                        </button>

                        {fetchCurrentPageStatus == "success" ? (
                            <p>Total Songs : {totalSongs}</p>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>
                <div className="search">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search here..."
                        onChange={handleSearchInputChange}
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
                </div>
            </div>
            {fetchCurrentPageStatus === "pending" && (
                <div className="bottom-section">
                    <Loading />
                </div>
            )}

            {totalSongs === 0 && fetchCurrentPageStatus === "success" ? (
                <div className="bottom-section">
                    <Empty />
                </div>
            ) : (
                ""
            )}
            {fetchCurrentPageStatus === "success" && (
                <div className="music-list-container">
                    <div className="music-card-container">{songCards}</div>
                    {totalPage! > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPage! }, (_, i) => (
                                <button
                                    className={
                                        currentPage === i
                                            ? "selected-page-button"
                                            : "page-button"
                                    }
                                    key={i}
                                    onClick={() => handlePageSelect(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
