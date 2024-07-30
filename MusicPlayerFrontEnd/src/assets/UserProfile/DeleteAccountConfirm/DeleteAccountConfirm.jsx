import React from "react";
import "./DeleteAccountConfirm.scss";
import axios from "axios";
import { TokenContext } from "../../../pages/MainUserPage/user";
import { useNavigate } from "react-router-dom";

const APIurl = import.meta.env.VITE_APIServerUrl;

export default function DeleteAccountConfirm({
    username,
    deleteConfirm,
    setDeleteConfirm,
}) {
    const { tokenData } = React.useContext(TokenContext);
    const [input, setInput] = React.useState("");
    const [errorMgs, setErrorMsg] = React.useState("");
    const navigate = useNavigate();

    const handleDeleteAcc = (password) => {
        axios
            .post(
                `${APIurl}/api/v1/users/delete`,
                {
                    password: `${password}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            )
            .then(() => {
                localStorage.removeItem("token");
                navigate("/login");
            })
            .catch((err) => {
                console.log(err);
                setErrorMsg(err.response.data.msg);
                setTimeout(() => {
                    setErrorMsg("");
                }, 10000);
            });
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return deleteConfirm ? (
        <div>
            <div className="popup-delete">
                <div className="popup-container">
                    <div className="pop-top">
                        <h3>DELETE ACCOUNT: {username}?</h3>
                        <p>
                            This action wil delete your account PERMENTLY and
                            cannot be undone, please enter account password to
                            confirm your action.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your password..."
                            value={input}
                            onChange={handleInputChange}
                        />
                        <p className="error">{errorMgs}</p>
                    </div>
                    <div className="pop-bot">
                        <button onClick={() => handleDeleteAcc(input)}>
                            Confirm
                        </button>
                        <button
                            className="close"
                            onClick={() => setDeleteConfirm(false)}
                        >
                            Cancle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}
