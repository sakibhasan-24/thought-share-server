import Post from "../model/post.model.js";

export const createPost = async (req, res) => {
  // if not admin
  if (!req.user.isAdmin) {
    return res.status(401).json({ message: "You are not admin" });
  }
  const newPost = new Post({
    ...req.body,
    userId: req.user._id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    return res.status(401).json({ message: "something went wrong" });
  }
};
