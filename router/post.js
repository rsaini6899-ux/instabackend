const express = require('express')
const router = express.Router()
const authUser = require('../middleware/auth')
const {addNewPost,getPosts,getUserPost,likePost,disliked,commentOnPost,getCommentOfPost,deletePost,bookmark} = require('../controller/post')
const { uploade } = require('../middleware/multer')

router.post('/addNewPost', authUser, uploade.single('image'), addNewPost)
router.get('/getPosts', authUser, getPosts)
router.get('/getUserPost', authUser, getUserPost)
router.get('/like/:id',authUser, likePost)
router.get('/dislike/:id',authUser, disliked)
router.post('/comment/:id', authUser, commentOnPost)
router.get('/getCommentOfPost', authUser, getCommentOfPost)
router.delete('/deletePost/:id',authUser, deletePost)
router.post('/bookmark/:id', bookmark)

module.exports = router
