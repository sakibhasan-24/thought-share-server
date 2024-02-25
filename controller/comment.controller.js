import Comment from "../model/comment.model.js";

export const createComment = async (req, res) => {
  try {
    const { userName, userId, postId, comment } = req.body;
    if (req.user.id !== userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const newComment = await Comment.create({
      userId,
      postId,
      comment,
      userName,
    });
    res
      .status(201)
      .json({
        message: "Comment created successfully",
        success: true,
        data: newComment,
      });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", success: false });
  }
};
