import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUserPosts,
  createPost,
  getLikedPosts,
  getFollowingPosts,
  deletePost,
  createComment,
  likeUnlikePost,
  getAllPosts,
} from "../Controllers/post.controllers.js";
import multer from "multer";

const router = express.Router();

// Store files in memory (useful for Cloudinary, S3, etc.)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);

// Support for both image and video uploads
router.post("/create", protectRoute, upload.single("media"), createPost);

router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, createComment);
router.delete("/:id", protectRoute, deletePost);

export default router;
