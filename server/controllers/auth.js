import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';

dotenv.config();

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD,
    },
    port:465,
    host:'smtp.gmail.com'
});

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from 'path/to/UserModel'; // Import your User model here
import { createError } from "../error";

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: "Email or password is missing." });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });

        res.status(200).json({ token, user: savedUser });
    } catch (error) {
        next(error);
    }
};

export const signin=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email});
        if (!user) {
            return next(createError(201, "User not found"));
        }
        if (user.googleSignIn) {
            return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."));
        }
        const validPass=await bcrypt.compareSync(req.body.password,user.password)
        if (!validPassword) {
            return next(createError(201, "Wrong password"));
        }

        // create a jwt token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7 days"});
        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
}

export const googleAuthSignIn=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email});

        if(!user){
            try {
                const user = new User({ ...req.body, googleSignIn: true });
                await user.save();
                const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
                res.status(200).json({ token, user: user });
            } catch (err) {
                next(err);
            }
        }else if (user.googleSignIn) {
            const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
            res.status(200).json({ token, user });
        } else if (user.googleSignIn === false) {
            return next(createError(201, "User already exists with this email can't do google auth"));
        }
        
    } catch (error) {
        next(error);
    }
}

export const logout=(req,res)=>{
    res.clearCookie("access_token").json({message:"Logged out successfully"});
}

export const generateOTP=async(req,res)=>{
    req.app.locals.OTP=await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true, });
    const {email}=req.query;
    const {name}=req.query;
    const {reason}=req.query;
    const verifyOtp={
        to:email,
        subject:"Account Verification OTP",
        html:`
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your PULSEPOD Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a PULSEPOD account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PULSEPOD app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a PULSEPOD account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PULSEPOD Team</p>
</div>
        `
    };

    const resetPassOtp={
        to:email,
        subject:'PULSEPOD reset password verification',
        html:`
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your PULSEPOD Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your PULSEPOD account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PULSEPOD app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PULSEPOD Team</p>
            </div>
        `
    };
    if(reason==="FORGOTPASSWORD"){
        transporter.sendMail(resetPassOtp,(err)=>{
            if(err){
                next(err);
            }else{
                return res.status(200).json({message:"OTP sent"})
            }
        })
    }else{
        transporter.sendMail(verifyOtp,(err)=>{
            if(err){
                next(err)
            }else{
                return res.status(200).json({message:"OTP sent"})
            }
        })
    }
}

export const verifyOTP=async(req,res,next)=>{
    const {code}=req.query;
    if(parseInt(code)===parseInt(req.app.locals.OTP)){
        req.app.locals.OTP=null;
        req.app.locals.resetSession=true;
        res.status(200).json({message:"OTP verified"});
    }
    return next(createError(201,"Wrong OTP"));
}

export const createResetSession=async(req,res,next)=>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession=false;
        return res.status(200).send({message:"Access granted"})
    }
    return res.status(400).send({message:"Session expired"})
}

export const findUserByEmail = async (req, res, next) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).send({
                message: "User found"
            });
        } else {
            return res.status(202).send({
                message: "User not found"
            });
        }
    } catch (err) {
        next(err);
    }
}



