const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowcase: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    profile_picture: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/1458201.png?alt=media&token=bde36c76-5b9f-4ca9-a9ae-39fa484203bc'
    },
    role: {
        type: String,
        default: "user"
    },
    last_active: {
        type: Date,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    isactive: {
        type: String,
        enum: ['enabled', 'disabled'],
        default: "enabled"
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    friendrequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
})

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    timestamp: { type: Date, default: Date.now }
});

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'accepted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    messageContent: {
        type: String,
        require: true
    },
    timestamp: { type: Date, default: Date.now },
    readByReceiver: {
        type: Boolean, default: false
    }
})

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true

    },
    images: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        require: true
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: { type: String },
        createAt: { type: Date, default: Date.now }
    }],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
        },
        type: {
            type: String,
            enum: ['like', 'love', 'sad', 'laugh']
        }
    }],
    createAt: {
        type: Date,
        default: Date.now
    }


})


exports.Message = mongoose.model('Message', messageSchema)
exports.FriendRequest = mongoose.model('FriendRequest', friendRequestSchema)
exports.User = mongoose.model('User', userSchema)
exports.Friendship = mongoose.model('FriendShip', friendshipSchema)
exports.Post = mongoose.model('Post', postSchema)








// exports.Order = mongoose.model('Order', orderSchema)



// const orderSchema = new mongoose.Schema({
//     productName: String,
//     totalPrice: {
//         type: Number,
//         require: true,
//         min: [0, 'ราคาต้องมากกว่า 0']
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     createAt: {
//         type: Date,
//         default: Date.now
//     }
// })