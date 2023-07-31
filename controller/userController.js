const User = require("../model/blogUser");

//validate user details:

const validateUserInput = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(422)
      .json({ error: "Username, email, and password are required fields." });
  }

  if (
    typeof username !== "string" ||
    username.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.trim() === ""
  ) {
    return res
      .status(422)
      .json({
        error: "Username, email, and password must be non-empty strings.",
      });
  }

  // check that password is more than 4 characters
  if (password.length < 4) {
    return res
      .status(422)
      .json({ error: "Password must be at least 4 characters long." });
  }

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ error: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(422).json({ error: "User Email already exists." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error checking email in the database." });
  }

  next();
};

//Add a new user:
const addNewUser = (req, res) => {
  const { username, email, password } = req.body;
  const userData = { username, email, password };

  User.create(userData)
    .then((user) => {
      console.log(JSON.stringify(user));
      res
        .status(201)
        .send(`User successfully Created: ${JSON.stringify(user)}`);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

//Get all blog users:
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(200).json({ message: "No users found." });
    }

    // Send the response with all users only once after the loop
    const usersData = users.map((user) => {
      console.log(JSON.stringify(user));
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    res.status(200).json(usersData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get a blog user by id:
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("user id: " + id);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const userdata = { username, email, password };

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update(userdata);

    return res.status(200).json({ message: "User successfully updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAllUsers = getAllUsers;
module.exports.addUsers = addNewUser;
module.exports.getUserById = getUserById;
module.exports.validateUser = validateUserInput;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
