require("dotenv").config();
const connectDB = require("./db");
const { app } = require("./app.js");

const PORT = process.env.PORT || 8000;
// DB Connection and run the app
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server running on port:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
