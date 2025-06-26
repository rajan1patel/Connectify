import express from 'express';
import {checkAuth, loginUser, registerUser,updateProfile } from '../controllers/userController.js';
const userRouter = express.Router();
// Middleware to protect routes
import { authMiddleware } from '../middleware/auth.js';




// Route to register a new user
userRouter.post('/signup', registerUser);
// Route to login a user
userRouter.post('/login', loginUser);

// Route to update user profile
userRouter.put('/update-profile', authMiddleware, updateProfile);

userRouter.get('/check',authMiddleware,checkAuth)



export default userRouter;

