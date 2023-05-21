const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv");
const sequelize = require("./util/db");

env.config();

const user_router = require("./router/userRoutes");
const post_router = require("./router/postRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", user_router);
app.use("/post", post_router);

// sequelize.sync( )
// .then((result) =>
//   {console.log(result)})
//   .catch((error) => {console.log(error)});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
  });

app.listen(2000, () => console.log("Starting at 2000..."));
