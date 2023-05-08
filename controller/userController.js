const User = require("../model/blogUser");
const { body, validator } = require("express-validator");

const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    return next(err);
  }
  if (!users) {
    return res.status(422).json({ message: "No user found" });
  } else {
    return res.status(200).json({ users });
  }
};

const validate = [
  body("userName", "userName doesn't exists").exists(),
  body("email").exists().isEmail(),
  body("password", "Password must be greater than 8 characters").exists(),

  (req, res, next) => {
    const errors = validator(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

const addNewUser = async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await User.create({ userName, email, password });
  let saveduser = user.save();
  res.json(saveduser).status(201).send("User successfully Created");
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addNewUser;
exports.getUserById = getUserById;
exports.validateUser = validate;
