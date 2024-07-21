import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faAt,
    faEye,
    faEyeSlash,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./register.scss";

const APIurl = import.meta.env.VITE_APIServerUrl;
//Config lại env.
const FRONTEND_ID_KEY = "4PvBlqCTz5";

export default function RegisterPage() {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [visablePassword, setVisablePassword] = React.useState(false);
    const [visableComfirmPassword, setVisableComfirmPassword] =
        React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 10000);
    }, [message]);

    const changeVisablePassword = () => {
        setVisablePassword((prev) => !prev);
    };

    const changeVisableComfirmPassword = () => {
        setVisableComfirmPassword((prev) => !prev);
    };

    const handelRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!username) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please provide username</p>
            );
        }
        if (!email) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please provide Email</p>
            );
        }
        if (!password) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please provide password</p>
            );
        }
        if (!confirmPassword) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Please comfirm password</p>
            );
        }
        if (password !== confirmPassword) {
            setLoading(false);
            return setMessage(
                <p style={{ color: "#E5342FFF" }}>Password do not match</p>
            );
        }


        //CHECKSUM
        const combineParam = `${username}|${email}|${password}|${FRONTEND_ID_KEY}`;
        console.log(combineParam);

        let checkSum ="";
        async function sha256(message) {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            const hash = await crypto.subtle.digest('SHA-256', data);
            return hexString(hash);
        }
        
        function hexString(buffer) {
            const byteArray = new Uint8Array(buffer);
            const hexCodes = [...byteArray].map(byte => {
                const hexCode = byte.toString(16);
                return hexCode.padStart(2, '0');
            });
            return hexCodes.join('');
        }

        sha256(combineParam).then(hash => {
            checkSum=hash;
            axios
            .post(`${APIurl}/api/v1/auth/register`, {
                username: username,
                email: email,
                password: password,
                checkSum : checkSum,
            })
            .then((res) => {
                setMessage(
                    <p style={{ color: "#7FDF4BFF" }}>{res.data.msg}</p>
                );
                setLoading(false);
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            })
            .catch((error) => {
                setLoading(false);
                setMessage(
                    <p style={{ color: "#E5342FFF" }}>
                        {error.response.data.msg}
                    </p>
                );
            });
        }); 
    };

    return (
        <div className="register">
            <div className="content-container">
                <div className="side-picture">
                    <h1>Wellcome</h1>
                    <p>Join and become part of music world.</p>
                    <p>www.mysite.com</p>
                </div>
                <div className="register-container">
                    <h1>Register</h1>
                    <p>Come here and join us</p>
                    <form className="register-form" onSubmit={handelRegister}>
                        <div className="username text-container">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="email text-container">
                            <FontAwesomeIcon icon={faAt} className="icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="confirm-password text-container">
                            <FontAwesomeIcon
                                icon={
                                    visableComfirmPassword ? faEye : faEyeSlash
                                }
                                className="icon eye-icon"
                                onClick={changeVisableComfirmPassword}
                            />
                            <input
                                type={
                                    visableComfirmPassword ? "text" : "password"
                                }
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                        <button>
                            {loading ? (
                                <FontAwesomeIcon
                                    className="spinner"
                                    icon={faSpinner}
                                />
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>
                    {message}
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
