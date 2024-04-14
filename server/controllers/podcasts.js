import express from 'express';
import User from '../models/User.js';
import Episodes from '../models/Episodes.js';
import Podcasts from '../models/Podcasts.js';

export const createPodcast = async (req, res, next) => {
    try {
        // Find the user who is creating the podcast
        const user = await User.findById(req.user.id);

        // Initialize an empty array to store the IDs of the episodes
        let episodeList = [];

        // Loop through each episode in the request body
        await Promise.all(req.body.episodes.map(async (item) => {
            // Create a new episode using the data from the request
            const episode = new Episodes({ creator: user.id, ...item });

            // Save the episode to the database and get the saved episode
            const savedEpisode = await episode.save();

            // Push the ID of the saved episode into the episodeList array
            episodeList.push(savedEpisode._id);
        }));

        // Create a new podcast
        const podcast = new Podcasts({
            // Set the creator of the podcast to the user's ID
            creator: user.id,

            // Set other properties of the podcast from the request body
            name: req.body.name,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            tags: req.body.tags,
            type: req.body.type,
            category: req.body.category,

            // Set the episodes of the podcast to the IDs stored in episodeList
            episodes: episodeList,
        });

        // Save the podcast to the database and get the saved podcast
        const savedPodcast = await podcast.save();

        // Add the ID of the saved podcast to the user's list of podcasts
        await User.findByIdAndUpdate(user.id, {
            $push: { podcasts: savedPodcast.id },
        }, { new: true });

        // Send a response with status code 201 (Created) and the saved podcast
        res.status(201).json(savedPodcast);
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
}


export const getPodcasts = async (req, res, next) => {
    try {
        // Get all podcasts from the database
        const podcasts = await Podcasts.find().populate("creator", "name img").populate("episodes");
        return res.status(200).json(podcasts);
    } catch (err) {
        next(err);
    }
};