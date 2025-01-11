const { User, Order } = require("../models/Schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "กรุณาใส่ข้อมูลให้ครบ"
            })
        }

        const aleadyUser = await User.findOne({
            email: email
        })
        if (aleadyUser) {
            return res.status(401).json({
                message: 'ขออภัยมีอีเมลนี้อยู่ในระบบแล้ว!'
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const user = new User({
            email,
            username,
            password: hashpassword
        })

        await user.save()
        res.status(200).json({
            message: 'สมัครสมาชิกสำเร็จ!'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                message: "กรุณาใส่ข้อมูลให้ครบ"
            })
        }

        const checkuser = await User.findOne({
            email: email
        })

        if (!checkuser) {
            return res.status(401).json({
                message: "ไม่พบ email นี้ในระบบ"
            })
        }
        const checkhashpassword = await bcrypt.compare(password, checkuser.password)
        if (!checkhashpassword) {
            return res.status(401).json({
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง!"
            })
        }

        const payload = {
            email: email,
            user_id: checkuser._id
        }


        const createToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '10h', algorithm: 'HS256' })

        res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            token: createToken,
            payload: payload
        })
        console.log(checkhashpassword)


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.checklogin = async (req, res) => {
    try {
        const payload = req.user
        const user = await User.findOne({
            email: payload.email
        }).select('-password')
        if (!user) {
            return res.status(401).json({
                message: "Token ไม่ถูกต้อง"
            })
        }
        if (user.isactive !== "enabled") {
            return res.status(401).json({
                message: "Account นี้ถูกระงับชั่วคราวกรุณาติดต่อผู้ดูแล"
            })
        }

        res.status(200).json(
            user
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}




//การสร้าง order
//     const { email, password, orders } = req.body
//     const user = new User({
//         email: email,
//         password: password
//     })
//     await user.save()

//     if (orders && orders.length > 0) {
//         const orderDocument = orders.map(order => {
//             return new Order({
//                 ...order,
//                 userId: user._id
//             })
//         })
//         await Order.insertMany(orderDocument)

//         user.orders = orderDocument.map(order => order._id)
//         await user.save()
//     }