import React, { useState } from "react";
import Loading from "../../../assets/Loading/Loading";
import "./OTPInput.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    successNotification,
    failedNotification,
} from "../../UserPage/Component/notification";
import getDeviceFingerprint from "../../../utilities/getDeviceFingerprint";
const APIurl = import.meta.env.VITE_APIServerUrl;

interface OTPInputProps {
    username: string;
}

const OTPInput = ({ username }: OTPInputProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [init, setInit] = useState(true);

    const handleChange = (element: HTMLInputElement, index: number) => {
        setInit(false);
        if (isNaN(Number(element.value))) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value != "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleSubmitOTP = () => {
        axios
            .post(`${APIurl}/api/v1/auth/loginV2/verification`, {
                username: username,
                verificationCode: otp.join(""),
                deviceFingerPrint: getDeviceFingerprint(),
            })
            .then((res) => {
                setLoading(false);
                localStorage.setItem("token", JSON.stringify(res.data.data));
                successNotification(`Wellcome back ${username}`);
                navigate("/user");
            })
            .catch((error) => {
                setLoading(false);
                failedNotification(`${error.response.data.msg}`);
            });
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <h2>Verify your account</h2>
                <p>Enter OTP code we sent to your email to login...</p>
                <div>
                    {otp.map((data, index) => {
                        return (
                            <input
                                className="otp-field"
                                type="password"
                                name="otp"
                                maxLength={1}
                                key={index}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                autoFocus={
                                    index == 0 && init == true ? true : false
                                }
                            />
                        );
                    })}
                </div>

                <button onClick={handleSubmitOTP}>
                    {loading ? <Loading /> : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default OTPInput;
