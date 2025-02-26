const { Post } = require("../models/Schema")

exports.AddPost = async (req, res) => {
    try {
        const currentid = req.user.user_id
        const { images, content, shapeImage } = req.body
        const addpost = new Post({
            user: currentid,
            images,
            content,
            shapeImage
        })
        await addpost.save()

        const populatePost = await Post.findById(addpost._id).populate('user', '-password')
        res.status(200).json({
            message: "Postok",
            data: populatePost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetPost = async (req, res) => {
    try {
        const currentuser = req.user.user_id
        const postData = await Post.find().sort({ createAt: -1 }).populate('user comments.user likes.user', '-password')

        res.status(200).json({
            message: "Postok",
            postData: postData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.SendComment = async (req, res) => {
    try {
        const currentid = req.user.user_id
        const { postid, content } = req.body
        const SendComment = await Post.findByIdAndUpdate(postid, {
            $push: {
                comments: {
                    user: currentid,
                    content: content
                }
            }
        },
            { new: true }
        ).populate('comments.user', '-password')

        const CommentData = SendComment.comments[SendComment.comments.length - 1]


        res.status(200).json({
            CommentData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.LikePost = async (req, res) => {
    try {
        const currentid = req.user.user_id
        const { postid } = req.body
        const CheckPost = await Post.findById(postid).populate('likes.user', '-password')
        const CheckAlreadyLike = CheckPost.likes.find(item => item.user._id.equals(currentid));

        // unlike
        if (CheckAlreadyLike) {
            const updateUnlike = await Post.findByIdAndUpdate(postid,
                {
                    $pull: {
                        likes: {
                            user: currentid
                        }
                    }
                }, { new: true })



            return res.status(200).json({
                status: 'unlike',
                updateUnlike

            })
        }

        // like
        const updateLikePost = await Post.findByIdAndUpdate(postid, {
            $push: {
                likes: {
                    user: currentid,
                }
            }
        }, { new: true }
        ).populate('likes.user', '-password')
        res.status(200).json({
            status: 'like',
            updateLikePost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}