const express = require('express');
// const expressValidator = require("express-validator");
const { getAllUsers, addUsers,  getUserById, validateUser, deleteUser, updateUser } = require('../controller/userController');

const router = express.Router();

router.get('/', getAllUsers);   
router.post('/new', validateUser, addUsers)
router.get('/:id', getUserById)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)

module.exports = router;


