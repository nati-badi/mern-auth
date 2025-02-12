import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decodedToken.id) {
      req.body.userId = decodedToken.id;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default userAuth;
