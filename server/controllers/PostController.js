import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../configs/cloudinary.js";

// creating a post

export const createPost = async (req, res) => {

  
  const {desc, userId} = req.body;
  console.log("userinfo", desc, userId);
  // console.log("files", req.body, req.files);
  // const image = req.files?.image[0]?.path;
  // console.log("image", image);
  // const video = req.files?.video[0]?.path;
  // let imageData, videoData;
  // console.log('imagebefore', image);
  // if(image){
  //   //upload it on cloudinary
  //   console.log("imageafter", image);
  //   imageData = await uploadOnCloudinary(image, "Akash")
  //   console.log("imageData", imageData.secure_url);
  // }

  // if(video){
  //   //upload it on cloudinary
  //    videoData = video? await uploadOnCloudinary(video, "Akash"): null
  //     console.log("videoData", videoData.secure_url);
  // }
  
  if(!desc || !userId){ 
    return res.status(400).json("Post and userId are required");
  }
  console.log("before try");
  try {
    console.log("heare");
    const newPost = await PostModel.create({
      desc, 
      userId,
      // image: imageData.secure_url || "",
      // video: videoData.secure_url || "",
    });
    console.log("newPost", newPost);
    res.status(200).json({
      success: true,
      newPost,
      message: "Post created",
    })
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json({
      success: true,
      post,
      message: "Post found",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;

  const { userId, desc } = req.body;
  console.log("userId", userId);
  console.log("desc", desc);

  // const image = req.files?.image[0]?.path;

  // const video = req.files?.video[0]?.path;
  // console.log("image", image);

  // let imageData, videoData;

  // if(image){
  //   //upload it on cloudinary
  //   imageData =  await uploadOnCloudinary(image, "Akash")
  //   console.log("imageData", imageData.secure_url);
  // }

  // if(video){
  //   //upload it on cloudinary
  //     videoData =  await uploadOnCloudinary(video, "Akash")
  //     console.log("videoData", videoData.secure_url);
  // }



  if(!userId || !postId){
    return res.status(400).json("all fields is required");
  }

  try {
    // console.log("postId", postId);
    const post = await PostModel.findById(postId);
    // console.log("post", post.userId);

    if (post.userId.toString() === userId.toString()) {

     const data = await PostModel.findByIdAndUpdate(postId, {
        $set: {
          desc: desc,
          // image: imageData.secure_url || post.image,
          // video: videoData.secure_url || post.video,
        }
      }, {new: true});
      console.log("data", data);

      res.status(200).json({
        success: true,
        data,
        message: "Post updated",
      });
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {}
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await PostModel.findByIdAndDelete(id);
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await PostModel.findByIdAndUpdate(id, { $pull: { likes: userId } }, {new: true});
      res.status(200).json("Post disliked");
    } else {
      await PostModel.findByIdAndUpdate(id,{ $push: { likes: userId } }, {new: true});
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    // console.log("followingPosts", followingPosts[0].followingPosts);

    
    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
