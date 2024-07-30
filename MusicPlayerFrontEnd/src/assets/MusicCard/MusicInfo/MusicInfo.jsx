/* eslint-disable react/prop-types */
import "./MusicInfo.scss";

function MusicInfo({ songData, songInfo, setSongInfo }) {
    function timeConvert(time) {
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60);
        const formatedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        const formatedSecond = second < 10 ? `0${second}` : `${second}`;
        return `${formatedMinute}:${formatedSecond}`;
    }

    const dateConvert = (input) => {
        const dateFromDB = new Date(input);
        const day = String(dateFromDB.getDate()).padStart(2, "0");
        const month = String(dateFromDB.getMonth() + 1).padStart(2, "0");
        const year = dateFromDB.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    const fileTypeConvert = (input) => {
        const fileArr = input.split(".");
        return `.${fileArr[fileArr.length - 1]}`;
    };
    return (songInfo) ?(
        <div className="popup-info">
            <div className="popup-container">
                <div className="pop-top">
                    <h2>Property</h2>
                    <div className="content">
                        <ul>
                            <li>
                                <h4>Title</h4>
                                <p>{songData.name}</p>
                            </li>
                            <li>
                                <h4>Album</h4>
                                <p>
                                    {songData.album ? songData.album : "Unknow"}
                                </p>
                            </li>
                            <li>
                                <h4>Artist</h4>
                                <p>{songData.artist}</p>
                            </li>
                            <li>
                                <h4>Duration</h4>
                                <p>{timeConvert(songData.duration)}</p>
                            </li>
                            <li>
                                <h4>Release Date</h4>
                                <p>
                                    {songData.releaseDate ? songData.releaseDate : "Unknow"}
                                </p>
                            </li>
                            <li>
                                <h4>Upload Date</h4>
                                <p>{dateConvert(songData.uploadDate)}</p>
                            </li>
                            <li>
                                <h4>File Type</h4>
                                <p>{fileTypeConvert(songData.fileName)}</p>
                            </li>
                            <li>
                                <h4>File Size</h4>
                                <p>{songData.size + " MB"}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pop-bot">
                    <button className="close" onClick={() => setSongInfo(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    ) : ""
}

export default MusicInfo;
