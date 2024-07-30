/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEye,
    faEyeSlash,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./login.scss";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [visablePassword, setVisablePassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        const tokenData = JSON.parse(localStorage.getItem("token"));
        if (tokenData) {
            navigate("/user");
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 10000);
    }, [message]);

    const changeVisablePassword = () => {
        setVisablePassword((prev) => !prev);
    };

    const handelLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!username) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please provide username</p>
            );
        }
        if (!password) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please provide password</p>
            );
        }
        axios
            .post(`${APIurl}/api/v1/auth/login`, {
                username: username,
                password: password,
            })
            .then((res) => {
                setLoading(false);
                localStorage.setItem("token", JSON.stringify(res.data.data));
                navigate("/user");
                setMessage(
                    <p style={{ color: "#7FDF4BFF" }}>{res.data.msg}</p>
                );
                setUsername("");
                setPassword("");
            })
            .catch((error) => {
                setLoading(false);
                setMessage(
                    <p style={{ color: "#E5342FFF" }}>
                        {error.response.data.msg}
                    </p>
                );
                setTimeout(() => {
                    setMessage("");
                }, 10000);
            });
    };

    return (
        <div className="login">
            <div className="content-container">
                <div className="side-picture">
                    <h1>Wellcome Back</h1>
                    <p>To the world of music.</p>
                    <p>www.mysite.com</p>
                </div>
                <div className="login-container">
                    <h1>Login</h1>
                    <p>Explore the world of music</p>
                    <form className="login-form" onSubmit={handelLogin}>
                        <div className="text-container">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="password text-container">
                            <FontAwesomeIcon
                                icon={visablePassword ? faEye : faEyeSlash}
                                className="icon eye-icon"
                                onClick={changeVisablePassword}
                            />
                            <input
                                type={visablePassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button>
                            {loading ? (
                                <FontAwesomeIcon
                                    className="spinner"
                                    icon={faSpinner}
                                />
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                    {message}
                    <p>
                        Dont have an account?{" "}
                        <Link to="/register" className="link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
