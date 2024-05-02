import User from '../models/User.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "podcasts",
            populate: {
                path: "creator",
                select: "name img",
            }
        }).populate({
            path: "favourites",
            populate: {
                path: "favourites",
                select: "name img",
            }
        });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}