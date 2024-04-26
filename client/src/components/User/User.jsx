import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/UserAction";
import { getAllUser, getUser } from "../../api/UserRequests.js";

const User = ({ person }) => {
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch()
  
  const [profilePictures, setProfilePictures] = useState(null);

  // console.log("person", person);

  useEffect(() => {
    const getuserProfile = async () => {
      try {
        const data = await getUser(person._id);
        setProfilePictures(data.data.profilePicture);
        // console.log("data", data.data.profilePicture);
      } catch (error) {
        console.log(error);
      }
    };
    getuserProfile();
  },[person]);
  
  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );
  const handleFollow = () => {
    console.log("hereaaaaa", person._id, user);
    following
      ? dispatch(unfollowUser(person._id, user))
      : dispatch(followUser(person._id, user));
    setFollowing((prev) => !prev);
  };
  return (
    <div className="follower">
      <div>
        <img
          src={
            profilePictures
              ? profilePictures
              : publicFolder + "defaultProfile.png"
          }
          alt="profile"
          className="followerImage"
        />
        <div className="name">
          <span>{person.firstname}</span>
          <span>@{person.username}</span>
        </div>
      </div>
      <button
        className={
          following ? "button fc-button UnfollowButton" : "button fc-button"
        }
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
