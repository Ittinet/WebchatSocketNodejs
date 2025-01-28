require('dotenv').config()
const jwt = require('jsonwebtoken')
const io = require('../server')
const { User, FriendRequest, Friendship } = require('../models/Schema')
const { default: mongoose } = require('mongoose')
const cloudinary = require('cloudinary').v2
require('dotenv').config

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


exports.GetUser = async (req, res) => {
    try {
        const UserData = await User.find().select('-password')
        res.status(200).json({
            message: 'ok',
            user: UserData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}


exports.SeachUser = async (req, res) => {
    try {
        const query = req.query.query

        if (!query) {
            return res.status(200).json({
                message: 'ไม่พบผลลัพธ์'
            })
        }

        const UserData = await User.find({ username: { $regex: `^${query}`, $options: 'i' } })
            .select('-password')
            .limit(10);

        // if (UserData.length <= 0) {
        //     return res.status(401).json({
        //         message: 'ไม่พบข้อมูล'
        //     })
        // }

        res.status(200).json(UserData)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetCurrentUser = async (req, res) => {
    try {
        const payload = req.user
        const userid = payload.user_id
        const userData = await User.findById(userid).select('-password')
        if (!userData || userData.length <= 0) {
            return res.status(401).json({
                message: "ไม่พบข้อมูลยูสเซอร์ของคุณ"
            })
        }
        res.status(200).json({
            userData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.AddFriend = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body
        const userid = req.user.user_id

        if (senderId !== userid) {
            return res.status(401).json({
                message: "เกิดข้อผิดพลาดบางอย่าง"
            })
        }
        const AleadyRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })

        if (AleadyRequest) {
            if (AleadyRequest.status === "accepted") {
                return res.status(401).json({
                    message: "คุณได้เป็นเพื่อนกับบุคคลนี้อยู่แล้ว"
                })
            }

            if (AleadyRequest.status === "pending") {
                return res.status(401).json({
                    message: "ขณะนี้มีคำขอนี้อยู่แล้ว"
                })
            }
        }


        const CheckUser = await User.findById(receiverId)

        if (!CheckUser) {
            return res.status(401).json({
                message: "ไม่พบยูสเซอร์ที่ต้องการส่งคำขอ"
            })
        }





        const newRequestRef = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        })

        await newRequestRef.save()

        const newRequest = await FriendRequest.findById(newRequestRef._id).populate('receiver', '-password').populate('sender', '-password')
        res.status(200).json({
            message: "ok",
            newRequest: newRequest
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetRequest = async (req, res) => {
    try {
        const usercurrentid = req.user.user_id
        const requestData = await FriendRequest.find({
            receiver: usercurrentid,
            status: "pending"
        }).populate('sender receiver', '-password')

        res.status(200).json({
            message: "ok",
            data: requestData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }

}

exports.AcceptRequest = async (req, res) => {
    try {
        const { id } = req.params
        const userCurrentId = req.user.user_id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ไม่พบรายชื่อบุคคลนี้ในระบบ"
            });
        }

        const checkrequest = await FriendRequest.findOne({
            sender: id,
            receiver: userCurrentId,
            status: "pending"
        })


        if (!checkrequest) {
            return res.status(400).json({
                message: "ไม่มีพบคำขอนี้"
            })
        }

        // if (checkrequest.status === 'accepted') {
        //     return res.status(400).json({ message: "คำขอนี้ได้รับการตอบกลับแล้ว" })
        // }

        const CheckFriendShip = await Friendship.findOne({
            $or: [
                { user1: userCurrentId, user2: id },
                { user1: id, user2: userCurrentId }
            ]
        })
        if (CheckFriendShip) {
            return res.status(400).json({
                message: "มีรายชื่อนี้อยู่ในเพื่อนแล้ว"
            })
        }
        checkrequest.status = "accepted"
        await checkrequest.save()

        const CreateFriendShip = new Friendship({
            user1: id,
            user2: userCurrentId
        })

        await CreateFriendShip.save()

        res.json({
            message: "ตอบรับคำขอเป็นเพื่อนสำเร็จ",
            request_id: checkrequest._id
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.RejectRequest = async (req, res) => {
    try {
        const { id } = req.params
        const currentUserId = req.user.user_id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ไม่พบรายชื่อบุคคลนี้ในระบบ"
            });
        }

        const CheckRequest = await FriendRequest.findOne({
            sender: id,
            receiver: currentUserId
        })
        if (!CheckRequest) {
            return res.status(400).json({
                message: "ไม่พบคำขอนี้"
            })
        }

        if (CheckRequest.status !== "pending") {
            return res.status(400).json({
                message: "คุณได้เป็นเพื่อนกับบุคคลนี้อยู่แล้ว"
            })
        }

        const deletedRequest = await FriendRequest.findOneAndDelete({
            sender: id,
            receiver: currentUserId
        })


        //ทำต่อให้เสร็จ 
        res.status(200).json({
            message: "reject complete",
            request_id: deletedRequest._id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetFirend = async (req, res) => {
    try {
        const currentuser = req.user.user_id
        const friendData = await Friendship.find({
            $and: [
                {
                    $or: [
                        { user1: currentuser },
                        { user2: currentuser }
                    ]
                },
                { status: 'accepted' }
            ]
        }).sort({ createdAt: -1 }).populate('user1 user2', '-password -role')

        if (friendData.length <= 0) {
            return res.status(200).json({
                message: "ไม่พบเพื่อนของคุณ",
                friend: friendData
            })
        }

        const Friends = friendData.map((item) => {
            if (currentuser === item.user1._id.toString()) {
                return item.user2
            } else {
                return item.user1
            }
        })

        res.status(200).json({
            message: "ok",
            friend: Friends
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.DeleteFriend = async (req, res) => {
    try {
        const currentuser = req.user.user_id
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ไม่พบรายชื่อบุคคลนี้ในระบบ"
            });
        }

        const CheckFriend = await Friendship.findOne({
            $or: [
                { user1: currentuser, user2: id },
                { user1: id, user2: currentuser }
            ]
        })
        if (!CheckFriend) {
            return res.status(401).json({
                message: "บุคคลนี้ถูกลบออกจากรายชื่อเพื่อนไปแล้ว"
            })
        }

        const DeleteFriend = await Friendship.findOneAndDelete({
            $or: [
                { user1: currentuser, user2: id },
                { user1: id, user2: currentuser }
            ]
        })

        const DeleteRequest = await FriendRequest.findOneAndDelete({
            $or: [
                { sender: currentuser, receiver: id },
                { sender: id, receiver: currentuser }
            ]
        })

        res.status(200).json({
            message: "delete complete",
            DeleteFriend,
            DeleteRequest
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }

}

exports.GetProfileUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ไม่พบรายชื่อบุคคลนี้ในระบบ"
            });
        }

        const userData = await User.findOne({
            _id: id
        }).select('-password -role')


        res.status(200).json({
            message: 'ok',
            userData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetAlreadySent = async (req, res) => {
    try {
        const id = req.user.user_id
        const sentData = await FriendRequest.find({
            sender: id,
            status: "pending"
        })
        res.status(200).json({
            sentData
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }

}

exports.CancleRequest = async (req, res) => {
    try {
        const currentId = req.user.user_id
        const UserTargetId = req.params.id
        const SentAlready = await FriendRequest.findOne({
            sender: currentId,
            receiver: UserTargetId
        })

        if (!SentAlready) {
            return res.status(401).json({
                message: "คำขอนี้ได้ถูกลบไปแล้ว !!"
            })
        }

        await FriendRequest.deleteOne({
            _id: SentAlready._id
        })
        res.status(200).json({
            message: "Delete Success",
            SentAlready
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
    // ทำต่อให้เสร็จ
}


exports.AddProFile = async (req, res) => {
    try {
        const { image, imagecropped } = req.body
        const userid = req.user.user_id

        const resultImage = await cloudinary.uploader.upload(image, {
            public_id: `User-${userid}`,
            resource_type: 'auto',
            folder: "ChatApp01-Profile",
            overwrite: true
        })

        const resultImageCropped = await cloudinary.uploader.upload(imagecropped, {
            public_id: `User-Crop-${userid}`,
            resource_type: 'auto',
            folder: "ChatApp01-Profile",
            overwrite: true
        })

        if (resultImage || resultImageCropped) {
            const UpdataProfile = await User.findByIdAndUpdate({ _id: userid }, {
                $set: {
                    profile_picture: resultImage.url,
                    profile_cropped: resultImageCropped.url

                }
            }, { new: true })
        }

        // const imageurl = await cloudinary.url(`ChatApp01-Profile/User-${userid}`) //การ Get รูปภาพจาก publicId

        res.status(200).json({
            message: 'Update Profile Success',
            resultImage,
            resultImageCropped
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

