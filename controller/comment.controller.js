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

    res.status(201).json({
      message: "Comment created successfully",
      success: true,
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", success: false });
  }
};

export const getComments = async (req, res) => {
  try {
    // console.log(req.params.id);
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    // console.log(comments);
    return res.status(200).json({
      success: true,
      message: "comments send successfully",
      comments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong", success: false });
  }
};
