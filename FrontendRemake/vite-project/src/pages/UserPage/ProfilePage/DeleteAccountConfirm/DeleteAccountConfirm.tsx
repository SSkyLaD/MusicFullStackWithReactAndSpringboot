import React from "react";
import "./DeleteAccountConfirm.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import userSlice, { fetchDeleteAccout } from "../../userSlice";
import { failedNotification, successNotification } from "../../Component/notification";
import useResetAndNavigate from "../../../../CustomHook/useResetAndNavigate";

interface DeleteAccountConfirmParams {
    deleteConfirm: boolean;
    setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteAccountConfirm({
    deleteConfirm,
    setDeleteConfirm,
}: DeleteAccountConfirmParams) {
    const dispatch = useDispatch<AppDispatch>();
    const { username } = useSelector(
        (state: RootState) => state.users.navBarState
    );
    const { fetchDeleteAccountStatus } = useSelector(
        (state: RootState) => state.users.profileState
    );

    const [input, setInput] = React.useState("");
    const [errorMgs, setErrorMsg] = React.useState("");
    const navigate = useNavigate();
    const resetAndNavigate = useResetAndNavigate()

    const handleDeleteAcc = (password: string) => {
        dispatch(fetchDeleteAccout(password))
            .unwrap()
            .then(() => {
                successNotification(`Account deleted successfully!`);
                dispatch(userSlice.actions.resetState());
                navigate("/login");
            })
            .catch((error) => {
                if(error.code == 444){
                    resetAndNavigate();
                    failedNotification("Your account logged in different location");
                }
                else{
                    setErrorMsg(error.msg);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 7000);
                }
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                        <form
                            onSubmit={(e) => {
                                if (fetchDeleteAccountStatus === "pending") {
                                    return;
                                }
                                e.preventDefault();
                                handleDeleteAcc(input);
                            }}
                        >
                            <input
                                type="password"
                                placeholder="Enter your password..."
                                value={input}
                                onChange={handleInputChange}
                            />
                        </form>
                        <p className="error">{errorMgs}</p>
                    </div>
                    <div className="pop-bot">
                        <button
                            disabled={
                                fetchDeleteAccountStatus === "pending"
                                    ? true
                                    : false
                            }
                            onClick={() => handleDeleteAcc(input)}
                        >
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
