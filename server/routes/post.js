const express = require("express")
const { checkUser } = require("../middleware/authcheck")
const { AddPost, GetPost, SendComment, LikePost, GetNotify } = require("../controllers/post")
const router = express.Router()

router.post('/post', checkUser, AddPost)

router.get('/post', checkUser, GetPost)

router.post('/comment', checkUser, SendComment)

router.post('/like', checkUser, LikePost)

router.get('/notify', checkUser, GetNotify)

module.exports = router