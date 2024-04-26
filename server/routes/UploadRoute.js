
import express from 'express';
import { upload } from '../middleware/multer.js';
import UploadImage from "../controllers/UploadImage.js";
import UploadImagePost from '../controllers/uploadFilesController.js';
import authMiddleWare from '../middleware/AuthMiddleware.js';
 
const router = express.Router();

router.put('/:id',
 upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1}
]) ,
UploadImage);


router.put('/post/:id',
 upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1}
]) ,
UploadImagePost);

export default router