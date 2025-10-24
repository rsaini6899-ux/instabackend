const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: [true, "img is required!"] },
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "author is required!"],
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Post", postSchema);
