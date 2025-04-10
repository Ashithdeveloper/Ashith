import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { deleteNotifications,getNotifications } from '../Controllers/notification.controllers.js';

const router = express.Router();

router.get('/',protectRoute,getNotifications);
router.delete('/',protectRoute,deleteNotifications);

export default router;