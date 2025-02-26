import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Ellipsis, MessageCircle, ThumbsUp } from "lucide-react"
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateComment } from '../../Reducers/postSlice';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';

const CommentWindow = ({ data, setdata }) => {

    const [TextInput, setTextInput] = useState('')
    const componentRef = useRef()
    const scrollRef = useRef()
    const TextInputRef = useRef()
    const token = useSelector(state => state.auth.token)

    const dispatch = useDispatch()

    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        console.log(data)
    }, [])

    // Close Comment Window
    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (componentRef.current && !componentRef.current.contains(e.target)) {
                setdata(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutSide)

        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [])

    const handleChange = (e) => {
        setTextInput(e.target.value)
        // ปรับขนาดของ textarea ให้พอดีกับเนื้อหาที่พิมพ์
        e.target.style.height = 'auto'; // รีเซ็ตความสูง
        e.target.style.height = `${e.target.scrollHeight}px`; // กำหนดความสูงใหม่ให้ตรงกับ scrollHeight

    }

    const handleSubmit = async () => {
        try {
            if (token) {
                if (!TextInput.trim()) {
                    return
                }
                const res = await axios.post(`http://localhost:8000/api/comment`, {
                    postid: data._id,
                    content: TextInput
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('ผลลัพจากการส่งคอมเม้น', res)

                dispatch(UpdateComment({ data: res.data.CommentData, postid: data._id }))
                setdata((prev) => ({ ...prev, comments: [...prev.comments, res.data.CommentData] }))
            }

        } catch (error) {
            console.log(error)
        } finally {
            setTextInput('')
            TextInputRef.current.style.height = 'auto'
        }
    }

    const handleKeyDownSubmit = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit()
        }
    }

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

    return (
        <div className="">
            {/* Background */}
            <div className="fixed w-full h-full bg-black opacity-70 top-0 left-0 z-[998]"></div>

            {/* Content */}
            <div ref={componentRef} className="fixed max-w-[680px] min-w-[450px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[999] bg-white rounded-xl overflow-hidden">
                <div className="space-y-5 relative">
                    {/* header */}
                    <div className="px-5 py-5 w-full text-center border-b bg-[#ede4fd]">
                        <p className="font-bold text-xl text-gray-600">โพสของ อิทธิเนตร</p>
                    </div>

                    {/* Content */}

                    <div ref={scrollRef} className='overflow-y-auto h-[80vh]'>

                        {/* PostContent */}
                        <div>
                            <div className='bg-white py-5 rounded-lg '>
                                <div className="flex flex-col gap-3">
                                    {/* Header */}
                                    <div className="flex justify-between px-5">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-full  overflow-hidden">
                                                <img className="w-full h-full object-cover" src={data.user.profile_cropped} alt="" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{data.user.username}</p>
                                                <p className="text-[12px] font-bold text-gray-500">1ชม</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Ellipsis />
                                        </div>
                                    </div>

                                    {/* Caption */}
                                    <div className="break-words px-5 mt-1">
                                        <p>{data.content}</p>
                                    </div>

                                    {/* image */}
                                    {
                                        data.images.length > 0 &&
                                        <div className="w-full flex justify-center">
                                            {
                                                // 1 รูป
                                                data.images.length > 0 && data.images.length === 1
                                                    ?
                                                    <div className="flex gap-1 px-2 max-w-[90%] w-full">
                                                        {
                                                            data.images.map((item, index) =>
                                                                <div key={index} className="w-full flex items-center justify-center bg-white">
                                                                    <div className="w-full h-full">
                                                                        <img className="h-full w-full object-cover" src={item} alt="" />
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    // 2 รูป
                                                    : data.images.length > 0 && data.images.length === 2
                                                        ?
                                                        <div className="flex gap-1 px-2">
                                                            {
                                                                data.images.map((item, index) =>
                                                                    <div key={index} className="w-full flex items-center justify-center bg-white">
                                                                        <div className="w-full h-full">
                                                                            <img className="h-full w-full object-cover" src={item} alt="" />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        // 3 รูปขึ้นไป
                                                        : data.images.length > 0 && data.images.length > 2
                                                            ?
                                                            <div className="w-full px-2 overflow-hidden">
                                                                {
                                                                    data.shapeImage
                                                                        ?
                                                                        // กรณีรูปมาเป็นแพทเทิร์นแนวตั้ง
                                                                        <div className="flex w-full h-full gap-1">
                                                                            <div className="w-3/5 h-full">
                                                                                <img className="w-full h-full object-cover" src={data.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-2/5 h-full flex flex-col gap-1">
                                                                                {
                                                                                    data.images.slice(1).map((item, index) => (
                                                                                        <div key={index} className="w-full flex-1 max-h-[220px] flex items-center justify-center h-full">
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
                                                                                <img className="w-full h-full object-cover" src={data.images[0]} alt="" />
                                                                            </div>

                                                                            <div className="w-full h-full flex gap-1">
                                                                                {
                                                                                    data.images.slice(1).map((item, index) => (
                                                                                        <div key={index} className="w-full flex-1 max-h-[250px] flex items-center justify-center h-full">
                                                                                            <img className="w-full h-full object-cover" src={item} alt="" />
                                                                                        </div>
                                                                                    ))
                                                                                }

                                                                            </div>

                                                                        </div>
                                                                }
                                                            </div>
                                                            : ''
                                            }
                                        </div>
                                    }


                                    {/* like people */}
                                    {
                                        data.likes.length > 0 &&
                                        <div className="px-5 mt-2">
                                            <div className="flex gap-2 items-center">
                                                <div className="w-[20px] h-[20px] bg-blue-500 rounded-full flex justify-center items-center p-1">
                                                    <FontAwesomeIcon icon={faThumbsUp} className="size-3" color="white" />
                                                </div>
                                                <p className="text-gray-500 text-sm">Siriwan Tawong และคนอื่นๆ อีก 28 คน</p>
                                            </div>
                                        </div>
                                    }


                                    {/* menubar */}
                                    <div className="px-5">
                                        <div className="border-t">

                                            <div className="px-5 pt-2 w-full flex">

                                                <button className="flex-1 flex items-center justify-center hover:bg-[#f3edfc] py-2 rounded-lg gap-2 cursor-pointer">
                                                    <ThumbsUp size={18} />
                                                    <p>ถูกใจ</p>
                                                </button>

                                                <button className="flex-1 flex items-center justify-center hover:bg-[#f3edfc] py-2 rounded-lg gap-2 cursor-pointer">
                                                    <MessageCircle size={18} />
                                                    <p>แสดงความคิดเห็น</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>


                        {/* CommentWindow */}
                        <div>
                            <div className='px-4 space-y-6 mb-[140px]'>
                                {/* commentitem */}
                                {
                                    data.comments.length > 0 &&
                                    data.comments.map((item, index) =>
                                        <div key={index} className='flex gap-2'>
                                            <div>
                                                <div className="w-12 h-12 rounded-full  overflow-hidden">
                                                    <img className="w-full h-full object-cover" src={item.user.profile_cropped} alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className='bg-[#efe7fd] px-3 py-2 rounded-lg max-w-[500px]'>
                                                    <p className='text-[15px] font-bold text-gray-900'>{item.user.username}</p>
                                                    <div className='text-[14px] text-gray-700 whitespace-pre-wrap break-words'>
                                                        {item.content}
                                                    </div>
                                                </div>
                                                <div className='flex mt-2 ml-1'>
                                                    <p className='text-[12px] text-gray-700'>{timeAgo(item.createAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>

                    </div>

                    {/* CommentInput */}
                    <div className='absolute bottom-0 w-full'>
                        <div className='px-3 py-4 flex gap-3 items-center bg-[#ebe7ff] relative'>
                            <div className='absolute top-3'>
                                <div className="w-12 h-12 rounded-full  overflow-hidden">
                                    <img className="w-full h-full object-cover" src={data.user.profile_cropped} alt="" />
                                </div>
                            </div>
                            <div className='w-full ml-14'>
                                <textarea ref={TextInputRef} onKeyDown={handleKeyDownSubmit} onChange={handleChange} value={TextInput} className='bg-[#fcf8ff] w-full py-3 px-3 rounded-xl resize-none h-auto shadow-md focus:outline-none focus:ring-2 focus:ring-[#d7c1ff]' placeholder='แสดงความคิดเห็น.....' />
                            </div>
                        </div>
                    </div>
                </div >

            </div >
        </div >

    )
}

export default CommentWindow