import PostModel from "../models/postModel.js";
import { uploadOnCloudinary } from "../configs/cloudinary.js";

const UploadImagePost = async(req, res) => {
    try {
        const userId = req.params.id;
        console.log("userId", userId);

        // Find all the posts of the user and sort them by createdAt in descending order to get the latest post
        const userPosts = await PostModel.find({ userId }).sort({ createdAt: -1 });
        console.log("userPosts", userPosts);

        // Get the ID of the latest post
        const latestPostId = userPosts[0]._id;
        console.log("latestPostId", latestPostId);

        // Upload profile image and cover image to Cloudinary
        let image;
        if(req.files?.image){
             image = req.files?.image[0]?.path;
            console.log("image", image);
        }
        let video;
        if(req.files?.video){
             video = req.files?.video[0]?.path;
            console.log("vidoe", video);
        }

        let imageUrl, videoUrl;

        if (image) {
            const imageFile = await uploadOnCloudinary(image, "Akash");
            imageUrl = imageFile.secure_url;
            console.log("profileImageUrl", imageUrl);
        }

        if (video) {
            const videoFile = await uploadOnCloudinary(video, "Akash");
            videoUrl = videoFile.secure_url;
            console.log("videoUrl", videoUrl);
        }

        

        // Update the latest post with profile image and cover image
        const updatedPost = await PostModel.findByIdAndUpdate(latestPostId, {
            $set: {
                image: imageUrl || "",
                video: videoUrl || ""
            }
        }, { new: true });
        console.log("updatedPost", updatedPost);

        return res.status(200).json({ 
            success: true,
            updatedPost,
            message: 'File uploaded successfully', 
            
        });
    } catch (error) {
        console.log("error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error", 
        });
    }
}

export default UploadImagePost;



