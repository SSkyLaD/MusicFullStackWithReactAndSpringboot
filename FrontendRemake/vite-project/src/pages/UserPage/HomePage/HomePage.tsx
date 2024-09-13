import "./Home.scss";
import Clock from "./Clock/Clock";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userSlice from "../userSlice";

import { RootState, AppDispatch } from "../../../redux/store";

export default function Home() {
    const { userBackgroundImage} =
        useSelector((state: RootState) => state.users.homePageState);

    const {fetchProfileStatus} = useSelector((state : RootState) => state.users.profileState)

    const { songsInTrackList, trackListIndex } = useSelector(
        (state: RootState) => state.users.playerState
    );
    const dispatch = useDispatch<AppDispatch>();

    const mouseOnQueueContainer = React.useRef(false);

    const changeSongInTracklist = (index: number) => {
        dispatch(userSlice.actions.setCurrentSongPlayInTracklist(index));
    };

    const queueHTML = songsInTrackList.map((item, index) => {
        return (
            <div
                className={
                    index == trackListIndex
                        ? "queue-item-playing"
                        : "queue-item"
                }
                key={item.id}
                onClick={() => changeSongInTracklist(index)}
            >
                <img src={item.albumImageBase64} alt="" />
                <div className="text-content">
                    <p className="song-name">{item.name}</p>
                    <p className="artis">{item.artist}</p>
                </div>
            </div>
        );
    });

    //chuyển vị trí của bài hát đang nghe ra giữa view của box
    useEffect(() => {
        const element = document.querySelector(".queue-item-playing");
        if (element && !mouseOnQueueContainer.current) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });


    const NothingHere = () => {
        return (
            <>
                <div className="nothing">
                    <div className="nothing-picture"></div>
                    <div className="nothing-text">
                        <div className="nothing-name"></div>
                        <div className="nothing-artist"></div>
                    </div>
                </div>
                <div className="nothing">
                    <div className="nothing-picture"></div>
                    <div className="nothing-text">
                        <div className="nothing-name"></div>
                        <div className="nothing-artist"></div>
                    </div>
                </div>
                <div className="nothing">
                    <div className="nothing-picture"></div>
                    <div className="nothing-text">
                        <div className="nothing-name"></div>
                        <div className="nothing-artist"></div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div
            className="home"
            style={
                fetchProfileStatus === "pending"
                    ? { backgroundColor: "black" }
                    : {
                          backgroundImage: `url(${userBackgroundImage})`,
                          backgroundSize: "cover",
                      }
            }
        >
            <div className="main-window"></div>
            <div className="side-window">
                <Clock />
                <div
                    className="play-queue"
                    onMouseEnter={() => (mouseOnQueueContainer.current = true)}
                    onMouseLeave={() => (mouseOnQueueContainer.current = false)}
                >
                    {queueHTML.length === 0 ? <NothingHere /> : queueHTML}
                </div>
            </div>
        </div>
    );
}
