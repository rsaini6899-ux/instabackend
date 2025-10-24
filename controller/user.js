const  User = require('../model/user')
const Post = require('../model/post')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getDataUri } = require('../utils/dataUri')
const cloudinary = require('../utils/cloudinary');

module.exports.signUp = async (req, res) => {
    const {name, email, password} =req.body
    try {
        const findUser = await User.findOne({email})
        if(findUser){
            throw new Error('use a unique email id!')
        }

        const hashPassword =  await bcrypt.hash(password, 10)

        const newUser = new User({
            name : name,
            email : email,
            password : hashPassword
        })

        await newUser.save()

        return res.status(200).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.login = async (req, res) => {
    const {email, password} = req.body
    // console.log(req.body)
    try {
        const user = await User.findOne({email})
        // console.log(user)
        if(!user){
            throw new Error('incorrect email or password!')
        }
        const ispassword = await bcrypt.compare(password, user.password)
        // console.log(ispassword)
        if(!ispassword){
            throw new Error('incorrect email or password!')
        }

        const token = await jwt.sign({userId : user._id},process.env.SECRET)

        //populte each post id in the posts array
        
        const populatedPosts = await Promise.all(
            user.post.map(async postId => {
                const post = await Post.findById(postId)
                if(Post.author === (user._id)){
                    return post
                }
                return null
            })
        )

       const newUser = {
           _id : user._id,
           name : user.name,
           email : user.email,
           userImg : user.userImg,
           bio : user.bio,
           followers : user.followers,
           following : user.following,
           post : user.post
        }

        return res.cookie('token', token, {httpOnly : true, sameSite : 'strict', maxAge : 1*24*60*60*1000}).status(200).json({
            message : `Welcome back ${user.name}`,
            newUser,
            // token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.logOut =async (req, res) => {
    try {
        return res.cookie('token', '', {macAge : 0}).status(200).json('log out successfully!')
    } catch (error) {
        console.log(error)
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId)
        const user = await User.findById(userId).populate({path : 'post', createdAt : -1}).populate('bookmarks')
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

module.exports.editProfile =async (req, res) => {
    const {bio, gender} = req.body
    try {
        const {userId} = req.params
        console.log('userdfrdd',userId)
        
        const userImg = req.file
        let cloudResponse
        if(userImg){
           const fileUri = getDataUri(userImg)
           cloudResponse =  await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById({_id : userId}).select('-password')
     
        if(!user){
            throw new Error('user not found!')
        }
        if(bio) user.bio = bio
        if(gender) user.gender = gender
        if(userImg) user.userImg = cloudResponse.secure_url

        await user.save()

        return res.status(200).json(user)
    
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id : {$ne : req.id}}).select('-password')
        if(!suggestedUsers){
            throw new Error('do not have any users')
        }
        return res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports.followOrunfolllow = async (req,res) => {
    try {
        const followKrneWala = req.id
        const jiskoFollowkrenge = req.params.id 

        if(followKrneWala == jiskoFollowkrenge){
            throw new Error('you can not follow or unfollow yourself!')
        }

        const user = await User.findById(followKrneWala)
        const targetUser = await User.findById(jiskoFollowkrenge)

        if(!user || !targetUser){
            throw new Error('user not found!')
        }

        // mai check krunga ki follow krna h ya unfollow
        const isFollowing = user.following.includes(jiskoFollowkrenge)
        if(isFollowing){
            // unfollow logic
            await Promise.all([
                User.updateOne({_id : followKrneWala},{$pull : {following : jiskoFollowkrenge}}),
                User.updateOne({_id : jiskoFollowkrenge},{$pull : {followers : followKrneWala}})
            ])
            return res.status(200).json({message : 'unfollow successfully!'})
        }else{
            // follow logic
            await Promise.all([
                User.updateOne({_id : followKrneWala},{$push : {following : jiskoFollowkrenge}}),
                User.updateOne({_id : jiskoFollowkrenge},{$push : {followers : followKrneWala}})
            ])
            return res.status(200).json({message : 'follow successfully!'})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}