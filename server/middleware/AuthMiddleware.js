
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWTKEY;
const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // If the Authorization header is missing or improperly formatted, return a 401 Unauthorized response
      return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    console.log("token",token);

    // Verify the token
    const decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);

    // Attach the decoded user ID to the request body
    req.body._id = decoded?.id;
    next();
  } catch (error) {
    console.log(error);
    // If there's an error decoding or verifying the token, return a 401 Unauthorized response
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleWare;
