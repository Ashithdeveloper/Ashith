import User from "../Models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Article from "../Models/article.model.js";


export const createArticle = async (req, res) => {
  try {
    const { text, title, category } = req.body;
    let img = req.file ? req.file.buffer.toString("base64") : null;

    if (text && title && category) {
      
      if (img) {
        const mimeType = req.file.mimetype;
        const uploadedResponse = await cloudinary.uploader.upload(
          `data:${mimeType};base64,${img}`
        );
        img = uploadedResponse.secure_url; 
      }

      const newArticle = new Article({
        user: req.user._id,
        text,
        img,
        title,
        category,
      });

      await newArticle.save();

      const populatedArticle = await Article.findById(newArticle._id).populate(
        "user",
        "username fullName profileImg"
      );

      res.status(200).json(populatedArticle);
    } else {
      return res
        .status(400)
        .json({ error: "article must have text, title, and category" });
    }
  } catch (error) {
    console.log(`Error creating post: ${error}`);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getAllArticles = async (req, res) => {
  try {
    const article = await Article.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: [
          "-password",
          "-email",
          "-following",
          "-followers",
          "-bio",
          "-link",
        ],
      });

    // If no posts, return an empty array
    if (article.length === 0) {
      return res.status(200).json([]);
    }

    // Return all fetched posts
    res.status(200).json(article);
  } catch (error) {
    console.log(` Error in getAllPosts controller: ${error}`);
    res.status(500).json({ error: "Server Error" });
  }
};
export const getFollowingArticles = async ( req, res) => {
    try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedArticle = await Article.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
    res.status(200).json(feedArticle);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteArticles = async (req, res) => {
    try {
        const {id} = req.params;
        const article = await Article.findById(id);
        if(!article){
            return res.status(404).json({ error: "Post not found" });
        }
        if(article.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "Unauthorized to delete this post" });
        }
        if(article.img){
            const imgId = article.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Article.findByIdAndDelete(id);
       
        res.status(200).json({ message: "Post deleted successfully",id });
    } catch (error) {
        console.log(`Error deleting post ${error}`)
        res.status(500).json({ error: "Server Error" });
    }
}
export const getOne = async (req,res)=>{
  try {
     const {id} = req.params
     const article = await Article.findById(id).populate(
        "user",
        "username fullName profileImg"
     )
     if (!article) {
       return res.status(404).json({ message: "Article not found" });
     }

     res.json(article);
  } catch (error) {
   console.log(`Error ${error}`);
   res.status(500).json({ error: "Server Error" });
  }
}
export const getUserArticle = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const article = await Article.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
      res.status(200).json(article);
    } catch (error) {
      console.log("Error in getUserArticle controller: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
}
export const searchArticle = async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("user", "_id username profileImg"); // this will give you user info

    res.status(200).json(articles);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error on search" });
  }
};
