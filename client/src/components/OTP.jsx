import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { generateOtp, verifyOtp } from '../api'
import { ToastContainer, toast } from 'react-toastify';

const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [showTimer, setShowTimer] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState('00:00');

    const Ref = useRef(null);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        }
    }
    const startTimer = (e) => {
        let { total, hours, minutes, seconds } = getTimeRemaining(e)
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }

    const clearTimer = (e) => {
        setTimer('01:00');
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    }

    const sendOtp = async () => {
        await generateOtp(email, name, reason).then((res) => {
            if (res.status === 200) {
                toast.success("OTP sent successfully");
                setDisabled(true);
                setOtp('');
                setOtpError('');
                setOtpLoading(false);
                setOtpSent(true);
                console.log(res.data);
            } else {
                toast.error("An error occured");
            }
        }).catch((err) => {
            toast.error("An error occured");
        })
    }

    const resendOtp = () => {
        setShowTimer(true);
        clearTimer(getDeadTime());
        sendOtp();
    }

    const validOtp = () => {
        setOtpLoading(true);
        setDisabled(true);
        verifyOtp(otp).then((res) => {
            if (res.status === 200) {
                setOtpVerified(true);
                setOtp('');
                setOtpError('');
                setDisabled(false);
                setOtpLoading(false);
            } else {
                setOtpError(res.data.message);
                setDisabled(false);
                setOtpLoading(false);
            }
        }).catch((err) => {
            toast.error("An error occured");
            setOtpError(err.message);
            setDisabled(false);
            setOtpLoading(false);
        })
    }
    useEffect(() => {
        sendOtp();
        clearTimer(getDeadTime());
    }, []);

    useEffect(() => {
        if (timer === '00:00') {
            setShowTimer(false);
        } else {
            setShowTimer(true);
        }
    }, [timer]);

    useEffect(() => {
        if (otp.length === 6) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [otp]);

    return (
        <>
            <ToastContainer />
            <div>
                <div className="text-2xl font-medium text-primary mt-4 mb-6 mx-5">VERIFY OTP</div>
                <div className="text-base font-medium text-secondary mx-6">A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:</div>
                <span className="text-primary text-sm mx-6">{email}</span>
                {!otpSent ?
                    <div className="py-3 px-6 mb-5 text-center flex flex-col items-center gap-3 justify-center">
                        Sending OTP
                        <CircularProgress color="inherit" size={20} />
                    </div>
                    :
                    <div>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            shouldAutoFocus={true}
                            inputStyle="text-xl w-9 h-9 rounded border border-gray-300 text-center mx-1.5 bg-transparent text-primary"
                            containerStyle="py-2 justify-center"
                            renderInput={(props) => <input {...props} />}
                        />
                        {otpError && <div className="text-red-600 text-sm mx-6 my-2"><b>{otpError}</b></div>}

                        <div
                            className={`h-11 rounded-lg border flex justify-center items-center font-medium text-sm mx-5 my-3 px-3 ${!disabled ? 'bg-primary text-white' : 'border-secondary text-secondary'}`}
                            onClick={() => validateOtp()}
                            style={{ cursor: !disabled ? 'pointer' : 'not-allowed' }}
                        >
                            {otpLoading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : (
                                "Submit"
                            )}
                        </div>

                        {showTimer ?
                            <div className="text-secondary text-sm mx-6 my-2">
                                Resend in <b>{timer}</b>
                            </div>
                            :
                            <div className="text-primary text-base mx-6 my-2 cursor-pointer" onClick={() => resendOtp()}>
                                <b>Resend</b>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default OTP