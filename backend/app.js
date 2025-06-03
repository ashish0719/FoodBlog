const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use("/", require("./routes/user"));

app.use("/recipe", require("./routes/recipe"));

connectDb();

app.listen(PORT, (err) => {
  console.log(`Application running at ${PORT}`);
});
