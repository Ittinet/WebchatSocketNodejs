import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetNotify, ReadNotify } from "../../Reducers/postSlice"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { useSocket } from "../../SocketContext";

const NotifyWindow = ({ setMenuWindow, NotifyWindowRef }) => {
    const dispatch = useDispatch()
    const { socket } = useSocket()
    const token = useSelector(state => state.auth.token)
    const currentuser = useSelector(state => state.user.currentuser)
    const componentRef = useRef()


    const notifyData = useSelector(state => state.post.notifydata)
    // กรองเอาเฉพาะข้อมูลที่มีอยู่จริงไม่เอา mog
    const notifyDataFilter = notifyData.filter((item) => !(item.type === 'like' && item.content.likes.length < 1))
    console.log('notifyfilter', notifyDataFilter)

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


    // OpenWindow
    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (componentRef.current && !componentRef.current.contains(e.target) && !NotifyWindowRef.current.contains(e.target)) {
                setMenuWindow('close')

            }
        }

        document.addEventListener('mousedown', handleClickOutSide)

        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }

    }, [])

    // GetNotifyData
    // useEffect(() => {
    //     dispatch(GetNotify(token))
    // }, [])

    //ReadNotify 
    useEffect(() => {
        socket.emit('SendReadNotify', (currentuser._id))
        dispatch(ReadNotify())
    }, [])

    console.log('notifydata', notifyData)


    return (
        <div ref={componentRef} className='fixed w-[400px] h-[calc(100%-70px)] top-[65px] bg-[#ede7ff] right-2 z-[100] rounded-xl'>
            <div>
                {/* Header */}
                <div className="px-5 py-5">
                    <p className="text-2xl text-gray-600 font-bold">แจ้งเตือน</p>
                </div>

                {/* Body */}
                <div className="mt-2">
                    <div className="bg-[#f6f0fc]">
                        {/* item */}

                        {
                            notifyDataFilter.length > 0 && notifyDataFilter.map((item, index) => (
                                item.type === 'post'
                                    ?
                                    <div key={index} className="flex px-3 py-3 gap-5 hover:bg-[#eae3f0] cursor-pointer">
                                        <div>
                                            <div className="w-16 h-16 flex justify-center items-center rounded-full overflow-hidden">
                                                <img className="w-full h-full object-cover" src={item.content.user.profile_cropped} alt="" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="space-y-2 mt-1">
                                                <div className="space-x-2 break-words">
                                                    <span className="font-bold text-gray-800">{item.content.user.username}</span> <span className="text-gray-700">ได้เพิ่มโพสต์ลงในไทม์</span>
                                                </div>

                                                <p className="text-[13px] text-gray-500">{timeAgo(item.createAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    : item.type === 'like'
                                        ?
                                        <div key={index} className="flex px-3 py-3 gap-5 hover:bg-[#eae3f0] cursor-pointer">
                                            <div>
                                                <div className="w-16 h-16 flex justify-center items-center rounded-full overflow-hidden">
                                                    <img className="w-full h-full object-cover" src={item.content.likes[item.content.likes.length - 1].user.profile_cropped} alt="" />
                                                </div>
                                            </div>

                                            <div className="">
                                                <div className="space-y-2 mt-1 w-[300px]">
                                                    <div className="break-words space-x-2 text-gray-700">
                                                        <span className="text-gray-800 font-bold">{item.content.likes[item.content.likes.length - 1].user.username}</span>
                                                        {item.content.likes.length - 1 > 0 && <span>และคนอื่นๆอีก {item.content.likes.length - 1} คน</span>}
                                                        <span>ได้กดไลค์โพสต์ของคุณ</span>
                                                    </div>

                                                    <p className="text-[13px] text-gray-500">{timeAgo(item.createAt)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        : item.type === 'acceptfriend'
                                            ?
                                            <div key={index} className="flex px-3 py-3 gap-5 hover:bg-[#eae3f0] cursor-pointer">
                                                <div>
                                                    <div className="w-16 h-16 flex justify-center items-center rounded-full overflow-hidden">
                                                        <img className="w-full h-full object-cover" src={item.userAccept.profile_cropped} alt="" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="space-y-1 mt-1">
                                                        <div className="break-words space-x-1">
                                                            <span className="font-bold text-gray-700">{item.userAccept.username}</span> <span className="text-gray-700">ได้ตอบรับคำขอเป็นเพื่อนของคุณแล้ว</span>
                                                        </div>

                                                        <p className="text-[12px] text-gray-500">{timeAgo(item.createAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            : <div>มาทำต่อ</div>

                            ))
                        }

                    </div>
                </div>

            </div>
        </div>
    )
}

export default NotifyWindow