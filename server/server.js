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
app.use(express.json({ limit: '2mb' }))
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


io.on('connection', (socket) => {
    const userid = socket.user.user_id
    console.log('User Connected: ' + socket.user.email + ' ' + socket.id)

    UpdateStatus(socket.id, userid, 'online')

    socket.on('updateStatus', ({ userid, socketid }) => {
        socket.broadcast.emit(('isUserOnline'), { userid, socketid })
    })

    socket.on('SentMessage', (data) => {
        const { socketid, ...messagedata } = data;
        const { sender, ...messagedata1 } = data;

        io.to(socketid).emit('NewMessage', messagedata)
        io.to(socketid).emit('NotityfyChat', sender)
    })

    socket.on('AddFriend', (data) => {
        const { socketid, ...newRequest } = data
        console.log(newRequest)
        io.to(socketid).emit('newRequest', newRequest)
    })



    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('User Disconnected: ' + (socket.user.email || socket.id));
        UpdateStatus(socket.id, userid, 'offline')
        socket.broadcast.emit(('isUserOffline'), { userid, socketid: socket.id })
    });
});


