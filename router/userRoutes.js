const express = require('express');
const { getAllUsers, addUsers,  getUserById, validateUser, deleteUser, updateUser } = require('../controller/userController');

const router = express.Router();

router.get('/', getAllUsers);   
router.post('/new', validateUser, addUsers)
router.get('/:id', getUserById)
router.delete('/:id', deleteUser)
router.patch('/update/:id', updateUser)

module.exports = router;


