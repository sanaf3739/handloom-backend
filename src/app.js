const { CORS_ORIGIN } = require("./constants.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Set up EJS for server-side rendering
// app.set("view engine", "ejs");

// Middlewares
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

// ROUTE IMPORTS
const userRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const categoryRoutes = require("./routes/category.route.js");
const sizeRoutes = require("./routes/size.route.js");
const cartRoutes = require("./routes/cart.route.js");
const orderRoutes = require("./routes/order.route.js");

// Routes
app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = { app };
