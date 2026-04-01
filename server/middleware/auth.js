import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    console.log("Token received in middleware:", token ? "Yes" : "No");
    if (!token) {
      return res.status(403).json({ msg: "Access Denied: No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trimStart();
    } else {
      console.log("Invalid token format");
      return res.status(400).json({ msg: "Invalid token format" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified. User role:", verified.role);
    req.user = verified;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({ msg: "Invalid or expired token", error: error.message });
  }
};
