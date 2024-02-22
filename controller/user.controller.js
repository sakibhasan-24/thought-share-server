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
  if (req.params.id !== req.user.id) {
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
