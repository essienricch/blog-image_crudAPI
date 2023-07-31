require("dotenv").config();
const Post = require("../model/blogPost");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

//validate posts:
const validatePosts = async (req, res, next) => {
  try {
    console.log("in the validate method");
    const { title, content, tags, userId } = req.body;
    console.log(title);
    console.log(req.body);

    // Check if title, content, and tags are present and not empty
    if (!title || !content || !tags || !userId) {
      console.log("in the if block");
      return res.status(422).json({
        error: "Title, content, tags, and userId are required fields.",
      });
    }

    // Check if title and content are not empty strings
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof content !== "string" ||
      content.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Title and content must be non-empty strings." });
    }

    // Check if tags is an array and not empty
    if (!Array.isArray(tags) || tags.length === 0) {
      return res
        .status(400)
        .json({ message: "Tags must be a non-empty array." });
    }
    next();
  } catch (error) {
    // Handle any errors that occur during validation
    res.status(500).json({ error: "Error validating post data." });
  }
};

//Add a blog post:
const createPost = async (req, res) => {
  console.log("in the create post method");

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  // Extract the file from the request and store it in the "uploads" directory
  console.log(req.file);
  const { path } = req.file;
  try {
    if (!path) {
      return res.status(400).send("Invalid file data received.");
    }

    console.log("File stored in:", path);

    // Save file/images to Cloudinary:
    const response = await cloudinary.uploader.upload(path, options);

    console.log("Image uploaded to cloud: ", response);
    fs.unlinkSync(path); // Remove the file from local storage after upload to Cloudinary

    // Extract other fields from the request body
    const { title, content, tags, userId } = req.body;
    console.log(tags);

    // Create the post or perform other operations with the extracted data
    const postData = {
      title,
      content,
      tags,
      userId,
      file: response.secure_url,
    };
    await Post.create(postData)
      .then((post) => {
        console.log("Post successfully created by userId: ", post.userId);
        res
          .status(201)
          .send(`Detail: post successfully created, ${JSON.stringify(post)}`);
      })
      .catch((error) => {
        console.error(error.message);
        res.status(505).json({ message: error.message });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error handling file upload." });
  }
};

//update post:
const updatePost = async (req, res) => {
  try {
    let id = req.params.id;
    const { title, content, tags, userId } = req.body;
    const updatedPost = { title, content, tags, userId };

    const post = await Post.findByPk(id);

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if there's a new file to upload
    if (req.file) {
      const { path } = req.file;
      // Delete the previous image from Cloudinary if it exists
      if (post.file) {
        const public_id = post.file.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      const response = await cloudinary.uploader.upload(path, { secure: true });
      updatedPost.file = response.secure_url;
    }

    await post.update(updatedPost);

    console.log("Post updated successfully");
    res.status(200).send(JSON.stringify(updatedPost));
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

//Get All Post By UserId:
const getAllPostsByUserId = async (req, res) => {
  try {
    const userId = req.body.userId;
    const posts = await Post.findAll({ where: { userId } });

    if (posts.length === 0) {
      return res.status(404).send("No posts found for the user.");
    }

    console.log("Posts retrieved successfully");
    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

//Get all posts:
const getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      const postsJson = posts.map((post) => post.toJSON());
      console.log(postsJson);
      res.status(200).json(postsJson);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Failed to fetch posts from the database.", err });
    });
};

//Get a single post:
const getPostById = async (req, res) => {
  try {
    let postId = req.params.id;

    const post = await Post.findByPk(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    console.log(JSON.stringify(post));
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Get a Post by Post Title:
const getPostByTitle = async (req, res) => {
  try {
    const { title } = req.body;
    console.log(title);

    const post = await Post.findOne({ where: { title: title } });

    if (!post) {
      throw new Error(`Post with title ${title} not found`);
    }

    console.log("Post with title %s found.", post.title);
    res.status(200).send(post);
  } catch (error) {
    console.log("Error: %s", error.message);
    res.status(404).send({ message: error.message });
  }
};

//Delete a post by id:
const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).send("Detail: Post not found");
    }

    // Delete the image from Cloudinary if it exists
    if (post.file) {
      const public_id = post.file.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }

    await post.destroy();

    console.log("Post deleted successfully");
    res.status(200).send("Detail: post deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getAllPosts = getAllPosts;
exports.validatePosts = validatePosts;
exports.deletePost = deletePost;
exports.updatePost = updatePost;
exports.getByPostTitle = getPostByTitle;
exports.getAllPostsByUserId = getAllPostsByUserId;
