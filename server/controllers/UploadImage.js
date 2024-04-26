import User from '../models/userModel.js';
import { uploadOnCloudinary } from '../configs/cloudinary.js'; // Import the function to upload to Cloudinary

const UploadImage = async (req, res) => {
    try {
        console.log("Entering UploadImage function");

        const userId = req.params.id;

        let profileImageUrl, coverImageUrl;

        // Upload profile image to Cloudinary if provided
        if (req.files?.profileImage) {
            const profileImagePath = req.files.profileImage[0]?.path;
            const profileImageFile = await uploadOnCloudinary(profileImagePath, "Profile_Images");
            profileImageUrl = profileImageFile.secure_url;
        }

        // Upload cover image to Cloudinary if provided
        if (req.files?.coverImage) {
            const coverImagePath = req.files.coverImage[0]?.path;
            const coverImageFile = await uploadOnCloudinary(coverImagePath, "Cover_Images");
            coverImageUrl = coverImageFile.secure_url;
        }

        // Create an update object to hold only the non-null image URLs
        const updateData = {};
        if (profileImageUrl) {
            updateData.profilePicture = profileImageUrl;
        }
        console.log("profileimageurl", profileImageUrl);
        if (coverImageUrl) {
            updateData.coverPicture = coverImageUrl;
        }
        console.log("coverpicture", coverImageUrl);
        // Update the user with the non-null values
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            {
                $set: updateData,
            },
            { new: true }
        );
        // console.log("updatedprofile", updatedProfile);
        return res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            updatedProfile,
        });

    } catch (error) {
        console.error("Error in UploadImage:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default UploadImage;
