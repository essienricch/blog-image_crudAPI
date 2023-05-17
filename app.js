const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv");

env.config();

const user_router = require("./router/userRoutes");
const post_router = require("./router/postRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", user_router);
app.use("/post", post_router);


mongoose
  .connect(process.env.db_token, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connecting to blog db"))
  .catch((err) => console.log(err));


app.listen(2000, () => console.log("Starting at 2000..."));
