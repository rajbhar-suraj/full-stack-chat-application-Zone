import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar,getMessages,sendMessage } from '../controllers/message.controller.js';
import {upload} from '../lib/cloudinary.js';

const router = express.Router();

router.get('/users',protectedRoute,getUsersForSidebar)
router.get('/:id',protectedRoute,getMessages)
router.post('/send/:id',protectedRoute,upload.single('image'),sendMessage)

export default router