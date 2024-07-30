import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faRepeat,
    faBackward,
    faForward,
    faShuffle,
    faVolumeHigh,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Player.scss";
import { TokenContext } from "../../pages/MainUserPage/user";
import { notification } from "../notification";
const api = import.meta.env.VITE_APIServerUrl;

export default function Player() {
    const { tokenData, playSong, tracklist, tracklistIndex, setPlaySong } =
        React.useContext(TokenContext);
    const [playerData, setPlayerData] = React.useState({
        nowtimeInSec: 0,
        fulltimeInSec: 0,
        isPlayed: false,
        isMuted: false,
        volume: 0.5,
        mode: "none",
    });

    const audioRef = React.useRef(null);

    const play = () => {
        navigator.mediaSession.playbackState = "playing";
        notification(`▶ Now playing : ${playSong.name} - ${playSong.artist}`);
        const song = document.querySelector(".song");
        setPlayerData((prev) => {
            return { ...prev, isPlayed: true };
        });
        song.play();
    };

    const pause = () => {
        navigator.mediaSession.playbackState = "paused";
        notification(`⏸ Now stopping : ${playSong.name} - ${playSong.artist}`);
        const song = document.querySelector(".song");
        setPlayerData((prev) => {
            return { ...prev, isPlayed: false };
        });
        song.pause();
    };

    const muteToggle = () => {
        if (playerData.isMuted) {
            notification(`🔊 Unmuted`);
        } else notification(`🔇 Muted`);
        setPlayerData((prev) => {
            return { ...prev, isMuted: !prev.isMuted };
        });
    };

    const handleSuffer = () => {
        if (tracklist.current.length !== 0) {
            notification("🔀 Suffered");
            const array = [...tracklist.current];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            tracklist.current = [...array];
            tracklistIndex.current = 0;
            setPlaySong(tracklist.current[tracklistIndex.current]);
        }
    };

    const handleSkipSong = () => {
        if (tracklist.current.length !== 0) {
            if (tracklist.current.length - 1 === tracklistIndex.current) {
                tracklistIndex.current = 0;
                setPlaySong(tracklist.current[tracklistIndex.current]);
            } else {
                tracklistIndex.current++;
                setPlaySong(tracklist.current[tracklistIndex.current]);
            }
        }
    };

    const handleBackSong = () => {
        if (tracklist.current.length !== 0) {
            if (tracklistIndex.current === 0) {
                tracklistIndex.current = tracklist.current.length - 1;
                setPlaySong(tracklist.current[tracklistIndex.current]);
            } else {
                tracklistIndex.current--;
                setPlaySong(tracklist.current[tracklistIndex.current]);
            }
        }
    };

    function modeToggle() {
        if (playerData.mode === "none") {
            notification("🔂 Reapeat : One");
            setPlayerData((prev) => {
                return { ...prev, mode: "loop" };
            });
        }
        if (playerData.mode === "loop") {
            notification("🔁 Reapeat : All");
            setPlayerData((prev) => {
                return { ...prev, mode: "autonext" };
            });
        }
        if (playerData.mode === "autonext") {
            notification("⏹ Reapeat : Off");
            setPlayerData((prev) => {
                return { ...prev, mode: "none" };
            });
        }
    }

    function timeConvert(time) {
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60);
        const formatedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        const formatedSecond = second < 10 ? `0${second}` : `${second}`;
        return `${formatedMinute}:${formatedSecond}`;
    }
    //Load bài hát ở player
    function handleLoadedMetadata(event) {
        event.target.volume = playerData.volume;
        const songDurationInSec = event.target.duration;
        setPlayerData((prev) => {
            return { ...prev, fulltimeInSec: songDurationInSec };
        });
        play();
    }

    function handleTimeUpdate(event) {
        const nowInSec = event.target.currentTime;
        setPlayerData((prev) => {
            return { ...prev, nowtimeInSec: nowInSec };
        });
    }

    function handleTimeChangeSlider(event) {
        const newTime = parseFloat(event.target.value);
        const song = document.querySelector(".song");
        song.currentTime = newTime;
        setPlayerData((prev) => {
            return { ...prev, nowtimeInSec: newTime };
        });
    }

    // Xử lý khi kết thúc bài hát với từng playmode
    function handleTimeEnded() {
        if (playerData.mode === "none") {
            setPlayerData((prev) => {
                return { ...prev, isPlayed: false };
            });
        }
        if (playerData.mode === "autonext") {
            if (tracklist.current.length == 0) {
                setPlayerData((prev) => {
                    return { ...prev, isPlayed: false };
                });
            }
            handleSkipSong();
        }
    }

    function playMusic() {
        if (!playerData.isPlayed) {
            play();
        } else {
            pause();
        }
    }
    function changeVolume(event) {
        const volume = event.target.value;
        const song = document.querySelector(".song");
        song.volume = volume;
        setPlayerData((prev) => {
            return { ...prev, volume: volume };
        });
    }

    // khi playSong thay đổi thì bài hát tự động được nạp vào player và chạy
    React.useEffect(() => {
        if (playSong.id != "") {
            document.querySelector(
                ".song"
            ).src = `${api}/api/v1/users/songs/stream/${tokenData.token}/${playSong.id}`;
            setPlayerData((prev) => {
                return { ...prev, isPlayed: true };
            });
        }
    }, [playSong]);

    React.useEffect(() => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => {
                play();
            });

            navigator.mediaSession.setActionHandler("pause", () => {
                pause();
            });

            navigator.mediaSession.setActionHandler("previoustrack", () => {
                handleBackSong();
            });

            navigator.mediaSession.setActionHandler("nexttrack", () => {
                handleSkipSong();
            });
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: playSong.name,
                artist: playSong.artist,
                artwork: [
                    {
                        src: playSong.albumImageBase64,
                        sizes: "96x96",
                        type: "image/jpeg",
                    },
                ],
            });
        }
    }, []);

    return (
        <div className="player">
            <audio
                className="song"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTimeEnded}
                ref={audioRef}
                loop={playerData.mode === "loop" ? true : false}
                muted={playerData.isMuted}
            />
            <div className="progress-bar">
                <p>{timeConvert(playerData.nowtimeInSec)}</p>
                <input
                    type="range"
                    id="progress"
                    min="0"
                    step="1"
                    max={playerData.fulltimeInSec}
                    value={playerData.nowtimeInSec}
                    onChange={handleTimeChangeSlider}
                />
                <p>{timeConvert(playerData.fulltimeInSec)}</p>
            </div>
            <div className="bottom-section">
                <div className="music-data">
                    <div className="container">
                        <img src={playSong.albumImageBase64} alt="" />
                        <div className="text-data">
                            <h2>{playSong.name}</h2>
                            <p>{playSong.artist}</p>
                        </div>
                    </div>
                </div>
                <div className="control-button">
                    <div
                        className="loop"
                        onClick={modeToggle}
                        style={{
                            boxShadow:
                                playerData.mode === "loop"
                                    ? "0px 0px 5px yellow, 0px 0px 25px yellow,0px 0px 50px yellow"
                                    : playerData.mode === "autonext"
                                    ? "0px 0px 5px orangered, 0px 0px 25px orangered,0px 0px 50px orangered"
                                    : "",
                        }}
                    >
                        <FontAwesomeIcon icon={faRepeat} />
                    </div>
                    <div className="backward" onClick={handleBackSong}>
                        <FontAwesomeIcon icon={faBackward} />
                    </div>
                    <div
                        className="play"
                        onClick={playMusic}
                        style={{ pointerEvents: playSong.id ? "" : "none" }}
                    >
                        <FontAwesomeIcon
                            icon={playerData.isPlayed ? faPause : faPlay}
                            size="xl"
                        />
                    </div>
                    <div className="forward" onClick={handleSkipSong}>
                        <FontAwesomeIcon icon={faForward} />
                    </div>
                    <div className="suffer" onClick={handleSuffer}>
                        <FontAwesomeIcon icon={faShuffle} />
                    </div>
                </div>
                <div className="volume-control">
                    {playerData.isMuted ? (
                        <FontAwesomeIcon
                            icon={faVolumeXmark}
                            className="icon"
                            onClick={muteToggle}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faVolumeHigh}
                            className="icon"
                            onClick={muteToggle}
                        />
                    )}
                    <input
                        type="range"
                        className="volume-slider"
                        min="0"
                        max="1"
                        step="0.05"
                        onChange={changeVolume}
                        value={playerData.volume}
                    />
                </div>
            </div>
        </div>
    );
}
