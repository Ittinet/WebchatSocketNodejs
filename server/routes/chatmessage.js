const express = require("express")
const { checkUser } = require("../middleware/authcheck")
const { SentMessage, GetMessage, GetLastMessage, ReadMessage } = require("../controllers/message")
const router = express.Router()

router.post('/message', checkUser, SentMessage)
router.get('/message', checkUser, GetLastMessage)
router.get('/message/:id', checkUser, GetMessage)

router.patch('/message/read/:id', checkUser, ReadMessage)





module.exports = router