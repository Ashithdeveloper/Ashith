import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ error: "Not authorized, token is required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({ error: "Not authorized, token is invalid" });
    }

    const user = await User.findOne({_id : decoded.userId}).select("-password")

    if(!user){
        return res.status(401).json({ error: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Failed to protect route:${error.message}`)
    res.status(500).json({ error: "Server Error" });
  }
}
export default protectRoute;