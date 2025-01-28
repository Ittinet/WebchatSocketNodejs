const express = require("express")
const { checkUser } = require("../middleware/authcheck")
const { SentMessage, GetMessage } = require("../controllers/message")
const router = express.Router()

router.post('/message', checkUser, SentMessage)
router.get('/message/:id', checkUser, GetMessage)




module.exports = router