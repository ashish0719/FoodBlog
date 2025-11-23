const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // ✅ This line is required to parse form-data text fields

const PORT = process.env.PORT || 3000;

// User routes (includes profile routes) - register BEFORE static files to avoid conflicts
app.use("/", require("./routes/user"));

app.use(express.static("public"));

// Recipe routes
app.use("/recipe", require("./routes/recipe"));

// Blog routes
app.use("/blog", require("./routes/blog"));

// User follow/unfollow routes
app.use("/user", require("./routes/follow"));

// Message routes
app.use("/message", require("./routes/message"));

connectDb();

app.listen(PORT, (err) => {
  console.log(`Application running at ${PORT}`);
});
app.use("/profilepics", express.static("public/profilepics"));
