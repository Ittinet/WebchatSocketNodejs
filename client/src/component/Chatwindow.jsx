import { Check, ChevronDown, Minus, Phone, Video, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { ExistChat, ReadMessage, UpdateLastMessage } from '../Reducers/chatSlice'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useSocket } from '../SocketContext'
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears, format, isSameDay } from 'date-fns'
import { th } from 'date-fns/locale'



const Chatwindow = ({ chatData }) => {
    const { socket } = useSocket()
    const dispatch = useDispatch()
    const MessageScrollRef = useRef()
    const [MessageFindCheck, setMessageFindCheck] = useState(null)



    const token = useSelector(state => state.auth.token)
    const user = useSelector(state => state.auth.user)
    const currentuser = useSelector(state => state.user.currentuser)
    const LastMessage = useSelector(state => state.chat.LastMessage)

    const [LastActive, setLastActive] = useState('')
    const [MessageInput, setMessageInput] = useState('')
    const [MessageData, setMessageData] = useState([])

    console.log('messagecheck', MessageFindCheck)
    console.log('lastmessage', LastMessage)

    useEffect(() => {
        if (LastMessage.length > 0 && token) {
            const messageFind = LastMessage.find((item) => item.messages.targetuser._id === chatData._id)
            if (messageFind) {
                setMessageFindCheck(messageFind)
                if (messageFind.messages.targetuser._id === chatData._id && messageFind.messages.sender._id === chatData._id && !messageFind.messages.readByReceiver) {
                    dispatch(ReadMessage({ token, targetuser: chatData._id }))
                    socket.emit('ReadMessage', chatData._id)
                    console.log('test', messageFind)
                }
            }
        }
    }, [chatData._id, LastMessage])

    useEffect(() => {
        socket.on('ReadByReceiver', () => {
            console.log('read already')
            setMessageFindCheck((prev) => ({ ...prev, messages: { ...prev.messages, readByReceiver: true } }))
        })
    }, [])

    useEffect(() => {
        socket.on('NewMessage', (data) => {
            console.log('data', data)
            if (data.sender._id === chatData._id) {
                setMessageData((prev) => {
                    if (!prev.some(item => item._id === data._id)) {
                        return [...prev, data]
                    }
                    return prev
                })

            }


        })
    }, [])

    // console.log('testDate', new Date())
    // console.log('messagedata', MessageData)

    const handleSendMessage = async () => {
        try {
            if (!MessageInput.trim()) {
                return
            }
            const res = await axios.post('http://localhost:8000/api/message', {
                sender: user.user_id,
                receiver: chatData._id,
                message: MessageInput
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('chatdata', chatData)
            console.log('datamessage', res.data.datamessage)


            socket.emit('SentMessage', {
                ...res.data.datamessage,
            })
            setMessageInput('')
            setMessageData((prev) => [...prev, res.data.datamessage])
            dispatch(UpdateLastMessage(res.data.datamessage))
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyDownSendMessage = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSendMessage()
        }
    }


    const handleGetMessage = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/message/${chatData._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(res.data.message)
            setMessageData(res.data.message)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetMessage()
    }, [token, user.user_id])

    useEffect(() => {
        if (MessageScrollRef.current) {
            MessageScrollRef.current.scrollIntoView({ behavior: 'auto' })
        }
    }, [MessageData, MessageFindCheck])

    useEffect(() => {
        if (chatData && chatData.last_active) {
            setLastActive(ShowLastActive(chatData.last_active))

            const intervalId = setInterval(() => {
                setLastActive(ShowLastActive(chatData.last_active))
            }, 60000);

            return () => clearInterval(intervalId)
        }
    }, [chatData])

    let prevTimestamp = null
    const editTime = (timestamp, prevtimestamp) => {
        const currentDate = new Date()
        const lastDate = new Date(timestamp)
        const prevDate = prevtimestamp ? new Date(prevTimestamp) : null

        const diffInHours = differenceInHours(currentDate, lastDate)
        const diffInDays = differenceInDays(currentDate, lastDate)
        const diffInWeek = differenceInWeeks(currentDate, lastDate)
        const diffInMonths = differenceInMonths(currentDate, lastDate)
        const diffInYears = differenceInYears(currentDate, lastDate)

        const diffInMinutes = prevDate ? differenceInMinutes(lastDate, prevDate) : null
        if (diffInMinutes > 30 || !prevDate) {
            if (diffInYears > 0) {
                return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
            }
            if (diffInMonths > 0) {
                return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
            }
            if (diffInWeek > 0) {
                return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
            }
            if (diffInDays > 0) {
                return format(lastDate, 'eeee HH:mm', { locale: th })
            }
            if (!isSameDay(currentDate, lastDate)) {
                return format(lastDate, 'eeee HH:mm น.', { locale: th });
            }
            return format(lastDate, 'HH:mm', { locale: th })

        }

        return null
    }

    const ShowTitleTime = (timestamp) => {
        const lastDate = new Date(timestamp)
        const currentDate = new Date()
        const diffInHours = differenceInHours(currentDate, lastDate)
        const diffInDays = differenceInDays(currentDate, lastDate)
        const diffInWeek = differenceInWeeks(currentDate, lastDate)
        const diffInMonths = differenceInMonths(currentDate, lastDate)
        const diffInYears = differenceInYears(currentDate, lastDate)

        if (diffInYears > 0) {
            return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
        }
        if (diffInMonths > 0) {
            return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
        }
        if (diffInWeek > 0) {
            return format(lastDate, 'dd MMM yyyy HH:mm', { locale: th })
        }
        if (diffInDays > 0) {
            return format(lastDate, 'eeee HH:mm', { locale: th })
        }
        if (!isSameDay(currentDate, lastDate)) {
            return format(lastDate, 'eeee HH:mm น.', { locale: th });
        }
        return format(lastDate, 'HH:mm', { locale: th })

    }

    const ShowLastActive = (timestamp) => {
        const Datenow = new Date()
        const lastActive = new Date(timestamp)

        const diffInYear = differenceInYears(Datenow, lastActive)
        const diffInMonth = differenceInMonths(Datenow, lastActive)
        const diffInWeek = differenceInWeeks(Datenow, lastActive)
        const diffInDay = differenceInDays(Datenow, lastActive)
        const diffInHours = differenceInHours(Datenow, lastActive)
        const diffInMinutes = differenceInMinutes(Datenow, lastActive)

        if (diffInYear > 0) {
            return `ใช้งานเมื่อ ${diffInYear} ปีที่แล้ว`
        }
        if (diffInMonth > 0) {
            return `ใช้งานเมื่อ ${diffInMonth} เดือนที่แล้ว`
        }
        if (diffInWeek > 0) {
            return `ใช้งานเมื่อ ${diffInWeek} สัปดาห์ที่แล้ว`
        }
        if (diffInDay > 0) {
            return `ใช้งานเมื่อ ${diffInDay} วันที่แล้ว`
        }
        if (diffInHours > 0) {
            return `ใช้งานเมื่อ ${diffInHours} ชั่วโมงที่แล้ว`
        }
        if (diffInMinutes > 0) {
            return `ใช้งานเมื่อ ${diffInMinutes} นาทีที่แล้ว`
        }
        return 'ใช้งานเมื่อ 1 นาทีที่แล้ว'
    }





    if (!chatData) {
        return null
    }


    return (
        <div>{/* Chatwindow */}
            <div>
                <div>
                    {/* Mainbody */}
                    <div className='w-[380px]'>
                        {/* header */}
                        <div className='bg-[#e1bffd] rounded-t-lg drop-shadow-md'>
                            <div className='relative'>
                                <div className='flex gap-2 w-[60%] rounded-t-lg'>
                                    <div className='hover:bg-[#c7a6ec] p-1 rounded-lg py-2 px-2 relative'>
                                        <div className='w-[40px] h-[40px] flex items-center justify-center overflow-hidden rounded-full'>
                                            <img className='object-cover' src={chatData.profile_cropped} alt="" />
                                        </div>
                                        {/* onActive */}
                                        {
                                            chatData.status === 'online' && <div className='w-3 h-3 bg-green-400 border rounded-full absolute right-2 bottom-2'></div>
                                        }

                                    </div>
                                    <div className='w-[60%] space-y-[-2px] py-2 flex flex-col justify-center'>
                                        <p className='font-bold truncate'>{chatData.username}</p>
                                        {
                                            chatData.status === 'online'
                                                ? <p className='text-[13px] text-gray-600 truncate'>กำลังใช้งาน</p>
                                                : <p className='text-[13px] text-gray-600 truncate'>{LastActive}</p>
                                        }
                                    </div>
                                    <div className='flex items-center'>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                                <div className='flex items-center absolute right-[10px] top-3'>
                                    <button className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Phone size={20} />
                                    </button>
                                    <button className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Video size={20} />
                                    </button>
                                    <button className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Minus size={20} />
                                    </button>
                                    <button onClick={() => dispatch(ExistChat(chatData._id))} className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* body */}
                        <div className='h-[450px] bg-[#e5e5fd] py-5 px-2 overflow-auto'>
                            <div className='space-y-3'>

                                {/* Sent-Receiver */}
                                {
                                    MessageData.length > 0 && MessageData.map((item, index) => {
                                        const showTime = editTime(item.createAt, prevTimestamp)
                                        prevTimestamp = item.createAt
                                        return (
                                            <div key={index}>
                                                {
                                                    showTime && <div className='w-full flex items-center justify-center my-5 text-[12px] font-bold text-gray-600'>{showTime}</div>
                                                }
                                                <div className={`flex gap-1 ${item.sender._id === user.user_id ? 'flex-row-reverse' : ''}`}>
                                                    <div className='p-1'>
                                                        {
                                                            item.sender._id !== user.user_id
                                                                ? <div className='w-9 h-9 flex justify-center items-center  rounded-full overflow-hidden'>
                                                                    <img className='object-cover' src={chatData.profile_cropped} alt="" />
                                                                </div>
                                                                : ''
                                                        }

                                                    </div>

                                                    <div className='max-w-[250px] break-words'>
                                                        <div className='flex relative group'>
                                                            <div className={`${item.sender._id === user.user_id ? 'bg-[#f4d7ff]' : 'bg-[#ffffff]'} px-5 py-2 rounded-3xl`}>
                                                                <p className=''>{item.messageContent}</p>
                                                            </div>
                                                            <span className='text-[12px] opacity-90 bg-white px-2 py-2 rounded-md text-nowrap z-50 absolute left-[-30px] top-10 hidden group-hover:block'>{ShowTitleTime(item.createAt)}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                            {
                                MessageFindCheck &&
                                (MessageFindCheck.messages.readByReceiver && MessageFindCheck.messages.sender._id === currentuser._id) &&
                                <div className='flex gap-2 items-center justify-end text-gray-500 text-sm mt-2 mr-2'><Check className='text-gray-400' size={19} />อ่านแล้ว</div>
                            }

                            <div ref={MessageScrollRef}></div>
                        </div>

                        {/* Input */}
                        <div className='bg-[#e1bffd] px-2 py-2'>
                            <div className='flex gap-3'>
                                {/* menuicon */}
                                <div className='flex items-center hover:bg-[#c7a6ec] p-1.5 rounded-full cursor-pointer'>
                                    <div className='w-7'>
                                        <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                                    </div>
                                </div>


                                {/* input */}
                                <div className='w-full'>
                                    <input onChange={(e) => setMessageInput(e.target.value)} value={MessageInput} onKeyDown={handleKeyDownSendMessage} className=' rounded-full w-full py-2 px-5 bg-[#f1eafc] focus:outline-none focus:ring-2 focus:ring-[#ffcfdb]' type="text" placeholder='Message...' />
                                </div>

                                <div className='flex items-center hover:scale-110 cursor-pointer'>
                                    <div className='w-7'>
                                        <img src="https://cdn-icons-png.freepik.com/512/9520/9520267.png" alt="" />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div></div>
    )
}

export default Chatwindow