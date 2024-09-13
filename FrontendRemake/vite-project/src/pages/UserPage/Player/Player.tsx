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
import { notification } from "../Component/notification.tsx";
import { useDispatch, useSelector } from "react-redux";
import userSlice from "../userSlice.ts";
import { RootState, AppDispatch } from "../../../redux/store";
const api = import.meta.env.VITE_APIServerUrl;

export default function Player() {
    const [playerData, setPlayerData] = React.useState({
        nowtimeInSec: 0,
        fulltimeInSec: 0,
        isPlayed: false,
        isMuted: false,
        volume: 0.5,
        mode: "none",
    });
    const { currentSong, songsInTrackList } = useSelector(
        (state: RootState) => state.users.playerState
    );
    const dispatch = useDispatch<AppDispatch>();

    const audioRef = React.useRef(null);

    const play = () => {
        if (currentSong.id !== -1) {
            navigator.mediaSession.playbackState = "playing";
            notification(
                `▶ Now playing : ${currentSong.name} - ${currentSong.artist}`
            );
            const song = document.querySelector(".song") as HTMLAudioElement;
            setPlayerData((prev) => {
                return { ...prev, isPlayed: true };
            });
            song.play();
        }
    };

    const pause = () => {
        navigator.mediaSession.playbackState = "paused";
        notification(
            `⏸ Now stopping : ${currentSong.name} - ${currentSong.artist}`
        );
        const song = document.querySelector(".song") as HTMLAudioElement;
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
        if (songsInTrackList.length !== 0) {
            notification("🔀 Suffered");
            const array = [...songsInTrackList];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            dispatch(userSlice.actions.handlePlayAll(array));
        }
    };

    const handleSkipSong = () => {
        dispatch(userSlice.actions.handleSkipSong());
    };

    const handleBackSong = () => {
        dispatch(userSlice.actions.handleBackSong());
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

    function timeConvert(time: number) {
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60);
        const formatedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        const formatedSecond = second < 10 ? `0${second}` : `${second}`;
        return `${formatedMinute}:${formatedSecond}`;
    }
    //Load bài hát ở player
    function handleLoadedMetadata(
        event: React.SyntheticEvent<HTMLAudioElement>
    ) {
        const audioElement = event.currentTarget as HTMLAudioElement;
        audioElement.volume = playerData.volume;
        const songDurationInSec = audioElement.duration;
        setPlayerData((prev) => {
            return { ...prev, fulltimeInSec: songDurationInSec };
        });
        play();
    }

    function handleTimeUpdate(event: React.SyntheticEvent<HTMLAudioElement>) {
        const audioElement = event.currentTarget as HTMLAudioElement;
        const nowInSec = audioElement.currentTime;
        setPlayerData((prev) => {
            return { ...prev, nowtimeInSec: nowInSec };
        });
    }

    function handleTimeChangeSlider(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const newTime = parseFloat(event.target.value);
        const song = document.querySelector(".song") as HTMLAudioElement;
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
            if (songsInTrackList.length == 0) {
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
    function changeVolume(event: React.ChangeEvent<HTMLInputElement>) {
        const volume = parseFloat(event.target.value);
        const song = document.querySelector(".song") as HTMLAudioElement;
        song.volume = volume;
        setPlayerData((prev) => {
            return { ...prev, volume: volume };
        });
    }

    // khi playSong thay đổi thì bài hát tự động được nạp vào player và chạy
    React.useEffect(() => {
        if (currentSong.id != -1) {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const song = document.querySelector(".song") as HTMLAudioElement;
            song.src = `${api}/api/v1/users/songs/stream/${tokenData.token}/${currentSong.id}`;
            setPlayerData((prev) => {
                return { ...prev, isPlayed: true };
            });
        }
    }, [currentSong]);

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
                title: currentSong.name,
                artist: currentSong.artist,
                artwork: [
                    {
                        src: currentSong.albumImageBase64,
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
                        <img src={currentSong.albumImageBase64} alt="" />
                        <div className="text-data">
                            <h2>{currentSong.name}</h2>
                            <p>{currentSong.artist}</p>
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
                        style={{
                            pointerEvents: currentSong?.id ? "auto" : "none",
                        }}
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
