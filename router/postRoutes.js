const express = require('express');

const { getAllPosts, validatePosts, createPost, getPostById,  deletePost, updatePost, getByPostTitle } = require('../controller/postController');



const router = express.Router();

router.get('/', getAllPosts)

router.post('/new', validatePosts, createPost)

router.patch('/update/:id', updatePost)

router.get('/get-by-title', getByPostTitle)

router.get('/:id', getPostById)

router.delete('/:id', deletePost)


module.exports = router;