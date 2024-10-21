import React, { useEffect, useState, useRef } from "react";
import "./Music.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlay,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import {
    successNotification,
    failedNotification,
} from "../Component/notification";
import Empty from "../Component/Empty/Empty";
import MusicCard from "../Component/MusicCard/MusicCard";
import Loading from "../../../assets/Loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import userSlice, {
    fetchUserSearchSongsByPage,
    uploadUserSongs,
} from "../userSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import useResetAndNavigate from "../../../CustomHook/useResetAndNavigate";

export default function Music() {
    const musicPage = useSelector(
        (state: RootState) => state.users.musicPageState
    );
    const dispatch = useDispatch<AppDispatch>();
    const resetAndNavigate = useResetAndNavigate();

    const [showFilter, setShowFilter] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
    const [timeoutId, setTimeoutId] = useState<number>();
    const filterOptionRef = useRef<HTMLDivElement | null>(null);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const { searchValue, searchBy, sortBy, sortDirection } = musicPage.filter;
    const {
        currentPage,
        fetchCurrentPageStatus,
        totalPage,
        totalSongs,
    } = musicPage;

    const handleFilterChange = () => {
        dispatch(userSlice.actions.setCurrentPageInMusicPage(0));
        dispatch(userSlice.actions.resetSongsInMusicPage());
        dispatch(userSlice.actions.setFetchStatusInMusicPage());
    };

    const handlePageSelect = (page: number) => {
        if (currentPage === page) {
            return;
        }
        dispatch(userSlice.actions.setCurrentPageInMusicPage(page));
        dispatch(userSlice.actions.resetSongsInMusicPage());
        dispatch(userSlice.actions.setFetchStatusInMusicPage());
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
                userSlice.actions.setSearchValueInMusicPage(inputFiltered)
            );
            handleFilterChange();
        }, 500); // Delay 0.5s

        setTimeoutId(newTimeoutId);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        dispatch(uploadUserSongs(fd))
            .unwrap()
            .then((res) => {
                successNotification("File uploaded successfully");
                setUploadedFiles(null);
                inputFileRef.current!.value = "";
                dispatch(userSlice.actions.addSongsInMusicPage(res.data));
            })
            .catch((err) => {
                if (err.code == 444) {
                    resetAndNavigate();
                    failedNotification(
                        "Your account logged in different location"
                    );
                }
            });
    };

    useEffect(() => {
        if (
            fetchCurrentPageStatus == "idle" ||
            fetchCurrentPageStatus == "failed"
        ) {
            dispatch(
                fetchUserSearchSongsByPage({
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
        <div className="music">
            <div className="top-bar">
                <div className="top-left">
                    <h2>Discover your music</h2>
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
                                            userSlice.actions.setSearchByInMusicPage(
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
                                            userSlice.actions.setSearchByInMusicPage(
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
                                            userSlice.actions.setSortByInMusicPage(
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
                                            userSlice.actions.setSortByInMusicPage(
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
                                            userSlice.actions.setSortByInMusicPage(
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
                                            userSlice.actions.setSortByInMusicPage(
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
                                            userSlice.actions.setSortByInMusicPage(
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
                                            userSlice.actions.setSortDirectionByInMusicPage(
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
                                            userSlice.actions.setSortDirectionByInMusicPage(
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
                <div className="upload">
                    <input
                        type="file"
                        multiple
                        accept=".mp3, .flac"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                    />
                    <button onClick={handleFileUpload}>Upload</button>
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
