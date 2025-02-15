const jwt = require("jsonwebtoken")
require('dotenv').config()

exports.checkUser = async (req, res, next) => {
    try {
        const tokenHeaders = req.headers.authorization
        if (!tokenHeaders) {
            return res.status(401).json({
                message: 'ไม่พบ Token กรุณา Login',
                stack: error.stack
            })
        }
        const token = tokenHeaders.split(" ")[1]

        const checktoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log('Middleware CheckUser')
        // console.log(checktoken)
        req.user = checktoken
        next()

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Token Invalid",
            stack: error.stack
        })
    }
}