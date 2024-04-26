import React, { useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests";
import { useEffect } from "react";

const Post = ({ posts }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  
  const [liked, setLiked] = useState(posts && posts.likes ? posts.likes.includes(user._id) : false);
  const [likes, setLikes] = useState(posts && posts.likes ? posts.likes.length : 0);

  const [postUser, setPostUser] = useState(null);

  console.log("user", user._id);
  // console.log("post", posts.userId);
  // console.log("posts", posts);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser(posts.userId);
        setPostUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [posts.userId]);


  const handleLike = () => {
    likePost(posts._id, user._id);
    setLiked((prev) => !prev);
    liked? setLikes((prev)=>prev-1): setLikes((prev)=>prev+1)
  };
  return (
    <div className="Post">
      <div className="username">
      <span>{postUser && postUser.username}</span>
      </div>

      
        {posts.image? <img
        src={posts.image ? posts.image  : ""}
        alt=""
      />: ""}
      {posts.video? <video
        src={posts.video ? posts.video : ""}
        alt=""
        controls

      ></video>: ""}

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="" />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail" >
      
      <span>{posts.desc}</span>
      </div>
    </div>
  );
};

export default Post;
