const express = require("express")
const router = express.Router()
const { register, login, checklogin } = require("../controllers/auth")
const { checkUser } = require("../middleware/authcheck")

router.post('/register', register)
router.post('/login', login)

router.post('/checklogin', checkUser, checklogin)

module.exports = router