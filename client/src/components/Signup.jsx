import React, { useEffect, useState } from 'react'
import Google from '../assets/google.webp'
import { loginFailure, loginStart, loginSuccess, verified } from '../../redux/userSlice'
import { openSnackbar } from '../../redux/snackbarSlice'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import validator from 'validator';
import { googleSignIn, signUp } from "../api/index";
import OTP from './OTP';
import { useGoogleLogin } from '@react-oauth/google';
import { closeSignin, openSignin } from '../../redux/setSigninSlice';
import { FaRegEye, FaRegEyeSlash, FaGoogle } from 'react-icons/fa';

const Signup = ({ setSignUpOpen, setSignInOpen }) => {
    const [nameValidated, setNameValidated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [credentialError, setcredentialError] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [nameCorrect, setNameCorrect] = useState(false);
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const dispatch = useDispatch();

    const createAccount = () => {
        if (otpVerified) {
            dispatch(loginStart());
            setDisabled(true);
            setLoading(true);
            try {
                signUp({ name, email, password }).then((res) => {
                    if (res.status === 200) {
                        dispatch(loginSuccess(res.data));
                        dispatch(
                            openSnackbar({ message: `OTP verified & ACcount created successfully`, severity: "sucess" })
                        );
                        setLoading(false);
                        setDisabled(false);
                        setSignUpOpen(false);
                        dispatch(closeSignin());
                    } else {
                        dispatch(loginFailure());
                        setcredentialError(`${res.data.message}`);
                        setLoading(false);
                        setDisabled(false);
                    }
                });
            } catch (error) {
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
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!disabled) {
            setOtpSent(true);
        }
        if (name === "" || email === "" || password === "") {
            dispatch(
                openSnackbar({
                    message: "Please fill all the fields",
                    severity: "error",
                })
            );
        }
    }

    useEffect(() => {
        if (email !== "") validateEmail();
        if (password !== "") validatePassword();
        if (name !== "") validateName();
        if (
            name !== "" &&
            validator.isEmail(email) &&
            passwordCorrect &&
            nameCorrect
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [name, email, passwordCorrect, password, nameCorrect]);

    useEffect(() => {
        createAccount();
    }, [otpVerified]);

    //validate email
    const validateEmail = () => {
        if (validator.isEmail(email)) {
            setEmailError("");
        } else {
            setEmailError("Enter a valid Email Id!");
        }
    };

    //validate password
    const validatePassword = () => {
        if (password.length < 8) {
            setcredentialError("Password must be atleast 8 characters long!");
            setPasswordCorrect(false);
        } else if (password.length > 16) {
            setcredentialError("Password must be less than 16 characters long!");
            setPasswordCorrect(false);
        } else if (
            !password.match(/[a-z]/g) ||
            !password.match(/[A-Z]/g) ||
            !password.match(/[0-9]/g) ||
            !password.match(/[^a-zA-Z\d]/g)
        ) {
            setPasswordCorrect(false);
            setcredentialError(
                "Password must contain atleast one lowercase, uppercase, number and special character!"
            );
        } else {
            setcredentialError("");
            setPasswordCorrect(true);
        }
    };

    //validate name
    const validateName = () => {
        if (name.length < 4) {
            setNameValidated(false);
            setNameCorrect(false);
            setcredentialError("Name must be atleast 4 characters long!");
        } else {
            setNameCorrect(true);
            if (!nameValidated) {
                setcredentialError("");
                setNameValidated(true);
            }

        }
    };

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
    //           dispatch(closeSignin())
    //           setSignUpOpen(false);
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
    //       dispatch(
    //         openSnackbar({
    //           message: errorResponse.error,
    //           severity: "error",
    //         })
    //       );
    //       setLoading(false);
    //     },
    //   });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="w-96 rounded-2xl bg-white dark:bg-gray-800 p-4 flex flex-col relative">
                <button
                    className="absolute top-6 right-8 cursor-pointer text-gray-500 dark:text-gray-400"
                    onClick={() => setSignUpOpen(false)}
                >
                    <FaRegEyeSlash />
                </button>
                {!otpSent ? (
                    <>
                        <div className="text-2xl font-medium text-black dark:text-white mt-4 mb-6 mx-7">Sign Up</div>
                        <div
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center cursor-pointer mx-6 my-4"
                            onClick={() => googleLogin()}
                        >
                            {Loading ? (
                                <div className="text-sm text-gray-400">
                                    <FaCircularProgress className="animate-spin mr-2" />
                                    Loading
                                </div>
                            ) : (
                                <>
                                    <FaGoogle className="w-5 h-5 mr-4" />
                                    Sign In with Google
                                </>
                            )}
                        </div>
                        <div className="flex justify-center items-center text-gray-500 dark:text-gray-400 text-sm font-semibold">
                            <div className="w-20 h-px bg-gray-300 dark:bg-gray-600"></div>
                            <span className="mx-2">or</span>
                            <div className="w-20 h-px bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                        <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center mx-6 my-4">
                            <Person className="text-xl pr-3" />
                            <input
                                className="w-full bg-transparent outline-none text-gray-500 dark:text-gray-400"
                                placeholder="Full Name"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center mx-6 my-4">
                            <EmailRounded className="text-xl pr-3" />
                            <input
                                className="w-full bg-transparent outline-none text-gray-500 dark:text-gray-400"
                                placeholder="Email Id"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {emailError && <div className="text-red-500 text-xs mx-6 my-2">{emailError}</div>}
                        <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center mx-6 my-4">
                            <PasswordRounded className="text-xl pr-3" />
                            <input
                                className="w-full bg-transparent outline-none text-gray-500 dark:text-gray-400"
                                type={values.showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="text-inherit"
                                onClick={() =>
                                    setValues({ ...values, showPassword: !values.showPassword })
                                }
                            >
                                {values.showPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                            </button>
                        </div>
                        {credentialError && <div className="text-red-500 text-xs mx-6 my-2">{credentialError}</div>}
                        <div
                            className={`h-11 rounded-lg text-white flex items-center justify-center mx-6 my-2 ${disabled ? 'bg-gray-400' : 'bg-blue-600'} cursor-pointer`}
                            onClick={handleSignUp}
                        >
                            {Loading ? <div className="text-sm text-gray-400">
                                <FaCircularProgress className="animate-spin mr-2" />
                                Loading
                            </div> : "Create Account"}
                        </div>
                    </>
                ) : (
                    <OTP email={email} name={name} otpVerified={otpVerified} setOtpVerified={setOtpVerified} />
                )}
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-6 my-10 flex justify-center items-center">
                    Already have an account?
                    <span
                        className="text-blue-600 dark:text-blue-400 font-medium ml-1 cursor-pointer"
                        onClick={() => {
                            setSignUpOpen(false);
                            dispatch(openSignin());
                        }}
                    >
                        Sign In
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup 