import express from 'express'
import { addView, addepisodes, createPodcast, favoritPodcast, getByCategory, getByTag, getPodcastById, getPodcasts, mostpopular, random, search } from '../controllers/podcasts.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create a podcast
router.post("/", verifyToken, createPodcast);
// get all podcasts
router.get("/", getPodcasts);

// get podcast by id
router.get("/get/:id", getPodcastById)

//add episode to a 
router.post("/episode", verifyToken, addepisodes);

//favorit/unfavorit podcast
router.post("/favorites", verifyToken, favoritPodcast);

//add view
router.post("/addview/:id", addView);


//searches
router.get("/mostpopular", mostpopular)
router.get("/random", random)
router.get("/tags", getByTag)
router.get("/category", getByCategory)
router.get("/search", search)

export default router;