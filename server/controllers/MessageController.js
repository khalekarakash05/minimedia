import MessageModel from "../models/messageModel.js";
import { uploadOnCloudinary } from "../configs/cloudinary.js";

export const addMessage = async (req, res) => {

  const { chatId, senderId, text } = req.body;

  console.log("here ");
  const image = req.files?.image[0]?.path;
  const video = req.files?.video[0]?.path;

  console.log("object", image, video);
  let imageFile, videoFile;

  if(image){
    imageFile = await uploadOnCloudinary(image, "Akash");
    const imageUrl = imageFile.secure_url;
    console.log("imageUrl", imageUrl);

  }
  if(video){
    videoFile = await uploadOnCloudinary(video, "Akash");
    const videoUrl = videoFile.secure_url;
    console.log("videoUrl", videoUrl);
  }


  const message = new MessageModel({
    chatId,
    senderId,
    text,
    // image: imageFile?.secure_url || "",
    // video: videoFile?.secure_url || "",
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
