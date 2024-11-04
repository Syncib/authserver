require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log(error.message);
  });
module.exports = app;
