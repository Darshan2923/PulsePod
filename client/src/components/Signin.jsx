import React from 'react'
import { loginStart, loginFailure, loginSuccess } from '../../redux/userSlice'
import { openSnackbar } from '../../redux/snackbarSlice';
import { useDispatch } from 'react-redux';
import validator from 'validator';
import { googleSignIn, findUserByEmail, resetPassword, signIn } from '../api';
import OTP from './OTP';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { closeSignin } from '../../redux/setSigninSlice';


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });

    //verify otp
    const [showOTP, setShowOTP] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    //reset password
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [samepassword, setSamepassword] = useState("");
    const [newpassword, setNewpassword] = useState("");
    const [confirmedpassword, setConfirmedpassword] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [resetDisabled, setResetDisabled] = useState(true);
    const [resettingPassword, setResettingPassword] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (email !== "") validateEmail();
        if (validator.isEmail(email) && password.length > 5) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!disabled) {
            dispatch(loginStart());
            setDisabled(true);
            setLoading(true);
            try {
                signIn({ email, password }).then((res) => {
                    if (res.status === 200) {
                        dispatch(loginSuccess(res.data));
                        setLoading(false);
                        setDisabled(false);
                        dispatch(
                            closeSignin()
                        )
                        dispatch(
                            openSnackbar({
                                message: "Logged In Successfully",
                                severity: "success",
                            })
                        );
                    } else if (res.status === 203) {
                        dispatch(loginFailure());
                        setLoading(false);
                        setDisabled(false);
                        setcredentialError(res.data.message);
                        dispatch(
                            openSnackbar({
                                message: "Account Not Verified",
                                severity: "error",
                            })
                        );
                    } else {
                        dispatch(loginFailure());
                        setLoading(false);
                        setDisabled(false);
                        setcredentialError(`Invalid Credentials : ${res.data.message}`);
                    }
                });
            } catch (err) {
                dispatch(loginFailure());
                setLoading(false);
                setDisabled(false);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            }
        }
        if (email === "" || password === "") {
            dispatch(
                openSnackbar({
                    message: "Please fill all the fields",
                    severity: "error",
                })
            );
        }
    };

    const [emailError, setEmailError] = useState("");
    const [credentialError, setcredentialError] = useState("");

    //   validate email
    const validateEmail = () => {
        if (validator.isEmail(email)) {
            setEmailError("");
        } else {
            setEmailError("Enter a valid Email Id!");
        }
    };

    //validate password
    const validatePassword = () => {
        if (newpassword.length < 8) {
            setSamepassword("Password must be atleast 8 characters long!");
            setPasswordCorrect(false);
        } else if (newpassword.length > 16) {
            setSamepassword("Password must be less than 16 characters long!");
            setPasswordCorrect(false);
        } else if (
            !newpassword.match(/[a-z]/g) ||
            !newpassword.match(/[A-Z]/g) ||
            !newpassword.match(/[0-9]/g) ||
            !newpassword.match(/[^a-zA-Z\d]/g)
        ) {
            setPasswordCorrect(false);
            setSamepassword(
                "Password must contain atleast one lowercase, uppercase, number and special character!"
            );
        }
        else {
            setSamepassword("");
            setPasswordCorrect(true);
        }
    };

    useEffect(() => {
        if (newpassword !== "") validatePassword();
        if (
            passwordCorrect
            && newpassword === confirmedpassword
        ) {
            setSamepassword("");
            setResetDisabled(false);
        } else if (confirmedpassword !== "" && passwordCorrect) {
            setSamepassword("Passwords do not match!");
            setResetDisabled(true);
        }
    }, [newpassword, confirmedpassword]);

    const sendOtp = () => {
        if (!resetDisabled) {
            setResetDisabled(true);
            setLoading(true);
            findUserByEmail(email).then((res) => {
                if (res.status === 200) {
                    setShowOTP(true);
                    setResetDisabled(false);
                    setLoading(false);
                }
                else if (res.status === 202) {
                    setEmailError("User not found!")
                    setResetDisabled(false);
                    setLoading(false);
                }
            }).catch((err) => {
                setResetDisabled(false);
                setLoading(false);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            });
        }
    };

    const performResetPassword = async () => {
        if (otpVerified) {
            setShowOTP(false);
            setResettingPassword(true);
            await resetPassword(email, confirmedpassword).then((res) => {
                if (res.status === 200) {
                    dispatch(
                        openSnackbar({
                            message: "Password Reset Successfully",
                            severity: "success",
                        })
                    );
                    setShowForgotPassword(false);
                    setEmail("");
                    setNewpassword("");
                    setConfirmedpassword("");
                    setOtpVerified(false);
                    setResettingPassword(false);
                }
            }).catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
                setShowOTP(false);
                setOtpVerified(false);
                setResettingPassword(false);
            });
        }
    }
    const closeForgetPassword = () => {
        setShowForgotPassword(false)
        setShowOTP(false)
    }
    useEffect(() => {
        performResetPassword();
    }, [otpVerified]);

    //Google SignIn
    // const googleLogin = useGoogleLogin({
    //     onSuccess: async (tokenResponse) => {
    //       setLoading(true);
    //       const user = await axios.get(
    //         'https://www.googleapis.com/oauth2/v3/userinfo',
    //         { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
    //       ).catch((err) => {
    //         dispatch(loginFailure());
    //         dispatch(
    //           openSnackbar({
    //             message: err.message,
    //             severity: "error",
    //           })
    //         );
    //       });

    //       googleSignIn({
    //         name: user.data.name,
    //         email: user.data.email,
    //         img: user.data.picture,
    //       }).then((res) => {
    //         console.log(res);
    //         if (res.status === 200) {
    //           dispatch(loginSuccess(res.data));
    //           dispatch(
    //             closeSignin()
    //           );
    //           dispatch(
    //             openSnackbar({
    //               message: "Logged In Successfully",
    //               severity: "success",
    //             })
    //           );
    //           setLoading(false);
    //         } else {
    //           dispatch(loginFailure(res.data));
    //           dispatch(
    //             openSnackbar({
    //               message: res.data.message,
    //               severity: "error",
    //             })
    //           );
    //           setLoading(false);
    //         }
    //       });
    //     },
    //     onError: errorResponse => {
    //       dispatch(loginFailure());
    //       setLoading(false);
    //       dispatch(
    //         openSnackbar({
    //           message: errorResponse.error,
    //           severity: "error",
    //         })
    //       );
    //     },
    //   });









    return (
        <div>Signin</div>
    )
}

export default Signin