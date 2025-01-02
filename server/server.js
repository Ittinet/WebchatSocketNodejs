require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require('cors')
const socketIO = require('socket.io')
const connectDB = require('./config/mongodb')
const http = require('http')
const { readdirSync } = require("fs")
// const authRouter = require("./routes/auth")
// const categoryRouter = require("./routes/category")




const server = http.createServer(app)
const PORT = 8000



// middleware
app.use(morgan('dev'))
app.use(express.json())
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

module.exports = io;

let connectedUser = []

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('setname', (name) => {
        socket.username = name
        connectedUser.push(socket.username)
        io.emit('updateuser', connectedUser)
        console.log('connecteduser', connectedUser)
    })

    socket.on('chatuser', (data) => {
        const { sender, receiver, message } = data;
        if (connectedUser.includes(receiver)) {
            const room = [sender, receiver].sort().join('-')
            socket.join(room);
            console.log(`${sender} and ${receiver} are now in room: ${room}`);

            io.to(room).emit('chatMessageUser', {
                from: sender,
                message: message
            })
        } else {
            console.log(`User ${receiver} is not connected.`);
        }

    })

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', {
            from: socket.username,
            message: msg
        })
    })

    // เมื่อได้รับข้อความแชท

    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + (socket.username || socket.id));
        connectedUser = connectedUser.filter(item => item !== socket.username)
        io.emit('updateuser', connectedUser)
    });
});


// เก็บข้อมูลผู้ใช้ (เช่น ชื่อผู้ใช้) โดยใช้ socket.id เป็น key
// socket.on('set username', (username) => {
//     users[socket.id] = username;
//     console.log(users);
// });

// socket.on('private message', (data) => {
//     const { to, message } = data;

//     // ค้นหาว่าผู้ใช้ปลายทางมี socket.id อะไร
//     for (let socketId in users) {
//         if (users[socketId] === to) {
//             // ส่งข้อความไปยังผู้ใช้ที่ถูกต้อง
//             io.to(socketId).emit('private message', {
//                 from: users[socket.id],
//                 message: message
//             });

//             // ส่งข้อความให้กับผู้ส่งเองด้วย
//             io.to(socket.id).emit('private message', {
//                 from: users[socket.id],
//                 message: message
//             });
//             break;
//         }
//     }
// });
