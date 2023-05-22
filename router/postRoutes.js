const express = require('express');

const { getAllPosts, validatePosts, createPost, getPostById,  deletePost, uploadImage } = require('../controller/postController');



const router = express.Router();

router.get('/', getAllPosts)

router.post('/new', validatePosts, createPost)

router.put('/uploadimage/:id', uploadImage)

router.get('/:id', getPostById)

router.delete('/:id', deletePost)


module.exports = router;