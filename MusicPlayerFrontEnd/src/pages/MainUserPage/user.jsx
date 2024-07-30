import React from "react";
import NavBar from "../../assets/NavBar/NavBar";
import Player from "../../assets/Player/Player";
import Home from "../../assets/Home/Home";
import { useNavigate } from "react-router-dom";
import "./user.scss";
import { defaultAlbumImageBase64 } from "../../assets/imageBase64";
import axios from "axios";
export const TokenContext = React.createContext();

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function UserPage() {
    const [mainComponent, setMainComponent] = React.useState(<Home key="home"/>); // Điều khiển mainComponent
    const [avatar, setAvatar] = React.useState("");
    const [tokenData, setTokenData] = React.useState({
        token: "",
        username: "",
    });
    const [background, setBackground] = React.useState("");
    const tracklist = React.useRef([]); //lưu tracklist khi được load từ mainComponent
    const tracklistIndex = React.useRef(); // lưu index tracklist đang chơi
    // Playsong là bài hát hiện tại đang được play

    const [userLists, setUserLists] = React.useState([]);

    const [playSong, setPlaySong] = React.useState({
        id: "",
        name: "Unknow",
        artist: "Unknow",
        albumImageBase64: defaultAlbumImageBase64,
    });

    // xử lý playAll từ các mainComponent
    const handlePlayAll = (arr) => {
        if(arr && arr.length !== 0){
            tracklist.current = arr;
            tracklistIndex.current = 0;
            setPlaySong(tracklist.current[tracklistIndex.current]);
        }
    };

    const getUserLists = () => {
        axios
            .get(`${APIurl}/api/v1/users/lists`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                setUserLists(res.data.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };

    const getUserAvatar = () => {
        axios
            .get(`${APIurl}/api/v1/users/avatar`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                setAvatar(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUserBackground = () => {
        axios
            .get(`${APIurl}/api/v1/users/background`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            })
            .then((res) => {
                setBackground(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Navigate notoken
    const navigate = useNavigate();
    // Xác thực chưa ổn
    React.useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) {
            navigate("/login");
        } else {
            const { token, username } = JSON.parse(savedToken);
            setTokenData({ token: token, username: username });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <TokenContext.Provider
            value={{
                tokenData,
                playSong,
                setPlaySong,
                handlePlayAll,
                tracklist,
                tracklistIndex,
                setMainComponent,
                userLists,
                getUserLists,
                avatar,
                getUserAvatar,
                background,
                getUserBackground
            }}
        >
            <div className="user-page">
                <NavBar
                    handleLogout={handleLogout}
                    mainComponent={mainComponent}
                    setMainComponent={setMainComponent}
                />
                <Player />
                {mainComponent}
            </div>
        </TokenContext.Provider>
    );
}
