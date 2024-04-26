import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import Cover from "../../img/cover.jpg";
import Profile from "../../img/profileImg.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests.js";

const ProfileCard = ({location}) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state)=>state.postReducer.posts)
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const [profilePictures, setProfilePictures] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [followings, setFollowings] =  useState(null);
  const [followerss, setFollowers] =  useState(null);
  console.log("userki id", user._id);

  
  //fetch user using that id
  useEffect(() => {
    const getuserProfile = async () => {
      try {
        const data = await getUser(user._id);
        setProfilePictures(data.data.profilePicture);
        setCoverPicture(data.data.coverPicture);
      } catch (error) {
        console.log(error);
      }
    };
    getuserProfile();
  }, [user._id]);

  // let followingLength;
  useEffect(() => {
    const fetchProfileData = async() => {
      try {
        const profiledata = await getUser(user._id);
        console.log("profiledata", profiledata);
        setFollowings(profiledata.data.following.length);
        console.log("followings", followings);
        setFollowers(profiledata.data.followers.length);
        // console.log("followerslength", followingLength);
      } catch (error) {
        console.log(error);
      }
    } 
    fetchProfileData();
  },[user._id])
  
  console.log("user", user);


  

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={
            coverPicture
              ? coverPicture
              : serverPublic + "defaultCover.jpg"
          } alt="CoverImage" />
        <img
          src={
            profilePictures
              ?  profilePictures
              : serverPublic + "defaultProfile.png"
          }
          alt="ProfileImage"
        />
      </div>
      <div className="ProfileName">
        <span>{user.firstname} {user.lastname}</span>
        <span>{user.worksAt? user.worksAt : 'Write about yourself'}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{followerss}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{followings}</span>
            <span>Following</span>
          </div>
          {/* for profilepage */}
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{
                posts.filter((post)=>post.userId === user._id).length
                }</span>
                <span>Posts</span>
              </div>{" "}
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
