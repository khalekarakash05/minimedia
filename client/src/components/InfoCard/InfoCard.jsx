import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as UserApi from "../../api/UserRequests.js";
import { logout } from "../../actions/AuthActions";
import { deleteUser } from "../../actions/UserAction.js";
import toast from "react-hot-toast";

const InfoCard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const params = useParams();
  const [modalOpened, setModalOpened] = useState(false);
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState({});
  const { user } = useSelector((state) => state.authReducer.authData);


  const handleLogOut = ()=> {
    dispatch(logout()).then(()=>{
      toast.success("Logged out successfully");
    }
    ).catch((error)=>{  
      toast.error("An error occurred while logging out");
    }
    );

  }

  console.log("userid",user._id);
  console.log("profileUserId", profileUserId);

  const handleDelete = async () => {
    if (profileUserId === user._id) {
      try {
        // Attempt to delete the user
        await UserApi.deleteUser(profileUserId);
        toast.success("User deleted successfully");
  
        // Clear local storage after successful deletion
        localStorage.clear();
  
        // Dispatch logout action to update Redux state
        dispatch(logout());
  
        // Redirect to login page after deletion
        navigate("/auth");
      } catch (error) {
        console.error("Error deleting user:", error);
  
        if (error.response && error.response.status === 401) {
          toast.error("You are not authorized to delete this user.");
        } else {
          toast.error("An error occurred while deleting the user.");
        }
      }
    }
  };
  
  
  

  


  useEffect(() => {
    const fetchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
      } else {
        console.log("fetching")
        const profileUser = await UserApi.getUser(profileUserId);
        setProfileUser(profileUser);
        console.log(profileUser)
      }
    };
    fetchProfileUser();
  }, [user]);

  

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Profile Info</h4>
        {user._id === profileUserId ? (
          <div>
            <UilPen
              width="2rem"
              height="1.2rem"
              onClick={() => setModalOpened(true)}
            />
            <ProfileModal
              modalOpened={modalOpened}
              setModalOpened={setModalOpened}
              data = {user}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="info">
        {/* */}
        <span>
          <b>Status </b>
        </span>
        <span>{profileUser.relationship}</span>
      </div>
      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{profileUser.livesIn}</span>
      </div>
      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>{profileUser.worksAt}</span>
      </div>
      <div className="btn">
      <button className="button delete-button" onClick={handleDelete}>Delete</button>

      <button className="button logout-button" onClick={handleLogOut}>Log Out</button>
      </div>
    </div>
  );
};

export default InfoCard;
