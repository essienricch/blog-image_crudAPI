const Post = require("../model/blogPost");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const storage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

var upload = multer({
  dest: "uploads/",
  storage: storage,
  limits: {
    fileSize: 255 * 1024 * 1024, // 5MB file size limit
  },
});

//Add a blog post:
const validatePosts = [
  body("title").notEmpty(),
  body("body").notEmpty(),

  upload.single("file"),

  (req, res, next) => {
    const errors = validationResult(req.body);

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

  if (!file) {
    res.status(400).send({ message: "No file uploaded" });
  }

  // Save to local storage
  const localFilePath = `uploads/${file.originalname}`;

  fs.writeFile(localFilePath, file.buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to save file to local storage.");
    }
    // res.status(201).send(`File saved to local storage: ${localFilePath}`);
  });

  // Save to Cloudinary
  cloudinary.uploader.upload(localFilePath, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to save file to Cloudinary.");
    }
    
    // res.send(`File saved to Cloudinary: ${result.secure_url}`);
  });

  Post.create({
    title: title,
    body: body,
    file: localFilePath,
    // file: {
    //   data: file.buffer,
    //   contentType: file.mimetype,
    //   filename: file.originalname,
    // },
  })
    .then(() => {
      console.log("file saved in the cloudinary");
      res.status(201).send({ message: "Post successfully created" });
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
};

//upload images:
const uploadImage = (req, res) => {
  let id = req.params.id;
  let file = req.file;

  Post.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.json("post not found").status(404);
      } else {
        const updatedPost = file;
        Post.update(updatedPost, {
          where: { id: id },
        });

        upload.single(file);

        cloudinary.uploader.upload(file.path, (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).send("Failed to save file to cloudinary.");
          }
          res.send(`File saved to Cloudinary: ${result.secure_url}`);
        });
      }
    })
    .then(() => {
      res.status(200).json("File successfully updated");
    })
    .then(
      (req,
      res,
      (error) => {
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            res
              .status(422)
              .json({ message: "File size too large. Max 5MB allowed." });
          } else {
            res.status(422).json({ message: error.message });
          }
        } else if (error) {
          // Handle other errors
          res.status(500).json({ message: error.message });
        } else {
          res.status(200).json("image succesfully uploaded");
        }
      })
    );
};

//Get all posts:
const getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      if (posts.length < 1) {
        res.status(422).json({ message: "No Post Found" });
      }
      return res.status(200).json(posts);
    })
    .catch((err) => {
      return res.send(err.message);
    });
};

//Get a single post:
const getPostById = (req, res) => {
  let postId = req.params.id;

  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      } else {
        return res.json(post).status(200);
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

//Delete a post by id:
const deletePost = (req, res) => {
  Post.destroy({ where: { id: req.params.id } })
    .then((post) => {
      if (post) {
        res.status(200).send({ "post deleted successfully": post });
      } else {
        return res.status(404).send("post not found");
      }
    })
    .catch((error) => res.status(500).send(error.message));
};

exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getAllPosts = getAllPosts;
exports.validatePosts = validatePosts;
exports.deletePost = deletePost;
exports.uploadImage = uploadImage;
