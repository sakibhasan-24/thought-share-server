import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  // console.log("res", token);
  if (!token) {
    return res.status(501).json({ message: "token is not valid" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log("ct", user);
    req.user = user;
    // console.log(req.user);
    next();
  });
};
