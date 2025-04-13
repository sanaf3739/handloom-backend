const { Router } = require("express");
const {
  handleLogin,
  handleSignup,
  handleLogout,
} = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/logout", authMiddleware, handleLogout);
router.get("/me", authMiddleware, (req,res) => {
  return res.status(200).json({user: req.user})
});

module.exports = router;
