import UserModel from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import PostModel from "../models/postModel.js";


// Get a User
export const getUser = async (req, res) => {
  console.log("req.body", req.params.id);
  const id = req.params.id;

  try {
    console.log("id", id);
    const user = await UserModel.findById(id);
    // console.log("user", user)
  // const user = await UserModel.findById({_id: id});
    // console.log("user", user);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      // console.log("Other Details", otherDetails);

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// udpate a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password, country, firstname, lastname,
    livesIn, relationship, worksAt } = req.body;
  
  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        
        const hashedPassword = await bcrypt.hash(password, 10);
      }
      if(country || livesIn ||relationship || worksAt || firstname || lastname){

        // have to change this
      const user = await UserModel.findByIdAndUpdate(id, {
        $set: {
          livesIn,
          country,
          relationship,
          worksAt
        }
        },{
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "3h" }
      );
      // console.log({user, token})
      res.status(200).json({user, token});
      }
      else{
        console.log("error", error.message);
        res.status(400).json({
          success: false,
          message: "Error"
        })
      }
    } catch (error) {
      console.log("Error agya hy")
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};



// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log("id", id);

  const currentUserId  = req.body;
  console.log("currentUserid", currentUserId);
  const _id = currentUserId._id;
  console.log("id", _id);

  if (_id === id ) {
    try {
      console.log("in the try block");
      await UserModel.findByIdAndDelete(id);
      console.log("usermodeleted");
      await PostModel.deleteMany({userId :id});
      console.log("deleted from post collection");
      await UserModel.updateMany(
        {followers: id},
        {$pull: {
          followers: id
        }}
      )
      console.log("deleted from followers");
      await UserModel.updateMany(
        {following : id},
        {$pull: {
          following: id
        }}
      )
      console.log("deleted from following");
      await PostModel.deleteMany(
        {likes: id},
        {
          $pull: {
            likes:id
          }
        }
      )
      console.log("deleted from likes");
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  console.log("id, _id",id, _id)

  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        // await followUser.updateOne({ $push: { followers: _id } });
        // await followingUser.updateOne({ $push: { following: id } });
        await UserModel.findByIdAndUpdate(id, 
          { $push: { followers: _id }, },
        { new: true });

        await UserModel.findByIdAndUpdate(_id, 
          { $push: { following: id }, },
        { new: true });

        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        // await unFollowUser.updateOne({$pull : {followers: _id}})
        // await unFollowingUser.updateOne({$pull : {following: id}})

        await UserModel.findByIdAndUpdate(id, 
          { $pull: { followers: _id }, },
        { new: true });

        await UserModel.findByIdAndUpdate(_id, 
          { $pull: { following: id }, },
        { new: true });
        
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};
