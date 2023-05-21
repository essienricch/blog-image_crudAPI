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
    .then(() => res.status(201).send("User successfully Created")).
     catch ((err) => {
    res.status(500).send(err.message);
  })
};

//Get all blog users:
const getAllUsers = (req, res, next) => {
  let users;

  try {
    users = User.findAll();

    if (users.length === 0) {
      return res.status(422).json({ message: "No users found" });
    } else {
      return res.status(200).json({ users });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//Get a blog user by id:
const getUserById = (req, res) => {
  try {
    const user =  User.findOne(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user).status(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete a blog user by id:
const deleteUser = (req, res) => {
  let saveduser;

  try {
    // const user = await User.delete(req.params.id);
    saveduser = User.findOne(req.params.id);
    if (!saveduser) {
      return res.status(404).send("User not found");
    }
    User.destroy(saveduser);
    return res.status(200).send("User successfully deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//update user by id:
const updateUser = (req, res) => {
  let saveduser;

  try {
    saveduser = User.findOne(req.params.id);

    if (!saveduser) {
      return res.status(404).send("User not found");
    }
    saveduser.username = req.body.username;
    saveduser.email = req.body.email;
    saveduser.password = req.body.password;
    saveduser.save();
    return res.status(200).send("User successfully updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.getAllUsers = getAllUsers;
module.exports.addUsers = addNewUser;
module.exports.getUserById = getUserById;
module.exports.validateUser = validate;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
