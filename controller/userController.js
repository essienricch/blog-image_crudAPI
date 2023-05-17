const User = require("../model/blogUser");
const { body, validationResult } = require("express-validator");


//Get all blog users:
const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find().maxTimeMS(20000);
    if (users.length === 0) {
      return res.status(422).json({ message: "No users found" });
    } else {
      return res.status(200).json({ users });
    }
  } catch (err) {
    return next(err);
  }
};

//Add a new user:
const validate = [
  body("userName", "userName doesn't exists").exists(),
  body("email").exists().isEmail(),
  body("password", "Password must be greater than 8 characters")
    .exists()
    .isLength({ min: 4 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

const addNewUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const user = await User.create({ userName, email, password });
    let saveduser = user.save();
    res.json(saveduser).status(201).send("User successfully Created");
  } catch (err) {
    res.status(401).send(err.message);
  }
};

//Get a blog user by id:
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

module.exports.getAllUsers = getAllUsers;
module.exports.addUsers = addNewUser;
module.exports.getUserById = getUserById;
module.exports.validateUser = validate;
