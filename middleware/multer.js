const multer = require('multer')

module.exports.uploade = multer({
    storage : multer.memoryStorage()
})