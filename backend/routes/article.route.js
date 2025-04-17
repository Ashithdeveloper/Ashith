import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
import { createArticle, deleteArticles, getAllArticles, getFollowingArticles, getOne, getUserArticle, searchArticle } from "../Controllers/article.controllers.js";

const router = express.Router();


// Store files in memory (useful for Cloudinary, S3, etc.)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create",protectRoute,upload.single("image"),createArticle);
router.get('/getallarticle',protectRoute,getAllArticles)
router.get('/getfollowingArticle',protectRoute,getFollowingArticles)
router.delete('/:id',protectRoute,deleteArticles)
router.get('/:id',protectRoute,getOne)
router.get('/userarticle/:id',protectRoute, getUserArticle)
router.get('/article/search',protectRoute, searchArticle)


export default router;