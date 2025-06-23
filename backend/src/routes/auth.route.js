import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { upload } from '../lib/cloudinary.js';

//routes
const router = express.Router()

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);


router.put('/update-profile',protectedRoute,upload.single('profilePic'),updateProfile);

//used for checking if the user is authorize or not
router.get('/check', protectedRoute, checkAuth)

export default router