import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {

  const {password, username, firstname, lastname} = req.body
  // console.log("object");

  if (!password || !username || !firstname || !lastname ) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" });
  }

  //check if user already exists
  // console.log('username', username);
  const oldUser = await UserModel.findOne({ username });
  if (oldUser) {
    return res.status(400).json({ 
      success: false, 
      message: "User already exists" });
  }

  //hash password
  // console.log("password", password);
  const hashedPass = await bcrypt.hash(password, 10);

  //create new user

  try {
    // console.log("hashedPass", hashedPass);
    const user = await UserModel.create({
      username,
      password: hashedPass,
      firstname,
      lastname,
    });

    // console.log("user", user);
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "3h" }
    );

    // console.log("token", token);
    res.status(200).json({
      success: true,
      user,
      token,
      message: "User created successfully"
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message });
  }

};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ username: username });

    if(!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" });
    }

    const validity = await bcrypt.compare(password, user.password);

    if (!validity) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User logged in successfully"
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message });
  }

};
