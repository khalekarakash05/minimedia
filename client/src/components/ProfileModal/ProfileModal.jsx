import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/UploadAction";
import { updateUser } from "../../actions/UserAction";
import toast from "react-hot-toast";

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();

  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log("img", event.target.files[0]);
      let img = event.target.files[0];
      console.log("event", event.target.name);
      event.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  // console.log("paramsid", param.id);
  // console.log("profile", profileImage);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    let UserData = formData;
    console.log("UserData", UserData);
    const data = new FormData(); // Create a FormData object
  
    if (profileImage) {
      const fileName = profileImage.name;
      data.append("profileImage", profileImage); // Append the profile image to FormData
      UserData.profilePicture = fileName; // Update UserData with the new profile picture filename
      console.log("profile", profileImage);
    }
  
    if (coverImage) {
      const fileName = Date.now() + coverImage.name;
      data.append("coverImage", coverImage); // Append the cover image to FormData
      UserData.coverPicture = fileName; // Update UserData with the new cover picture filename
    }
    // console.log("userData", UserData);
    console.log("Userkadata", UserData);
    console.log("data", data);
  
    try {
      if (profileImage || coverImage) {
        // Only dispatch the uploadImage action if profileImage or coverImage exists
        await dispatch(uploadImage(param.id, data)); // Dispatch the action with FormData and param.id
        // console.log("data", data);
      }
      await dispatch(updateUser(param.id, UserData)); // Dispatch the updateUser action with UserData
      // console.log("Data", Data);

      toast.success("User Profile updated successfully"); // Success message for user update
      setModalOpened(false);
    } catch (err) {
      console.log(err);
    }
  };
  


  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Your Info</h3>
        <div>
          <input
            value={formData.firstname}
            onChange={handleChange}
            type="text"
            placeholder="First Name"
            name="firstname"
            className="infoInput"
          />
          <input
            value={formData.lastname}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
            name="lastname"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.worksAt}
            onChange={handleChange}
            type="text"
            placeholder="Works at"
            name="worksAt"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.livesIn}
            onChange={handleChange}
            type="text"
            placeholder="Lives in"
            name="livesIn"
            className="infoInput"
          />
          <input
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
            name="country"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.relationship}
            onChange={handleChange}
            type="text"
            className="infoInput"
            placeholder="Relationship status"
            name="relationship"
          />
        </div>

        <div>
          Profile image
          <input type="file" name="profileImage" onChange={onImageChange} />
          Cover image
          <input type="file" name="coverImage" onChange={onImageChange} />
        </div>

        <button className="button infoButton" type="submit">
          Update
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
