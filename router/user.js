const express = require('express')
const router = express.Router()
const authUser = require('../middleware/auth')
const {signUp,login,logOut,getProfile,editProfile,getSuggestedUsers,followOrunfolllow} = require('../controller/user')
const { uploade } = require('../middleware/multer')

router.post('/signUp', signUp)
router.post('/login', login)
router.post('/logOut', logOut)
router.put('/edit/:userId',uploade.single('userImg'), editProfile)
router.get('/profile/:id',authUser, getProfile)
router.get('/suggested',authUser, getSuggestedUsers)
router.post('/followOrunfolllow/:id',authUser, followOrunfolllow)

module.exports = router
