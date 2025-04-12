require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const userRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const categoryRoutes = require("./routes/category.route.js");
const sizeRoutes = require("./routes/size.route.js");
const cartRoutes = require("./routes/cart.route.js");
const orderRoutes = require("./routes/order.route.js");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Set up EJS for server-side rendering
// app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ibrahimrug.com",
      "https://www.ibrahimrug.com",
      "https://handloom-frontend.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// DB Connection and run the app
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
