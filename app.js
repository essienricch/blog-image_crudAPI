const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const sequelize = require("./util/db");
const user_router = require("./router/userRoutes");
const post_router = require("./router/postRoutes");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my blog api endpoints!" });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", user_router);
app.use("/post", post_router);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`:::::::::::: Server is running ::::::::::: `);
  })
  .catch((error) => {
    console.log(error);
  });



app.listen(process.env.PORT || 2000, () => console.log("Starting at 2000..."));

module.exports = app;
