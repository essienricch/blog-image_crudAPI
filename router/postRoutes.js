const express = require("express");

const {
    getAllPosts,
    validatePosts,
    createPost,
    getPostById,
    deletePost,
    updatePost,
    getByPostTitle,
    getAllPostsByUserId
} = require("../controller/postController");
const upload = require("../util/multer")


const router = express.Router();

router.get("/", getAllPosts);

router.post("/new", upload.single('file'), validatePosts, createPost);

router.post("/get-by-userid", getAllPostsByUserId)

router.patch("/update/:id", upload.single('file'),updatePost);

router.get("/get-by-title", getByPostTitle);

router.get("/:id", getPostById);

router.delete("/:id", deletePost);

module.exports = router;
