const express = require("express")
const { checkUser } = require("../middleware/authcheck")
const { AddPost, GetPost, SendComment, LikePost } = require("../controllers/post")
const router = express.Router()

router.post('/post', checkUser, AddPost)

router.get('/post', checkUser, GetPost)

router.post('/comment', checkUser, SendComment)

router.post('/like', checkUser, LikePost)

module.exports = router