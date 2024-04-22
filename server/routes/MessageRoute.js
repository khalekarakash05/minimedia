import express from 'express';
import { addMessage, getMessages } from '../controllers/MessageController.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post('/',
 upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1}
]) ,
addMessage);

router.get('/:chatId', getMessages);

export default router