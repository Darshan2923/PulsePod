import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "",
    },
    googleSignIn: {
        type: Boolean,
        required: true,
        default: false,
    },
    podcasts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    }
},
    { timestamps: true });

export default mongoose.model("User", UserSchema)