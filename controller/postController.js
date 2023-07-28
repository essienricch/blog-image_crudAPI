const Post = require("../model/blogPost");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const cloudinary = require("../util/mediaConfig");
const { log } = require("console");

const storage = multer.memoryStorage();

var upload = multer({
  dest: "uploads/",
  storage: storage,
  limits: {
    fileSize: 255 * 1024 * 1024, // 5MB file size limit
  },
});

//validate posts:
const validatePosts = [
  body("title").notEmpty(),
  body("content").notEmpty(),

  body("tags").notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

//Add a blog post:
const createPost = async (req, res) => {
  const { title, content, file, tags, userId } = req.query;

  // Save file/images if exists:
  if (file) {
    // Save file/images to local storage:
    const localFilePath = `uploads/${file.originalname}`;

    fs.writeFile(localFilePath, file.buffer, (err) => {
      console.error(err);
      return res.status(500).send("Failed to save file to local storage.");
    });

    // Save file/images to Cloudinary:

    cloudinary.uploader
      .upload(localFilePath, { secure: true })
      .then((response) => {
        console.log("Image uploaded to cloud: ", response);
      })
      .catch((error) => {
        res.send(error.message).status(500);
      });
    // cloudinary.uploader.upload(localFilePath, (error, result) => {
    //   if (error) {
    //     console.error(error);
    //     return res.status(500).send("Failed to save file to Cloudinary.");
    //   }

    // res.send(`File saved to Cloudinary: ${result.secure_url}`);
  }

  const postData = { title, content, localFilePath, tags, userId };
 await Post.create(postData)
    .then((post) => {
      console.log("post successfully created by user: ", post.userId);
      res
        .status(201)
        .send(`Detail: post successfully created, ${post} `);
    })

    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    });
};

//update post:
const updatePost = (req, res) => {
  let id = req.params.id;
  const { title, content, file, tags } = req.query;
  const updatedPost = { title, content, file, tags };
  Post.findByPk(id)
    .then((data) => {
      console.log(data.title.toJson());
      return data.save(updatedPost);
    })
    .then((value) => {
      console.log("post updated successfully");
      res.status(200).send(value.toJson());
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send(error.message);
    });
};

//Get all posts:
const getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) =>
      posts.forEach((element) => {
        console.log(element.toJson());
        res.send(element.toJson()).status(200);
      })
    )
    // return res.status(200).json(posts);

    .catch((err) => {
      return res.send(err.message).status(404);
    });
};

//Get a single post:
const getPostById = (req, res) => {
  let postId = req.params.id;

  Post.findByPk(postId)
    .then((post) => {
      return res.json(post).status(200);
    })
    .catch((error) => {
      res.status(404).send({ message: error.message });
    });
};

//Get a Post by Post Title:
const getPostByTitle = async (req, res) => {
  const { title } = req.body;
  await Post.findOne({ title: title })
    .then((post) => {
      console.log("post with title %s found.", post.title);
      res.status(200).send(post);
    })
    .catch((error) => {
      console.log("error: %s", error.message);
      res.status(500).send(error.message);
    });
};

//Delete a post by id:
const deletePost = (req, res) => {
  const id = req.params.id;
  Post.findByPk(id)
    .then((post) => {
      console.log("post deleted successfully");
      return res.status(200).send(post.destroy());
    })
    .catch((error) => res.status(404).send(error.message));
};

exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getAllPosts = getAllPosts;
exports.validatePosts = validatePosts;
exports.deletePost = deletePost;
exports.updatePost = updatePost;
exports.getByPostTitle = getPostByTitle
