const Post = require("../model/blogPost");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const storage = multer.memoryStorage();
var upload = multer({ dest: "uploads/" });

const getAllPosts = async (req, res, next) => {
  let posts;

  try {
    posts = await Post.find();
  } catch (err) {
    return next(err);
  }
  if (!posts) {
    return res.status(500).json({ message: "Internal Server Error" });
  } else {
    return res.status(200).json({ posts });
  }
};

//Add a blog post:
const validatePosts = [
  body("title").notEmpty(),
  body("body").notEmpty(),
  body("author").notEmpty(),
  body("createdAt").isISO8601(),

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

const createPost = async (req, res, next) => {
  const { title, body, author, createdAt } = req.body;
  const file = req.file;

  const post = new Post({
    title,
    body,
    author,
    createdAt,
    file: {
      data: file.buffer,
      contentType: file.mimetype,
      filename: file.originalname,
    },
  });

  try {
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get a single image:
const getImage = async (req, res, next) => {
    const postId = req.params.id;

  
    try {
      const post = await Post.findById(postId);
  
      const image = post.file;
      if (!image) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }
  
      res.set('Content-Type', image.contentType);
      res.send(image.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



//Get a single post:
const getPostById = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message:"Post not found"})
        }
        return res.json(post)
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getAllPosts = getAllPosts;
exports.validatePosts = validatePosts;
module.exports.uploadImg = getImage
