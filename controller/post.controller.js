import Post from "../model/post.model.js";

export const createPost = async (req, res) => {
  // if not admin
  //   console.log(req.user);
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not admin", success: false });
  }
  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
  });
  console.log("new", newPost.userId);
  try {
    const savedPost = await newPost.save();
    // console.log(savedPost);
    res.status(201).json({ savedPost, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "something went wrong", success: false });
  }
};

export const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 2;
    const sort = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.category && {
        category: req.query.category,
      }),
      ...(req.query.title && {
        title: req.query.title,
      }),
      ...(req.query.userId && {
        userId: req.query.userId,
      }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sort })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    res.status(401).json({ message: "something went wrong", success: false });
  }
};

export const deletePost = async (req, res) => {
  //   console.log(req.params.userId, req.user.id);
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return res
      .status(401)
      .json({ message: "you can delete only your post", success: false });
  }
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    res
      .status(200)
      .json({ message: "post deleted successfully", success: true, post });
  } catch (error) {
    res.status(401).json({ message: "something went wrong", success: false });
  }
};
