const express = require('express')
const router = express.Router()
const authUser = require('../middleware/auth')
const {sendMessage,getMessages} = require('../controller/message')
const { uploade } = require('../middleware/multer')

router.post('/sendMessage/:id', sendMessage)
router.get('/getMessages/:id', getMessages)

module.exports = router
