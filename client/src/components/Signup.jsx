import React from 'react'
import Google from '../assets/google.webp'
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice'
import { openSnackbar } from '../../redux/snackbarSlice'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import validator from 'validator';
import { googleSignIn, signUp } from "../api/index";
import OTP from './OTP';
import { useGoogleLogin } from '@react-oauth/google';
import { closeSignin, openSignin } from '../../redux/setSigninSlice';

const Signup = ({ setSignUpOpen, setSignInOpen }) => {
    const [nameValidated, setNameValidated] = useState(false);

    return (
        <div>Signup</div>
    )
}

export default Signup 