const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };
