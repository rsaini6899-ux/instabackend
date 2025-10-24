const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: [true, "name is required!"] },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required!"],
    },
    password: { type: String, required: [true, "password is required!"] },
    userImg: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);
