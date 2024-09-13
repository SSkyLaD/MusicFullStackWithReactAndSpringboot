import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/login";
import RegisterPage from "./pages/ResgisterPage/register";
import BlankPage from "./pages/BlankPage/blank";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserPage from "./pages/UserPage/UserPage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import appSlice from "./appSlice";


export default function App() {
    const dispatch = useDispatch<AppDispatch>();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenColorDepth = window.screen.colorDepth;
    const screenPixelDepth = window.screen.pixelDepth;
    const cpuCores = navigator.hardwareConcurrency;

    const deviceFingerPrint = `${timeZone}|${language}|${userAgent}|${screenWidth}|${screenHeight}|${screenColorDepth}|${screenPixelDepth}|${cpuCores}`;

    dispatch(appSlice.actions.setDeviceFingerPrint(deviceFingerPrint));

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage />} />
                <Route path="/user/*" element={<UserPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<BlankPage />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}
