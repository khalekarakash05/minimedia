import React, { useState, useRef, useEffect, } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import { getUser } from "../../api/UserRequests";
import { UploadImagePost } from "../../api/UploadRequest";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [profilePicture, setProfilePicture] = useState(null)
  const [video, setVideo] = useState(null)
  const [image, setImage] = useState(null);
  const desc = useRef();
  const imageInputRef = useRef(); // Define image input ref
  const videoInputRef = useRef(); // Define video input ref
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log("here", user._id);

  

  //show the profile picture of that particular user
  useEffect(() => {
    const getuserProfile = async () => {
      try {
        const data = await getUser(user._id);
        setProfilePicture(data.data.profilePicture);
      } catch (error) {
        console.log(error);
      }
    };
    getuserProfile();
  }, [user._id]);

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      console.log("image", img);
      setImage(img);
    }
  };

  //on video change
  const onVideoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let video = event.target.files[0];
      console.log("video", video);
      setVideo(video);
    }
  };

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    // post data
    let newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    try {
      await dispatch(uploadPost(newPost));
    } catch (error) {
      console.log(error);
    }

    // additional data
    const additionData = new FormData();
    // if there is an image with post
    if (image || video) {
      if(image){
        const fileName = Date.now() + image.name;
      console.log("image", image);
      additionData.append("image", image);
      newPost.image = fileName;
      }
      if(video){
        const fileName = Date.now() + video.name;
      console.log("video", video);
      additionData.append("video", video);
      newPost.video = fileName;
      }

      console.log("userka data", newPost, additionData);
      try {
        if(image || video){
          // await dispatch(uploadPost(newPost, additionData));
          await dispatch(UploadImagePost(user._id, additionData));
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    resetShare();
  };
  const resetShare = () => {
    setImage(null);
    setVideo(null); // Reset video state
    desc.current.value = "";
  };

  // Reset Post Share
  
  return (
    <div className="PostShare">
      <img
        src={
          profilePicture
            ? profilePicture
            : serverPublic + "defaultProfile.png"
        }
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <div className="postOptions">
          {/* <div >
            <input className="photoinput" type="file" name="image" placeholder="Photo" onChange={onImageChange} />
            <UilScenery />
            Photo
          </div>

          <div >
            <input className="videoinput" type="file" name="video" placeholder="video" onChange={onVideoChange}></input>
            <UilPlayCircle />
            Video
          </div> */}
          {/* <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            Shedule
          </div> */}
          <div className="option" style={{ color: "var(--shedule)" }}>
            <label htmlFor="imageInput" className="photo">
              <UilScenery />
              Photo
            </label>
            <input
              id="imageInput"
              className="photoinput"
              type="file"
              name="image"
              onChange={onImageChange}
              ref={imageInputRef}
            />
          </div>

          <div className="option" style={{ color: "var(--shedule)" }}>
            <label htmlFor="videoInput" className="photo">
              <UilPlayCircle />
              Video
            </label>
            <input
              id="videoInput"
              className="videoinput"
              type="file"
              name="video"
              onChange={onVideoChange}
              ref={videoInputRef}
            />
          </div>
          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "uploading" : "Share"}
          </button>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
















// import React, { useState, useRef, useEffect } from "react";
// import "./PostShare.css";
// import { UilScenery } from "@iconscout/react-unicons";
// import { UilPlayCircle } from "@iconscout/react-unicons";
// import { UilLocationPoint } from "@iconscout/react-unicons";
// import { UilSchedule } from "@iconscout/react-unicons";
// import { UilTimes } from "@iconscout/react-unicons";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadImage, uploadPost } from "../../actions/UploadAction";
// import { getUser } from "../../api/UserRequests";

// const PostShare = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.authReducer.authData);
//   const loading = useSelector((state) => state.postReducer.uploading);
//   const [profilePicture, setProfilePicture] = useState(null)
//   const [image, setImage] = useState(null);
//   const desc = useRef();
//   const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
//   console.log("here", user._id);

//   //show the profile picture of that particular user
//   useEffect(() => {
//     const getuserProfile = async () => {
//       try {
//         const data = await getUser(user._id);
//         setProfilePicture(data.data.profilePicture);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getuserProfile();
//   }, [user._id]);




//   // handle Image Change
//   const onImageChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       let img = event.target.files[0];
//       console.log("image", img);
//       setImage(img);
//     }
//   };

//   const imageRef = useRef();
//   // console.log("userid", user._id, "desc", desc.current.value);
//   // handle post upload
//   const handleUpload = async (e) => {
//     e.preventDefault();
    

//     //post data
//     let newPost = {
//       userId: user._id,
//       desc: desc.current.value,
//     };
    
//     // console.log("newpost", newPost);

//     //additional data
//     const additionData = new FormData();
//     // if there is an image with post
//     if (image) {
      
//       const fileName = Date.now() + image.name;
//       // console.log("fileName", fileName);
//       // data.append("name", fileName);
//       console.log("image", image);
//       additionData.append("image", image);
//       // console.log("data", data.image);
//       newPost.image = fileName;

      
//       console.log("userka data", newPost, additionData);
//       try {
//         if(image){
//           await dispatch(uploadPost(newPost, additionData));
//           // console.log("data", data);
//         }
//         // await dispatch(uploadPost(UserData));
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     dispatch(uploadPost(newPost));
//     resetShare();
//   };

//   // Reset Post Share
//   const resetShare = () => {
//     setImage(null);
//     desc.current.value = "";
//   };
//   return (
//     <div className="PostShare">
//       <img
//         src={
//           profilePicture
//             ? profilePicture
//             : serverPublic + "defaultProfile.png"
//         }
//         alt="Profile"
//       />
//       <div>
//         <input
//           type="text"
//           placeholder="What's happening?"
//           required
//           ref={desc}
//         />
//         <div className="postOptions">
//           <div
            
//           ><input type="file" name="image" placeholder="Photo" onChange={onImageChange}></input>
//             <UilScenery />
//             Photo
//           </div>

//           <div className="option" style={{ color: "var(--video)" }}>
//             <UilPlayCircle />
//             Video
//           </div>
//           <div className="option" style={{ color: "var(--location)" }}>
//             <UilLocationPoint />
//             Location
//           </div>
//           <div className="option" style={{ color: "var(--shedule)" }}>
//             <UilSchedule />
//             Shedule
//           </div>
//           <button
//             className="button ps-button"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             {loading ? "uploading" : "Share"}
//           </button>

//           <div style={{ display: "none" }}>
//             <input type="file" ref={imageRef} onChange={onImageChange} />
//           </div>
//         </div>

//         {image && (
//           <div className="previewImage">
//             <UilTimes onClick={() => setImage(null)} />
//             <img src={URL.createObjectURL(image)} alt="preview" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostShare;
