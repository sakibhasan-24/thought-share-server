import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
export const updateUser = async (req, res) => {
  console.log(req.user.id, req.params.id);
  if (req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can update only your account!" });
  }
  // if (req.body.password)
  //   req.body.password = bcryptjs.hash(req.body.password, 8);
  if (req.body.password) {
    const hashedPassword = await bcryptjs.hash(req.body.password, 8);
    req.body.password = hashedPassword;
  }
  if (req.body?.userName?.length < 3 || req?.body?.userName?.length > 20) {
    return res
      .status(403)
      .json({ message: "Username must be between 3 and 20 characters" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.user.isAdmin && req.params.id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You can delete only your account!" });
  }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const userLogOut = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({ message: "Logged Out" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not allowed to perform this action" });
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sort })
      .skip(startIndex)
      .limit(limit);
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
