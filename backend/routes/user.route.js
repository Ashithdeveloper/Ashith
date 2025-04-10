import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getProfile,followUnFollowUser,getSuggestedUsers, updateUser , searchUser} from "../Controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggested",protectRoute,getSuggestedUsers);
router.post("/update",protectRoute,updateUser)
router.get("/search", protectRoute, searchUser )

export default router;