const express = require('express')
const { GetUser, SeachUser, GetCurrentUser, AddFriend, AcceptRequest, GetRequest, DeleteFriend, RejectRequest, GetFirend } = require('../controllers/user')
const { checkUser } = require('../middleware/authcheck')
const router = express.Router()

router.get('/user', checkUser, GetUser)
router.get('/user/search', checkUser, SeachUser)
router.get('/user/currentuser', checkUser, GetCurrentUser)

router.get('/request', checkUser, GetRequest)
router.post('/request/send', checkUser, AddFriend)
router.post('/request/accept/:id', checkUser, AcceptRequest)
router.delete('/request/reject/:id', checkUser, RejectRequest)

router.get('/friend', checkUser, GetFirend)
router.delete('/friend/:id', checkUser, DeleteFriend)


module.exports = router