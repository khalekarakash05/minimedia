import React, { useEffect } from "react";
import { getTimelinePosts } from "../../actions/PostsAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";
import { getAllUser, getUser } from "../../api/UserRequests";

const Posts = () => {
  const params = useParams()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);


  // const id = posts[0].userId;
  // console.log("posts", posts);
  // console.log("user", user);
  useEffect(async() => {
    await dispatch(getTimelinePosts(user._id));
  }, []);

  

  if(!posts) return 'No Posts';
  if(params.id) posts = posts.filter((post)=> post.userId===params.id)

  console.log("posts", posts);
  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : posts.map((post, id) => {
            return <Post posts={post}  key={id} />;
          })}
    </div>
  );
};

export default Posts;
