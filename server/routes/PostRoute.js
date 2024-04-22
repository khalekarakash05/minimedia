import express from 'express'
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from '../controllers/PostController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
import { upload } from '../middleware/multer.js'
const router = express.Router()

router.post('/', 
upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1}
]) ,
createPost)

router.get('/:id', getPost)

router.put('/:id',

upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1}
]) ,
 updatePost)


router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimelinePosts)

export default router