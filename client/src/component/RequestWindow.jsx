import { X } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AcceptFriend, GetcurrentRequest, RejectFriend } from "../Reducers/userSlice"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInYears } from 'date-fns'
import axios from "axios"


const RequestWindow = ({ OpenMenu, setOpenMenu }) => {
    const dispatch = useDispatch()

    const token = useSelector(state => state.auth.token)
    const currentRequest = useSelector(state => state.user.currentRequest)

    const timeAgo = (createdAt) => {
        const now = new Date();
        const date = new Date(createdAt)

        const diffInSeconds = differenceInSeconds(now, date);
        const diffInMinutes = differenceInMinutes(now, date)
        const diffInHours = differenceInHours(now, date);
        const diffInDays = differenceInDays(now, date);
        const diffInMonths = differenceInMonths(now, date);
        const diffInYears = differenceInYears(now, date);

        if (diffInYears > 0) {
            return `${diffInYears} ปีที่แล้ว`;
        }
        if (diffInMonths > 0) {
            return `${diffInMonths} เดือนที่แล้ว`;
        }
        if (diffInDays > 0) {
            return `${diffInDays} วันที่แล้ว`;
        }
        if (diffInHours > 0) {
            return `${diffInHours} ชั่วโมงที่แล้ว`;
        }
        if (diffInMinutes > 0) {
            return `${diffInMinutes} นาทีที่แล้ว`;
        }
        if (diffInSeconds > 30) {
            return `${diffInSeconds} วินาทีที่แล้ว`;
        }

        return 'เมื่อสักครู่'; // กรณีที่น้อยกว่า 1 วินาที
    };




    console.log('currentRequest', currentRequest)

    useEffect(() => {
        dispatch(GetcurrentRequest(token))
    }, [dispatch])

    return (
        <div className={`fixed z-[90] top-0 right-0 shadow-md duration-700 transition-all ${OpenMenu ? 'translate-x-0' : 'translate-x-full'} `}>
            <div className="w-[400px] h-[100vh] bg-[#f5ebfd]">
                {/* Header */}
                <div className="bg-[#e1bffd]">
                    <div className="flex justify-between items-center px-2 py-2">
                        <p className="font-bold text-xl text-gray-600 px-2 py-3">คำขอเป็นเพื่อน</p>
                        <button onClick={() => setOpenMenu(false)} className="hover:bg-[#d0aedd] rounded-full p-1.5">
                            <X className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-3 py-5 w-full overflow-y-auto max-h-[calc(100vh-90px)]">
                    <div className="flex flex-col gap-7">
                        {
                            currentRequest.length > 0
                                ? currentRequest.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <div className="">
                                            <div className='w-[60px] h-[60px] overflow-hidden flex rounded-full'>
                                                <img className="object-cover" src={item.sender.profile_picture} alt="" />
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-lg">{item.sender.username}</p>
                                            <p className="text-md text-gray-600">{timeAgo(item.timestamp)}</p>
                                        </div>
                                        <div className="flex gap-2  justify-center">
                                            <button onClick={() => dispatch(AcceptFriend({ token, id: item.sender._id }))} className="bg-[#e8d0fd] hover:bg-[#ccb5e0] text-gray-600 py-3 px-5 rounded-xl ">ยืนยัน</button>
                                            <button onClick={() => dispatch(RejectFriend({ token, id: item.sender._id }))} className="bg-[#e1d5eb] hover:bg-[#ccb5e0] text-gray-600 py-1 px-5 rounded-xl ">ลบ</button>
                                        </div>
                                    </div>
                                ))
                                : <div>ไม่มีคำขอ...</div>
                        }


                    </div>

                </div>

            </div>
        </div>
    )
}

export default RequestWindow