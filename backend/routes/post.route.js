import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { getUserPosts,createPost,getLikedPosts,getFollowingPosts, deletePost ,createComment, likeUnlikePost, getAllPosts } from '../Controllers/post.controllers.js';

const router = express.Router();
import multer from "multer";

// Store files in memory (useful for Cloudinary, S3, etc.)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/all', protectRoute, getAllPosts)
router.get("/following", protectRoute, getFollowingPosts);
router.get('/user/:username',protectRoute,getUserPosts)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.post("/create",protectRoute,upload.single("img"),createPost)
router.post("/like/:id",protectRoute ,likeUnlikePost)
router.post("/comment/:id",protectRoute, createComment)
router.delete("/:id",protectRoute,deletePost)

export default router;