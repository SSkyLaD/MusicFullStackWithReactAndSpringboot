import "./Home.scss";
import Clock from "./Clock/Clock";
import React, { useEffect } from "react";
import { TokenContext } from "../../pages/UserPage/user";

export default function Home() {
    const { tracklist, tracklistIndex, setPlaySong } =
        React.useContext(TokenContext);
    const [queue, setQueue] = React.useState(tracklist.current);
    const mouseOnQueueContainer = React.useRef(false);

    const changeSongInTracklist = (index) => {
        tracklistIndex.current = index;
        setPlaySong(tracklist.current[tracklistIndex.current]);
    };

    //chuyển vị trí của bài hát đang nghe ra giứa view của box

    const queueHTML = queue.map((item, index) => {
        return (
            <div
                className={
                    index == tracklistIndex.current
                        ? "queue-item-playing"
                        : "queue-item"
                }
                key={item._id}
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

    useEffect(() => {
        setQueue(tracklist.current);
        const element = document.querySelector(".queue-item-playing");
        if (element && !mouseOnQueueContainer.current) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [tracklist.current, tracklistIndex.current]);

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
        <div className="home">
            <div className="main-window"></div>
            <div className="side-window">
                <Clock className="clock" />
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
