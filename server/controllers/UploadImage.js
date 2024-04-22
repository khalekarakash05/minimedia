//upload the profile image and cover image to cloudinary using multer and cloudinary
import User from '../models/userModel.js';
import { uploadOnCloudinary } from '../configs/cloudinary.js'; // Import the function to upload to Cloudinary


const UploadImage = async(req, res) => {

    try {
        console.log("heare");

        // const {_id} = req.user.id;
        // console.log("id", _id);
        const _id = req.params;

        const profileImage = req.files?.profileImage[0]?.path;
        const coverImage = req.files?.coverImage[0]?.path;

        let profileImageFile, coverImageFile;
        console.log("profileImage", profileImage);
        console.log("coverImage", coverImage);
        let profileImageUrl, coverImageUrl;

        if(profileImage){
            profileImageFile = await uploadOnCloudinary(profileImage, "Akash");
            console.log("before");
            profileImageUrl = profileImageFile.secure_url;
            console.log("after");
            console.log("profileImageUrl", profileImageUrl);
        }

        if(coverImage){
            coverImageFile = await uploadOnCloudinary(coverImage, "Akash");
            coverImageUrl = coverImageFile.secure_url;
            console.log("coverImageUrl", coverImageUrl);
        }

        // console.log("userid", req.user);
        console.log("id", _id.id);
        const id = JSON.stringify(_id);
        console.log("id", id);

        console.log("profileImage", profileImageUrl);
        console.log("coverImage", coverImageUrl);
        
        const profileData = await User.findByIdAndUpdate(_id.id, {
            
                profilePicture: profileImageUrl || "",
                coverPicture: coverImageUrl || "",
            
        }, {new: true});
        console.log("profileData", profileData);

        return res.status(200).json({ 
            message: 'File uploaded successfully', 
            profileData});

    } catch (error) {
        console.log("error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error", 
        })
    }

}

export default UploadImage;









