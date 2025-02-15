const { default: mongoose } = require("mongoose")
const { Message, User } = require("../models/Schema")

exports.SentMessage = async (req, res) => {
    try {
        const { receiver, message } = req.body
        const sender = req.user.user_id

        if (!message) {
            return res.status(401).json({
                message: 'Cannot empty message !!'
            })
        }
        if (!mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(401).json({
                message: 'ข้อมูลไม่ถูกต้อง'
            })
        }

        const CheckReceiver = await User.findOne({
            _id: receiver
        })


        if (!CheckReceiver) {
            return res.status(401).json({
                message: 'ไม่พบยูสเซอร์ปลายทาง !'
            })
        }

        const CreateMessage = new Message({
            sender: sender,
            receiver: receiver,
            messageContent: message
        })

        await CreateMessage.save()

        const datamessage = await Message.findById(CreateMessage._id).populate('sender receiver', '-password')

        res.status(200).json({
            message: "Message Sent Succesfully",
            datamessage: datamessage
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

//รับ id ของ user ที่ต้องการดึงแชทผ่าน params
exports.GetMessage = async (req, res) => {
    try {
        const senderId = req.user.user_id
        const receiverId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(401).json({
                message: 'ข้อมูลไม่ถูกต้อง'
            })
        }

        const checkReceiver = await User.findOne({
            _id: receiverId
        })

        if (!checkReceiver) {
            return res.status(401).json({
                message: 'ไม่พบยูสเซอร์ปลายทาง'
            })
        }

        const message = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).populate('sender', '-password').sort({ createAt: 1 })

        res.status(200).json({
            message: message
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetLastMessage = async (req, res) => {
    try {
        const currentid = req.user.user_id
        const GroupMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(req.user.user_id) },
                        { receiver: new mongoose.Types.ObjectId(req.user.user_id) }
                    ]
                }
            },
            {
                $addFields: {
                    chatgroup: {
                        $cond: {
                            if: { $lt: [{ $toObjectId: "$sender" }, { $toObjectId: "$receiver" }] },
                            then: { $concat: [{ $toString: "$sender" }, "-", { $toString: "$receiver" }] },
                            else: { $concat: [{ $toString: "$receiver" }, "-", { $toString: "$sender" }] }
                        }
                    }
                }
            },
            { $sort: { "createAt": 1 } },
            {
                $group: {
                    _id: "$chatgroup",
                    messages: { $last: "$$ROOT" }, //ถ้าจะเอาัท้งหมดตั้งแต่ตัวแรกยันตัวท้าายใช้ $push ถ้าแค่ตัวแรกใช้ $first
                }
            },
            { $sort: { "messages.createAt": -1 } },
            {
                $project: {
                    "messages.chatgroup": 0 //ลบตัว chatgroup ที่ทำไว้ตอนแรกออกเพื่อไม่ให้รก
                }
            }
        ]);


        const populatedMessages = await Message.populate(GroupMessages, [
            { path: 'messages.sender', model: 'User', select: '-password' },
            { path: 'messages.receiver', model: 'User', select: '-password' }
        ]);

        const updateMessages = populatedMessages.map((item) => {
            if (String(item.messages.receiver._id) === String(currentid)) {
                const updateData = { ...item, messages: { ...item.messages, targetuser: item.messages.sender } }
                return updateData
            } else {
                const updateData = { ...item, messages: { ...item.messages, targetuser: item.messages.receiver } }
                return updateData
            }
        })


        res.status(200).json({
            LastMessages: updateMessages,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

exports.ReadMessage = async (req, res) => {
    try {
        const currentuserid = req.user.user_id
        const targetuserid = req.params.id

        const updateRead = await Message.updateMany({ sender: targetuserid, receiver: currentuserid },{
            $set: {
                readByReceiver: true
            }
        })

        res.status(200).json({
            message: "updateok",
            data: updateRead,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}
