const Post = require("../model/blogPost");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const storage = multer.memoryStorage();
var upload = multer({ dest: "uploads/" });

//Add a blog post:
const validatePosts = [
  body("title").notEmpty(),
  body("body").notEmpty(),

  upload.single("file"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

const createPost = (req, res) => {
  const { title, body } = req.body;
  const file = req.file;

  return Post.create({
    title,
    body,
    file: {
      data: file.buffer,
      contentType: file.mimetype,
      filename: file.originalname,
    },
  })
    .then(() => res.status(201).send({ message: "Post successfully created" }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

//Get all posts:
const getAllPosts = (req, res, next) => {
  let posts;

  try {
    posts = Post.findAll();
    if (!posts) {
      res.status(422).json({ message: "No Post Found" });
    }
    return res.status(200).json({ posts });
  } catch (err) {
    return next(err);
  }
};



//Get a single post:
const getPostById = (req, res) => {
  try {
    const post = Post.findOne(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post).status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete a post by id:
const deletePost = (req, res) => {
  let postId = req.params.id;
  Post.destroy(postId)
  .then((postId) => res.status(200)
  .send( {"post deleted successfully" : postId})).
  catch((error) => res.status(500).send(error.message))
}


exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getAllPosts = getAllPosts;
exports.validatePosts = validatePosts;
exports.deletePost = deletePost;
