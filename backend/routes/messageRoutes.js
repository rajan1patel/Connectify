import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getMessages, getUserForSidebar, markMessagesAsSeen, sendMessage } from '../controllers/messagecontroller.js';

 const messageRouter = express.Router();



 messageRouter.get('/users', authMiddleware, getUserForSidebar); // Get users for sidebar


 messageRouter.get('/:id', authMiddleware, getMessages); // Get messages for selected user


 messageRouter.get('/mark/:id',authMiddleware,markMessagesAsSeen)

 messageRouter.post('/send/:id',authMiddleware,sendMessage)


 export default messageRouter;
