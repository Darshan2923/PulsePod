import express from 'express'
import { createPodcast, getPodcasts } from '../controllers/podcasts.js';

const router = express.Router();

// Create a podcast
router.post("/", createPodcast);
// get all podcasts
router.get("/", getPodcasts);

export default router;