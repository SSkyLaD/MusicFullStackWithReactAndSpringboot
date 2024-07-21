import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/login";
import RegisterPage from "./pages/RegisterPage/register";
import BlankPage from "./pages/BlankPage/blank";
import UserPage from "./pages/UserPage/user";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage/>}/>
        <Route path="/user" element={<UserPage/>}/>
        <Route path ="/login" element={<LoginPage/>}/>
        <Route path ="/register" element={<RegisterPage/>} />
        <Route path ="*" element ={<BlankPage/>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}