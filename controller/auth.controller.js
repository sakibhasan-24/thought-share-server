import User from "../model/user.model.js";
import bycryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export const userSignUp = async (req, res) => {
  const data = req.body;
  console.log(data);
  if (!data) {
    return res.status(400).json({ message: "No data provided" });
  }
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }
  const { userName, email, password, profilePicture, isAdmin } = data;
  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }
  const hashedPassword = await bycryptjs.hash(password, 8);

  const profileImage =
    data.profilePicture || User.schema.paths.profilePicture.default();
  //   save db
  const newUser = new User({
    email,
    userName,
    password: hashedPassword,
    profilePicture: profileImage,
    isAdmin,
  });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // const validUser = await User.findOne({ email });
    const validUser = await User.findOne({ email }).select("-password");
    if (!validUser) {
      return res.status(400).json({ message: "No User Found!" });
    }
    // compare with password
    const matchPassword = await bycryptjs.compare(password, validUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // create a token
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res
      .status(200)
      .cookie("token", token, {
        httponly: true,
      })
      .json(validUser);
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};
