const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    console.log(token)
    if (!token) return res.status(401).json({success: false, error: "unauthorized"});
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      console.log(user)
      return next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({success: false, error: "token is expired or invalid"});
      // err
    }
  } catch (error) {
    console.log(error);
    return next();
  }
};

module.exports = authMiddleware;
