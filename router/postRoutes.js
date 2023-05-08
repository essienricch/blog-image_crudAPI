const express = require('express');

const { getAllPosts, validatePosts, createPost, getPostById } = require('../controller/postController');



const router = express.Router();

router.get('/', getAllPosts)

router.post('/new', validatePosts, createPost)

router.get('/:id', getPostById)


module.exports = router;