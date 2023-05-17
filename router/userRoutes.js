const express = require('express');
// const expressValidator = require("express-validator");
const { getAllUsers, addUsers,  getUserById, validateUser } = require('../controller/userController');

const router = express.Router();

router.get('/', getAllUsers);   
router.post('/new', validateUser, addUsers)
router.get('/:id', getUserById)

module.exports = router;


