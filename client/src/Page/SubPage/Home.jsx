import { Ellipsis, Recycle, Trash, Trash2, X } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { ThumbsUp } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import PostWindow from "../../component/post/PostWindow";
import { useDispatch, useSelector } from "react-redux";
import { DeletePost, GetPost, RemoveLike, UpdateLike, UpdateLikeNotify } from "../../Reducers/postSlice";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears } from "date-fns";
import CommentWindow from "../../component/post/CommentWindow";
import axios from "axios";
import { useSocket } from "../../SocketContext";

const Home = () => {
    const dispatch = useDispatch()
    const { socket } = useSocket()
    const token = useSelector(state => state.auth.token)
    const postdata = useSelector(state => state.post.postdata)
    const loading = useSelector(state => state.post.loading)
    const currentuser = useSelector(state => state.user.currentuser)

    const [OpenPostWindow, setOpenPostWindow] = useState(false)
    const [CommentWindowData, setCommentWindowData] = useState(null)
    const [OpenPostMenu, setOpenPostMenu] = useState(null)

    const PostMenuRef = useRef()

    // close Postmenu
    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (OpenPostMenu && PostMenuRef.current && !PostMenuRef.current.contains(e.target)) {
                setOpenPostMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutSide)
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [OpenPostMenu])

    useEffect(() => {
        dispatch(GetPost(token))
        
        console.log('postData', postdata)
    }, [token])



    const timeAgo = (createAt) => {
        const now = new Date()
        const date = new Date(createAt)

        const diffInYears = differenceInYears(now, date)
        const diffInMonths = differenceInMonths(now, date)
        const diffInWeeks = differenceInWeeks(now, date)
        const diffInDays = differenceInDays(now, date)
        const diffInHours = differenceInHours(now, date)
        const diffInMinutes = differenceInMinutes(now, date)

        if (diffInYears > 0) {
            return `${diffInYears} ปีที่แล้ว`
        }
        if (diffInMonths > 0) {
            return `${diffInMonths} เดือนที่แล้ว`
        }
        if (diffInWeeks > 0) {
            return `${diffInWeeks} สัปดาห์ที่แล้ว`
        }
        if (diffInDays > 0) {
            return `${diffInDays} วันที่แล้ว`
        }
        if (diffInHours > 0) {
            return `${diffInHours} ชั่วโมงที่แล้ว`
        }
        if (diffInMinutes > 0) {
            return `${diffInMinutes} นาทีที่แล้ว`
        }

        return 'เมื่อสักครู่'
    }

    const handleChangeCommentInput = (e) => {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    const handleLikePost = async (post) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/like`, { postid: post._id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.status === 'like') {
                dispatch(UpdateLike({ currentuser: currentuser, postid: post._id }))
                socket.emit('SendLikeNotify', ({ postdata: post, userliked: currentuser }))
                console.log('post', post)
            } else {
                dispatch(RemoveLike({ postid: post._id, currentid: currentuser._id }))
                socket.emit('SendUnLikeNotify', ({ postdata: post, userliked: currentuser }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = (postid) => {
        socket.emit('DeletePost', (postid))
        dispatch(DeletePost(postid))
        setOpenPostMenu(null)
    }

    if (loading) {
        return (
            <div className="mt-5">
                กำลังโหลด...
            </div>
        )
    }

    return (
        <div className="mt-5 flex flex-col gap-5">
            {/* PostInput */}
            <div className="w-full bg-[#ffffff] rounded-xl p-4 px-4 drop-shadow-lg">
                <div className="flex gap-4">
                    <div>
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                            <img className="h-full w-full object-cover" src={currentuser?.profile_cropped} alt="" />
                        </div>
                    </div>

                    <button onClick={() => setOpenPostWindow(true)} className="bg-[#f3f3f3] w-full rounded-full px-5 flex items-center text-gray-400 hover:bg-[#eeeeee]">คุณกำลังคิดอะไรอยู่.....</button>
                </div>

                <button className="flex mt-2 justify-center items-center w-full hover:bg-[#f1f1f1] rounded-lg cursor-pointer">
                    <div className="py-3 flex gap-2 text-lg font-bold justify-center items-center">
                        <div className="max-w-10">
                            <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                        </div>
                        <p>รูปภาพ/วิดีโอ</p></div>

                </button>
            </div>

            <div className="space-y-7">

                {/* Content */}

                {
                    postdata.length > 0 && postdata.map((item, index) => {
                        const CheckAreadyLike = item.likes.find(item => item.user._id === currentuser._id)
                        const CheckcurrentUserPost = item.user._id === currentuser._id

                        return (
                            <div key={index} className='bg-white py-5 rounded-lg drop-shadow-lg'>
                                <div className="flex flex-col gap-3">
                                    {/* Header */}
                                    <div className="flex justify-between px-5 relative">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-full  overflow-hidden">
                                                <img className="w-full h-full object-cover" src={item.user.profile_cropped} alt="" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.user.username}</p>
                                                <p className="text-[12px] font-bold text-gray-500">{timeAgo(item.createAt)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setOpenPostMenu(item._id)} className="hover:bg-gray-100 w-10 h-10 p-2 flex justify-center items-center rounded-full hover:scale-110">
                                            <Ellipsis className="text-gray-700" size={42} />
                                        </button>

                                        {/* menu */}
                                        {
                                            (OpenPostMenu === item._id && CheckcurrentUserPost) &&
                                            <div ref={PostMenuRef} className="absolute bg-[#ffeaec] max-w-[200px] w-full right-[-10px] top-10 rounded-md shadow-md">
                                                <div className="flex flex-col">
                                                    <button onClick={() => handleDeletePost(item._id)} className="flex px-3 py-2 gap-3 text-lg items-center text-gray-700 hover:bg-[#ffe0e0]"><Trash2 /><p>ลบ</p></button>
                                                </div>
                                            </div>
                                        }


                                    </div>

                                    {/* Caption */}
                                    <div className="break-words px-5 mt-1">
                                        <p>{item.content}</p>
                                    </div>

                                    {/* image */}
                                    {
                                        item.images.length > 0 &&
                                        <div className="w-full flex justify-center">
                                            {
                                                // 1 รูป
                                                item.images.length > 0 && item.images.length === 1
                                                    ?
                                                    <div className="flex gap-1 px-2 max-w-[90%] w-full">
                                                        {
                                                            item.images.map((item, index) =>
                                                                <div key={index} className="w-full flex items-center justify-center bg-white">
                                                                    <div className="w-full h-full">
                                                                        <img className="h-full w-full object-cover" src={item} alt="" />
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    // 2 รูป
                                                    : item.images.length > 0 && item.images.length === 2
                                                        ?
                                                        <div className="flex gap-1 px-2">
                                                            {
                                                                item.images.map((item, index) =>
                                                                    <div key={index} className="w-full flex items-center justify-center bg-white">
                                                                        <div className="w-full h-full">
                                                                            <img className="h-full w-full object-cover" src={item} alt="" />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        // 3 รูปขึ้นไป
                                                        : item.images.length > 0 && item.images.length < 5
                                                            ?
                                                            <div className="w-full max-h-[800px] px-2 overflow-hidden">
                                                                {
                                                                    item.shapeImage
                                                                        ?
                                                                        // กรณีรูปมาเป็นแพทเทิร์นแนวตั้ง
                                                                        <div className="flex w-full h-full gap-1">
                                                                            <div className="w-3/5 h-full">
                                                                                <img className="w-full h-full object-cover" src={item.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-2/5 h-full flex flex-col gap-1">
                                                                                {
                                                                                    item.images.slice(1, 4).map((item, index) => (
                                                                                        <div key={index} className="w-full flex-1 flex items-center justify-center h-1/3">
                                                                                            <img className="w-full h-full object-cover" src={item} alt="" />
                                                                                        </div>
                                                                                    ))
                                                                                }

                                                                            </div>

                                                                        </div>
                                                                        // กรณีรูปมาเป็นแพทเทิร์นแนวนอน
                                                                        :
                                                                        <div className="flex flex-col w-full h-full gap-1">
                                                                            <div className="w-full">
                                                                                <img className="w-full h-full object-cover" src={item.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-full h-full flex gap-1">
                                                                                {
                                                                                    item.images.slice(1, 4).map((item, index) => (
                                                                                        <div key={index} className="w-full flex-1 max-h-[250px] flex items-center justify-center h-full">
                                                                                            <img className="w-full h-full object-cover" src={item} alt="" />
                                                                                        </div>
                                                                                    ))
                                                                                }

                                                                            </div>

                                                                        </div>
                                                                }
                                                            </div>

                                                            // 5 รูปขึ้นไป
                                                            :
                                                            <div className="w-full max-h-[800px] px-2 overflow-hidden">
                                                                {
                                                                    item.shapeImage
                                                                        ?
                                                                        // กรณีรูปมาเป็นแพทเทิร์นแนวตั้ง
                                                                        <div className="flex w-full h-full gap-1">
                                                                            <div className="w-3/5 h-full">
                                                                                <img className="w-full h-full object-cover" src={item.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-2/5 h-full flex flex-col gap-1">
                                                                                {
                                                                                    item.images.slice(1, 4).map((image, index) => (
                                                                                        index === 2
                                                                                            ?
                                                                                            <div key={index} className="w-full flex-1 flex items-center justify-center h-1/3 relative">
                                                                                                <img className="w-full h-full object-cover" src={image} alt="" />
                                                                                                <div className='bg-black opacity-40 w-full h-full absolute top-0 flex items-center justify-center z-10'></div>
                                                                                                <p className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-3xl font-bold text-white z-20 shadow-lg'>+{item.images.slice(4).length}</p>
                                                                                            </div>
                                                                                            :
                                                                                            <div key={index} className="w-full flex-1 flex items-center justify-center h-1/3">
                                                                                                <img className="w-full h-full object-cover" src={image} alt="" />
                                                                                            </div>
                                                                                    ))
                                                                                }

                                                                            </div>

                                                                        </div>
                                                                        // กรณีรูปมาเป็นแพทเทิร์นแนวนอน
                                                                        :
                                                                        <div className="flex flex-col w-full h-full gap-1">
                                                                            <div className="w-full">
                                                                                <img className="w-full h-full object-cover" src={item.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-full h-full flex gap-1">
                                                                                {
                                                                                    item.images.slice(1, 4).map((image, index) => (
                                                                                        index === 2
                                                                                            ?
                                                                                            <div key={index} className="w-full flex-1 max-h-[250px] flex items-center justify-center h-full relative">
                                                                                                <img className="w-full h-full object-cover" src={image} alt="" />
                                                                                                <div className='bg-black opacity-40 w-full h-full absolute top-0 flex items-center justify-center z-10'></div>
                                                                                                <p className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-3xl font-bold text-white z-20 shadow-lg'>+{item.images.slice(4).length}</p>
                                                                                            </div>
                                                                                            :
                                                                                            <div key={index} className="w-full flex-1 max-h-[250px] flex items-center justify-center h-full">
                                                                                                <img className="w-full h-full object-cover" src={image} alt="" />
                                                                                            </div>
                                                                                    ))
                                                                                }

                                                                            </div>

                                                                        </div>
                                                                }
                                                            </div>
                                            }
                                        </div>


                                    }


                                    {/* like people */}
                                    {
                                        (item.likes.length > 0 || item.comments.length > 0) &&
                                        <div className="px-5 mt-2 flex items-center">
                                            {
                                                item.likes.length > 0 &&
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-[20px] h-[20px] bg-blue-500 rounded-full flex justify-center items-center p-1">
                                                        <FontAwesomeIcon icon={faThumbsUp} className="size-3" color="white" />
                                                    </div>
                                                    <p className="text-gray-500 text-sm">{item.likes[item.likes.length - 1].user.username} {item.likes.length - 1 > 0 && `และคนอื่นๆ อีก ${item.likes.length - 1} คน`}</p>
                                                </div>
                                            }

                                            {
                                                item.comments.length > 0 && <p className="ml-auto text-md text-gray-600">{item.comments.length} ความคิดเห็น</p>
                                            }

                                        </div>
                                    }


                                    {/* menubar */}
                                    <div className="px-5">
                                        <div className="border-t border-b">

                                            <div className="px-5 pt-1 pb-1 w-full flex">

                                                <button onClick={() => handleLikePost(item)} className={`flex-1 flex items-center justify-center hover:bg-[#f3edfc] py-2 rounded-lg gap-2 cursor-pointer ${CheckAreadyLike ? 'text-[#c8a0fc]' : ''}`}>
                                                    <ThumbsUp className={`${CheckAreadyLike ? 'fill-[#c6bcff] stroke-[#c8b5fc]' : ''}`} size={18} />
                                                    <p>ถูกใจ</p>
                                                </button>

                                                <button onClick={() => setCommentWindowData(item)} className="flex-1 flex items-center justify-center hover:bg-[#f3edfc] py-2 rounded-lg gap-2 cursor-pointer">
                                                    <MessageCircle size={18} />
                                                    <p>แสดงความคิดเห็น</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* comment bar */}
                                    {
                                        item.comments.length > 0 &&
                                        <div className="px-5">
                                            <button className="text-gray-500 text-sm hover:font-bold">ดูความคิดเห็นเพิ่มเติม</button>

                                            {/* comment item */}
                                            <div className='flex gap-2 mt-3'>
                                                <div>
                                                    <div className="w-10 h-10 rounded-full  overflow-hidden">
                                                        <img className="w-full h-full object-cover" src={item.comments[0].user.profile_cropped} alt="" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='bg-[#f3f3ff] px-3 py-2 rounded-lg max-w-[500px]'>
                                                        <p className='text-[15px] font-bold text-gray-900'>{item.comments[0].user.username}</p>
                                                        <div className='text-[14px] text-gray-700 whitespace-pre-wrap break-words'>
                                                            {item.comments[item.comments.length - 1].content}
                                                        </div>
                                                    </div>
                                                    <div className='flex mt-2 ml-1'>
                                                        <p className='text-[12px] text-gray-700'>{timeAgo(item.comments[0].createAt)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* input comment */}
                                            <div className="flex gap-2 mt-5">
                                                <div>
                                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                                        <img className="w-full h-full object-cover" src={item.user.profile_cropped} alt="" />
                                                    </div>
                                                </div>

                                                <div className="w-full">
                                                    <textarea onChange={handleChangeCommentInput} placeholder="แสดงความคิดเห็น...." className="w-full bg-[#f3f3ff] resize-none rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#d7c1ff]" ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    }



                                </div>
                            </div >
                        )
                    }
                    )
                }




            </div >

            {/* PostWindow */}
            {
                OpenPostWindow && <PostWindow setOpenPostWindow={setOpenPostWindow} />
            }

            {/* CommentWindow */}
            {
                CommentWindowData && <CommentWindow data={CommentWindowData} setdata={setCommentWindowData} />
            }

        </div >
    )
}

export default Home