import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import HomePage from "./HomePage/HomePage";
import MusicPage from "./MusicPage/MusicPage";
import FavoriteMusicPage from "./FavoriteMusicPage/FavoriteMusicPage";
import UserProfile from "./ProfilePage/UserProfile";
import "./UserPage.scss";
import Player from "./Player/Player";
import PlaylistPage from "./PlaylistPage/PlaylistPage";


export default function UserPage() {
    return (
        <div className="user-page">
            <NavBar />
            <Player />
            <Routes>
                <Route index element={<HomePage />}></Route>
                <Route path="profile" element={<UserProfile />}></Route>
                <Route path="home" element={<HomePage />}></Route>
                <Route path="music" element={<MusicPage />}></Route>
                <Route
                    path="favorite-music"
                    element={<FavoriteMusicPage />}
                ></Route>
                <Route path="playlist/:id" element={<PlaylistPage/>}></Route>
                {/* Add full screen blank when id is not exsit */}
            </Routes>
        </div>
    );
}
