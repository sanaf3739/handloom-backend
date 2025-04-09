const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate access and refresh token
const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({
      validatedBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("refresh and access token could not be created", error);
  }
};

// login function
const handleLogin = async (req, res) => {
  // get email and password from the user
  // validate if the user is registered or not
  // compare the password
  // password and refresh token
  // send cookie and res
  console.log("Received Body:", req.body); // ✅ Debugging line

  const { email, password } = req.body;
  console.log(email)
  try {
    if (!email) {
      return res.status(422).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(422).json({ error: "Password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ success: true, user: loggedInUser, message: "Loggedin successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// signup function
const handleSignup = async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const { email, fullName, password } = req.body;

  if (!email || !fullName || !password) {
    return res.status(422).json({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }

  const createdUser = await User.create({
    fullName,
    email,
    password,
  });

  if (!createdUser) {
    return res.status(500).json({ success: false, message: "Failed to create user" });
  }
  return res.status(201).json({ success: true, message: "User created successfully" });
};

// logout function
const handleLogout = (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ success: true, messsage: "logged out successfully" });
};

module.exports = {
  handleLogin,
  handleSignup,
  handleLogout,
};
