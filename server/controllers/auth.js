import User from "../models/User.js";
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from dotenv
import otpGenerator from 'otp-generator'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 465,
    host: 'smtp.gmail.com'
});

export const signup = async (req, res, next) => {
    const { email } = req.body
    // Chcek we have an email
    if (!email) {
        return res.status(422).send({ message: "Missing email. " });
    }
    try {
        // Check if email is in use
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already in use."
            });
        }
        // Step1-Create and save the userconst salt=bcrypt.genSaltSync(10)
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashedPassword });

        newUser.save().then((user) => {
            // create jwt token
            const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
            res.status(200).json({ token, user });
        }).catch((err) => { next(err) });
    }
    catch (err) {
        next(err);
    }
}