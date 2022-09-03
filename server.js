const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");

// DB接続
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DBと接続を開始します。");
  })
  .catch((err) => console.log(err));

// ミドルウェア(module化したAPI)
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);

// API
app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(4000, console.log("サーバーを開始します"));
