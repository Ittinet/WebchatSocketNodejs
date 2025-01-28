const express = require('express')
const { GetUser, SeachUser, GetCurrentUser, AddFriend, AcceptRequest, GetRequest, DeleteFriend, RejectRequest, GetFirend, GetProfileUser, GetAlreadySent, CancleRequest, AddProFile } = require('../controllers/user')
const { checkUser } = require('../middleware/authcheck')
const router = express.Router()

router.get('/user', checkUser, GetUser)
router.get('/user/search', checkUser, SeachUser)
router.get('/user/currentuser', checkUser, GetCurrentUser)
router.get('/user/:id', checkUser, GetProfileUser)

router.get('/request', checkUser, GetRequest)
router.get('/request/alreadysent', checkUser, GetAlreadySent)
router.post('/request/send', checkUser, AddFriend)
router.post('/request/accept/:id', checkUser, AcceptRequest)
router.delete('/request/cancle/:id', checkUser, CancleRequest)
router.delete('/request/reject/:id', checkUser, RejectRequest)

router.post('/profile', checkUser, AddProFile)

router.get('/friend', checkUser, GetFirend)
router.delete('/friend/:id', checkUser, DeleteFriend)


module.exports = router