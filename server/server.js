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
const { User } = require('./models/Schema');
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
    cors: {
        origin: "*"
    }
})



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




    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('User Disconnected: ' + (socket.user.email || socket.id));
        delete userOnline[socket.user.user_id]
        console.log('useronline', userOnline)
        UpdateStatus(socket.id, userid, 'offline')
        socket.broadcast.emit(('isUserOffline'), { userid, socketid: socket.id })
    });
});




// let userOnline = {}

// io.on('connection', (socket) => {
//     const userid = socket.user.user_id
//     console.log('User Connected: ' + socket.user.email + ' ' + socket.id)
//     UpdateStatus(socket.id, userid, 'online')
//     userOnline[socket.user.user_id] = socket.id
//     console.log('useronline', userOnline)
//     console.log('test', userOnline[socket.user.user_id])

//     socket.on('updateStatus', ({ userid, socketid }) => {
//         socket.broadcast.emit(('isUserOnline'), { userid, socketid })
//     })

//     socket.on('SentMessage', (data) => {
//         const { socketid, ...messagedata } = data; //แยก socketid ออก จาก data เพื่อส่งเฉพาะข้อมูลอื่นไป

//         io.to(socketid).emit('NewMessage', messagedata)
//         io.to(socketid).emit('NotityfyChat', data.sender)
//     })

//     socket.on('AddFriend', (data) => {
//         const { socketid, ...newRequest } = data
//         console.log(newRequest)
//         io.to(socketid).emit('newRequest', newRequest)
//     })




//     // เมื่อผู้ใช้ตัดการเชื่อมต่อ
//     socket.on('disconnect', () => {
//         console.log('User Disconnected: ' + (socket.user.email || socket.id));
//         delete userOnline[socket.user.user_id]
//         console.log('useronline', userOnline)
//         UpdateStatus(socket.id, userid, 'offline')
//         socket.broadcast.emit(('isUserOffline'), { userid, socketid: socket.id })
//     });
// });
