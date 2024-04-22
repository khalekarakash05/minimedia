// import express from 'express';
// import {upload} from '../middleware/multer.js';
// // import  upload  from '../middleware/multer'; // Import the upload object from your Multer configuration
// import { uploadOnCloudinary } from '../configs/cloudinary.js'; // Import the function to upload to Cloudinary

// const router = express.Router();

// router.post("/", upload.single('Image'), async (req, res) => {
//   try {
//     console.log("req.file", req.files?.image[0]?.path);

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     console.log("req.file", req.file);
//     const files = req.files?.image[0]?.path;;
//     const localFilePath = req.files?.image[0]?.path;; // Get the local file path
//     const cloudinaryResponse = await uploadOnCloudinary(localFilePath); // Upload the file to Cloudinary
    
//     if (!cloudinaryResponse) {
//       return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
//     }

//     return res.status(200).json({ message: 'File uploaded successfully', cloudinaryResponse });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// export default router;


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