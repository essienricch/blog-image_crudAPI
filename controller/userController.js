// const e = require("express");
const User = require("../model/blogUser");
const { body, validationResult } = require("express-validator");

//Add a new user:
const validate = [
  body("username", "username doesn't exists").exists(),
  body("email").exists().isEmail(),
  body("password", "Password must be greater than 8 characters")
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

const addNewUser = (req, res) => {
  const { username, email, password } = req.body;

  return User.create({ username, email, password })
    .then(() => res.status(201).send("User successfully Created"))
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

//Get all blog users:
const getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      if (users.length > 0) {
        return res.send(users).status(200);
      } else {
        return res.send("users not found").status(404);
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};

//Get a blog user by id:
const getUserById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

//delete a blog user by id:
const deleteUser = (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      } else {
        return res.status(200).send("User successfully deleted");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

//update user by id:
const updateUser = (req, res) => {
  let id = req.params.id;

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json("User not found");
      } else {

        const updatedUser = req.body;
        User.update(updatedUser, {
          where: {
            id: id
          }
        })
        .then(() => {
          res.status(200).json("User successfully updated");
        });
      }
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
