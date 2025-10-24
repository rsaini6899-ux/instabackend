const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: [true, "text is required!"] },
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "author is required!"],
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post is required!"],
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema);
