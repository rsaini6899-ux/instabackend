const Post = require('../model/post')
const User = require('../model/user')
const Comment = require('../model/comment')
const sharp = require('sharp')
const { getDataUri } = require('../utils/dataUri')
const cloudinary = require('../utils/cloudinary')
const { getReceiverSocketId } = require('../socket/socketIo')

module.exports.addNewPost = async (req, res) => {
    try {
        const { caption } = req.body
        const  image  = req.file
        const authorId = req.id
        
        if(!image) throw new Error('image required')

         // upload image to cloud storage
        const optimizedImgBuffer = await sharp(image.buffer)
        .resize({width : 800, height : 800})
        .toFormat('jpeg', {quality : 80})
        .toBuffer()

        const fileUri = `data:image/jpeg;base64,${optimizedImgBuffer.toString('base64')}`

        const cloudResponse = await cloudinary.uploader.upload(fileUri)

        const posts = await Post.create({
            caption,
            author : authorId,
            image : cloudResponse.secure_url,
            // like : 0,
            // comments : []  
        })

        const user = await User.findById(authorId)
        if (user) {
            user.post.push(posts._id)
            await user.save()
        }

        await posts.populate({path : 'author',  select : '-password'})

        res.status(201).json({message: 'post create successfully!',posts})

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt : -1})
        .populate({path : 'author', select : 'name userImg'})
        .populate({
            path : 'comments',
            sort : {createdAt : -1},
            populate : {
                path : 'author', 
                select : 'name userImg'
            }
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.getUserPost = async (req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({author : authorId}).sort({createdAt : -1})
       .populate({path : 'author', select : 'name userImg'})
       .populate({
            path : 'comments',
            sort : {createdAt : -1},
            populate : {
                path : 'author',
                select : 'name userImg'
            }
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id
        const likeKrneWala = req.id
        console.log(likeKrneWala)        
        const post = await Post.findById(postId)    

        if (!post) throw new Error('post not found')
         
        await post.updateOne({$push : {likes : likeKrneWala}})
   
        await post.save()

        const user = await User.findById(likeKrneWala).select('name userImg')
        const postOwnerId = post.author.toString()
        if(postOwnerId !== likeKrneWala){
            const notification = {
                // recipient : post.author,
                type : 'like',
                userId : likeKrneWala,
                userDetails : user,
                postId : post._id,
                message : 'Your post was like'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification)
        }
        
       return res.status(200).json({message : 'liked successfully!'})

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)      
    }
}

module.exports.disliked = async (req, res) => {
    try {
        const postId = req.params.id
        const dislikeKrneWala = req.id
        console.log(dislikeKrneWala)

        const post = await Post.findById(postId)

        if (!post) throw new Error('post not found')

        await post.updateOne({$pull : {likes : dislikeKrneWala}})
        
       
        await post.save()

        const user = await User.findById(dislikeKrneWala).select('name userImg')
        const postOwnerId = post.author.toString()
        if(postOwnerId !== dislikeKrneWala){
            const notification = {
                // recipient : post.author,
                type : 'dislike',
                userId : dislikeKrneWala,
                userDetails : user,
                postId : post._id,
                message : 'Your post was like'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification)
        }
        

        return res.status(200).json({message : 'disliked successfully!'})

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id
        const commentKrneWala = req.id
        const {text} = req.body
        const post = await Post.findById(postId)

        if (!text) return res.status(404).json({error : 'text is required'})
            
        const comment = await Comment.create({
            text,
            author : commentKrneWala,
            post : postId
        })
        
        await comment.populate({path : 'author', select : 'name userImg'})
        
        post.comments.push(comment._id)
        await post.save()
        
        
        return res.status(200).json(comment)
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id

        const comments = await Comment.find({post : postId})
        .populate('author', 'name userImg')

        if (!comments) return res.status(404).json({error : 'comments not found'})
            
        return res.status(200).json(comments)
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id

        const post = await Post.findById(postId)

        if (!post) throw new Error('post not found')

        if (post.author.toString()!== authorId) return res.status(403).json({error : 'you are not authorized to delete this post'})
            
        await post.deleteOne()

        const user = await User.findById(authorId)

        user.post.pull(postId)

        await user.save()

        await Comment.deleteMany({post : postId})
        
        return res.status(200).json({message : 'post deleted successfully!'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.bookmark = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id
        const post = await Post.findById(postId)
        
        if (!post) return res.status(404).json({error : 'post not found'})

            const user = await User.findById(authorId)
            
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({$pull : {bookmarks : post._id}})
            await user.save()
            return res.status(200).json({type : 'unsaved', message : 'bookmarks removed successfully!'})
        } else {
            await user.updateOne({$push : {bookmarks : post._id}})
            await user.save()
            return res.status(200).json({message : 'bookmarks added successfully!'})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}