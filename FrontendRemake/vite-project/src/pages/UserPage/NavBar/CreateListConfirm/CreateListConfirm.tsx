import React from "react";
import { successNotification } from "../../Component/notification";
import "./CreateListConfirm.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { fetchCreatePlaylist } from "../../userSlice";

interface CreateListConfirm {
    createList: boolean;
    setCreateList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateListConfirm({
    createList,
    setCreateList,
}: CreateListConfirm) {
    const dispatch = useDispatch<AppDispatch>();
    const [listName, setListName] = React.useState("");
    const [warning, setWarning] = React.useState("");

    const handleConfirmButton = () => {
        if (!listName) {
            setWarning("Playlist name cannot empty");
            return;
        }

        dispatch(fetchCreatePlaylist(listName))
            .unwrap()
            .then((res) => {
                successNotification(res.msg);
                setCreateList(false);
                setListName("");
            })
            .catch((err) => {
                setWarning(err.msg);
                setTimeout(() => {
                    setWarning("");
                }, 10000);
            });
    };

    const handleCancelButton = () => {
        setListName("");
        setCreateList(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListName(event.target.value);
    };

    return createList ? (
        <div className="create-popup">
            <div className="create-container">
                <div className="top-section">
                    <h3>Create new playlist</h3>
                    <input
                        type="text"
                        className="name-input"
                        placeholder="Enter playlist name..."
                        value={listName}
                        onChange={handleChange}
                    />
                    <p className="warning">{warning}</p>
                </div>
                <div className="bottom-section">
                    <button className="confirm" onClick={handleConfirmButton}>
                        Create
                    </button>
                    <button className="cancel" onClick={handleCancelButton}>
                        Cancle
                    </button>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}
