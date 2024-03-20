import express from 'express';
import { signup, signin, logout, googleAuthSignIn, generateOTP, verifyOTP, createResetSession, findUserByEmail, resetPassword } from "../controllers.auth.js";
import { localVariables } from '../middleware/auth.js';

const router = express.Router();

// create a user
router.post("/signup", signup);
// signin
router.post("signin", signin);
// logout
router.post("/logout", logout);
// google signin
router.post("/google", googleAuthSignIn);
// find user by email
router.get("/findbyemail", findUserByEmail);
// generate otp
router.get("/generateotp", localVariables, generateOTP);
// verify otp
router.get("verifyotp", verifyOTP);
// create reset session
router.get("/createResetSession", createResetSession);
// forgot password
router.post("/forgetPassword", resetPassword);