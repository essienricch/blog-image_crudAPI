const User = require("../model/blogUser");
const { body, validationResult } = require("express-validator");

//validate user details:
const validate = [
  body("username", "username cannot be empty").exists(),
  body("email").exists().isEmail(),
  body("password", "Password must be greater than 4 characters")
    .exists()
    .isLength({ min: 4 }),

  (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

//Add a new user:
const addNewUser = (req, res) => {
  const { username, email, password } = req.body;
  const userData = { username, email, password };
  return User.create(userData).then((user) =>
    console
      .log(user.toJson())
      .then((user) =>
        res.status(201).send(`User successfully Created ${user.toJson()}`)
      )
      .catch((err) => {
        res.status(500).send(err.message);
      })
  );
};

//Get all blog users:
const getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      users.forEach((element) => {
        console.log(element.toJson());
        return res.send(users).status(200);
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};

//Get a blog user by id:
const getUserById = (req, res) => {
  const id = req.params.id;
  console.log("user id: " + id);

  User.findByPk(id)
    .then((user) => {
      console.log(user.toJson());
      return res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

//delete a blog user by id:
const deleteUser = (req, res) => {
  const userId = req.params.id;
  User.destroy({ where: { id: userId } })
    .then((user) => {
      console.log("user deleted", user);
      return res.status(200).send("user successfully deleted");
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

//update user by id:
const updateUser = (req, res) => {
  let id = req.params.id;
  const { username, email, password } = req.body;
  const userdata = { username, email, password };

  User.findByPk(id)
    .then((user) => {
      return user.save(userdata);
    })
    .then((result) => {
      // User.update(userdata, {
      //   where: {
      //     id: id,
      //   },
      // }).then(() => {
      res.status(200).json("User successfully updated", result.toJson());
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
};

module.exports.getAllUsers = getAllUsers;
module.exports.addUsers = addNewUser;
module.exports.getUserById = getUserById;
module.exports.validateUser = validate;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
