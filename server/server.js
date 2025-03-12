require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require('cors')
const socketIO = require('socket.io')
const connectDB = require('./config/mongodb')
const http = require('http')
const { readdirSync } = require("fs")
const jwt = require('jsonwebtoken');
const { User, Friendship, Notify, Post } = require('./models/Schema');
const { default: mongoose } = require('mongoose');
// const authRouter = require("./routes/auth")
// const categoryRouter = require("./routes/category")




const server = http.createServer(app)
const PORT = 8000



// middleware
// app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(cors())

// app.use('/api', authRouter)
// app.use('/api', categoryRouter)
readdirSync('./routes').map((item) => app.use('/api', require(`./routes/${item}`)))


// Router

server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`)
    } catch (error) {
        console.error('Server Faild', error)
    }

})

const io = socketIO(server, {
    maxHttpBufferSize: 1e7,
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization']
    }
});




// MiddleWare Socket
const verifyToken = (socket, next) => {
    const HeadersToken = socket.handshake.headers['authorization']
    if (!HeadersToken) {
        return next(new Error('Authorization token required'))
    }
    const token = HeadersToken.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new Error('Invalid token'))
        }
        socket.user = decoded;
        next()
    })

}
io.use(verifyToken);

// Function
const UpdateStatus = async (socketid, id, status) => {
    try {
        const updateStatus = await User.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    status: status,
                    socketId: status === 'online' ? socketid : null,
                    last_active: status !== 'online' ? Date.now() : null
                }
            },
            { new: true }
        )

    } catch (error) {
        console.log('Error updating user Status :', error)
    }
}

const FriendUser = async (userid) => {
    try {
        const FriendData = await Friendship.find({
            $or: [
                { user1: userid },
                { user2: userid }
            ],
            status: 'accepted'
        }).populate('user1 user2', '-password')

        const FriendFilter = FriendData.map((item) => {
            return item.user1._id.toString() === userid.toString() ? item.user2 : item.user1
        })


        return FriendFilter

    } catch (error) {
        console.log('Error updating user Status :', error)
    }
}

let userOnline = {}

io.on('connection', (socket) => {
    const userid = socket.user.user_id
    console.log('User Connected: ' + socket.user.email + ' ' + socket.id)
    UpdateStatus(socket.id, userid, 'online')
    userOnline[socket.user.user_id] = socket.id
    // console.log('useronline', userOnline)
    // console.log('test', userOnline[socket.user.user_id])

    socket.on('updateStatus', ({ userid, socketid }) => {
        socket.broadcast.emit(('isUserOnline'), { userid, socketid })
    })

    socket.on('SentMessage', (data) => {
        // const { socketid, ...messagedata } = data; //แยก socketid ออก จาก data เพื่อส่งเฉพาะข้อมูลอื่นไป (เปลี่ยนไปใช้อีกวิธีวิธีนี้เลยไม่ได้ใช้แล้ว)
        io.to(userOnline[data.receiver._id]).emit('NewMessage', data)
        io.to(userOnline[data.receiver._id]).emit('NotityfyChat', data.sender)
    })

    socket.on('AddFriend', (data) => {
        // const { socketid, ...newRequest } = data
        io.to(userOnline[data.receiver._id]).emit('newRequest', data)
    })

    socket.on('ReadMessage', (receiverId) => {
        io.to(userOnline[receiverId]).emit('ReadByReceiver')
    })

    socket.on('onTyping', ({ targetid, data }) => {
        io.to(userOnline[targetid]).emit('areadyTyping', { fromid: socket.user.user_id, data })
    })

    socket.on('SendPostNotify', async (data) => {
        try {
            const FriendData = await FriendUser(userid)

            // อัพเดทโพสของ user คนอื่นไปตามที่โพสไปด้วย
            FriendData.forEach((item) => {
                io.to(userOnline[item._id]).emit('PostFeed', data)
            })

            const FriendId = FriendData.map((item) => item._id)

            // บันทึกลงฐานข้อมูลและ ส่งแจ้งเตือนให้ user คนอื่นเฉพาะเพื่อนเท่านั้น เมื่อโพส
            for (let item of FriendId) {
                try {
                    const createNotify = new Notify({
                        user: item,
                        content: data._id,
                        type: 'post'
                    })
                    await createNotify.save()
                    const currentNotify = await Notify.findById(createNotify._id).populate({
                        path: 'content',
                        populate: {
                            path: 'user',
                            select: '-password'
                        }
                    })
                    console.log('สำเร็จแจ้งเตือน')
                    if (userOnline[item]) {
                        io.to(userOnline[item]).emit('PostNotify', currentNotify)
                    } else {
                        console.log(`User ${item} not online for notify`)
                    }
                } catch (error) {
                    console.log('error to createing notify for user', item, error)
                }
            }
        } catch (error) {
            console.log('error SendPostNotify', error)
        }

    })

    socket.on('SendLikeNotify', async ({ postdata, userliked }) => {
        try {
            const targetid = postdata.user._id

            const notifydata = await Notify.findOneAndUpdate({
                user: targetid,
                content: postdata._id,
                type: 'like',
            }, {
                $set: {
                    createAt: Date.now(),
                    readByReceiver: false
                }
            }, {
                new: true,
                upsert: true
            }).populate({
                path: 'content',
                populate: [
                    { path: 'user', select: '-password' },
                    { path: 'likes.user', select: '-password' }
                ]
            })

            io.to(userOnline[targetid]).emit('LikeNotify', notifydata)
        } catch (error) {
            console.log('error to sendLike notify', error)
        }

    })

    socket.on('SendUnLikeNotify', async ({ postdata, userliked }) => {
        const targetuser = postdata.user._id
        io.to(userOnline[targetuser]).emit('UnLikeNotify', ({ userlikedId: userliked._id, postdata: postdata }))

    })

    socket.on('SendReadNotify', async (userid) => {
        try {
            const UpdateRead = await Notify.updateMany({
                user: new mongoose.Types.ObjectId(userid)
            }, {
                $set: {
                    readByReceiver: true
                }
            })
        } catch (error) {
            console.log(error)
        }

    })

    socket.on('DeletePost', async (postid) => {
        try {
            const FriendData = await FriendUser(userid)
            // DeletePost
            await Post.deleteMany({ _id: postid })

            // DeleteNotify
            await Notify.deleteMany({
                content: postid
            })

            FriendData.forEach((item) => {
                io.to(userOnline[item._id]).emit('DeletePostAlready', postid)
            })

            console.log('delete complete')

        } catch (error) {
            console.log(error)
        }
    })

    socket.on('AcceptFriendNotify', async (usertarget) => {
        try {
            const findcheck = await Notify.findOneAndDelete({
                user: usertarget._id,
                type: 'acceptfriend',
                userAccept: userid
            })

            const notifydataref = new Notify({
                user: usertarget._id,
                type: 'acceptfriend',
                userAccept: userid,
            })
            await notifydataref.save()

            const notifydata = await Notify.findById(notifydataref._id).populate('userAccept', '-password')
            io.to(userOnline[usertarget._id]).emit('AcceptNotify', notifydata)
        } catch (error) {
            console.log('errorAcceptFriend', error)
        }

    })




    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', (reason) => {
        console.log('User Disconnected: ' + (socket.user.email || socket.id));
        delete userOnline[socket.user.user_id]
        console.log('useronline', userOnline)
        console.log('reason', reason)
        UpdateStatus(socket.id, userid, 'offline')
        socket.broadcast.emit(('isUserOffline'), { userid, socketid: socket.id })
    });
});


