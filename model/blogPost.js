const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogScheme = new Schema({
    
  title: {
    type: "string",
    require: true,
  },

  body: {
    type: "string",
    require: true,
  },

  file: {
    type: "string",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", blogScheme);

module.exports = Post;
