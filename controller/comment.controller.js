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

export const likeAction = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "comment not found", success: false });
    }
    // comment exist
    // if not liked then add like,if liked then remove
    const isLiked = comment.likes.indexOf(req.user.id);
    // console.log(req.user.id);
    console.log(comment.likes);
    if (isLiked === -1) {
      //   console.log(comment.likes);
      comment.likes.push(req.user.id);

      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(isLiked, 1);
      comment.numberOfLikes -= 1;
    }
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "like action done successfully",
      comment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong", success: false });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    console.log(comment);
    if (!comment) {
      return res
        .status(401)
        .json({ message: "comment is not found", success: false });
    }
    if (comment?.userId !== req.user.id) {
      return res.status(401).json({
        message: "you can only edit your comment",
        success: false,
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: {
          comment: req.body.comment,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "successfully update",
      success: true,
      updatedComment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", success: false });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "comment is not found", success: false });
    }
    if (req.user.id !== comment.userId && !req.user.isAdmin) {
      //   console.log(req.params.commentId, comment.userId);
      return res
        .status(401)
        .json({ message: "you can only delete your comment", success: false });
    }
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    return res.status(200).json({
      success: true,
      message: "delete successfully",
      deletedComment,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "something went wrong", success: false });
  }
};
