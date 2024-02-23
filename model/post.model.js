import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    blogImage: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("POST", postSchema);
export default Post;
