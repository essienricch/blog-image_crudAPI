const express = require('express');

const { getAllPosts, validatePosts, createPost, getPostById, uploadImg } = require('../controller/postController');



const router = express.Router();

router.get('/', getAllPosts)

router.post('/new', validatePosts, createPost)

router.get('/:id', getPostById)

router.get('/image/:id', uploadImg)


module.exports = router;