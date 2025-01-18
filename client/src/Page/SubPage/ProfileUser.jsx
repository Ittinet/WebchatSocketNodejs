import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import Loading from "../../component/Loading";;
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import IconLoading1 from "../../component/Icon/IconLoading1";
import { UserRoundX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetcurrentFriend, GetcurrentRequest, Getcurrentuser } from "../../Reducers/userSlice";


const ProfileUser = () => {
    const { id } = useParams();

    const dispatch = useDispatch()

    const token = useSelector(state => state.auth.token)
    const CurrentUserData = useSelector(state => state.user.currentuser)
    const friendData = useSelector(state => state.user.currentFriend)
    const requestUser = useSelector(state => state.user.currentRequest)


    const friendMenuRef = useRef()

    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRequestloading, setIsRequestloading] = useState(false)

    const [error, setError] = useState(null)
    const [isFriend, setIsFriend] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [isRequestFromUser, setIsRequestFromUser] = useState(false)
    const [AlreadySent, setAlreadySent] = useState([])

    // Menu
    const [isOpenMenuFriend, setIsOpenMenuFriend] = useState(false)

    const handleOpenMenuFriend = () => {
        setIsOpenMenuFriend(!isOpenMenuFriend)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (id && token) {
                    await Promise.all([
                        handleGetuser(),
                        dispatch(GetcurrentFriend(token)),
                        handleGetAlreadySent(),
                        dispatch(Getcurrentuser(token)),
                        dispatch(GetcurrentRequest(token))
                    ])
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchData, 200);

        return () => clearTimeout(timeout)

    }, [token, id, dispatch])

    // ตรวจสอบว่าขอเป็นเพื่อนไปยัง
    useEffect(() => {
        if (userData && AlreadySent.length > 0) {
            const receiverId = AlreadySent.map(item => item.receiver)
            setIsSent(receiverId.includes(userData._id))
        }
    }, [AlreadySent, userData])


    // ตรวจสอบว่าเปป็นเพื่อนกันอยู่ไหม
    useEffect(() => {
        if (userData && friendData.length > 0) {
            const friendlist = friendData.map(item => item._id)
            setIsFriend(friendlist.includes(userData._id))
        } else {
            setIsFriend(false)
        }
    }, [userData, friendData])

    //ตรวจสอบว่ามีการส่งคำขอเป็นเพื่อนมาไหม
    useEffect(() => {
        if (userData && requestUser.length > 0) {
            const requestUserId = requestUser.map(item => item.sender._id)
            setIsRequestFromUser(requestUserId.includes(userData._id))
        } else {
            setIsRequestFromUser(false)
        }
    }, [userData, requestUser])

    //ตรวจสอบการคลิกนอกพื้นที่เมนูให้ปิด
    useEffect(() => {

        const CloseMenuFriend = (e) => {
            if (friendMenuRef.current && !friendMenuRef.current.contains(e.target)) {
                setIsOpenMenuFriend(false)
            }
        }

        document.addEventListener('mousedown', CloseMenuFriend)

        return () => {
            document.removeEventListener('mousedown', CloseMenuFriend)
        }

    }, [])


    const handleGetuser = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserData(res.data.userData)
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }


    const handleGetAlreadySent = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/request/alreadysent', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAlreadySent(res.data.sentData)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFriend = async () => {
        if (isRequestloading) {
            return
        }
        setIsRequestloading(true)
        try {
            const res = await axios.post('http://localhost:8000/api/request/send', {
                senderId: CurrentUserData._id,
                receiverId: userData._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        } catch (error) {
            if (error.response) {
                return toast.error(error.response.data.message)
            }
            console.log(error)
        } finally {
            setTimeout(async () => {
                setIsRequestloading(false)
                await dispatch(GetcurrentFriend(token))
                await handleGetAlreadySent()
            }, 1000);
        }
    }

    const handleCancelRequest = async () => {
        try {
            if (isRequestloading) {
                return
            }
            setIsRequestloading(true)
            const res = await axios.delete(`http://localhost:8000/api/request/cancle/${userData._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(async () => {
                setIsRequestloading(false)
                setIsSent(false)
                dispatch(GetcurrentFriend(token))
                await handleGetAlreadySent()
            }, 1000);
        }
    }

    const handleAcceptRequest = async () => {
        if (isRequestloading) {
            return
        }
        setIsRequestloading(true)
        try {
            const res = await axios.post(`http://localhost:8000/api/request/accept/${userData._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        } finally {
            setTimeout(async () => {
                setIsRequestloading(false)
                await dispatch(GetcurrentFriend(token))
                await dispatch(GetcurrentRequest(token))
            }, 1000);
        }
    }

    const handleDeleteFriend = async () => {
        if (isRequestloading) {
            return
        }
        setIsRequestloading(true)
        setIsOpenMenuFriend(false)
        try {
            const res = await axios.delete(`http://localhost:8000/api/friend/${userData._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('removefriend', res.data)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
            console.log(error)
        } finally {
            setTimeout(async () => {
                await dispatch(GetcurrentFriend(token))
                await handleGetAlreadySent()
                await dispatch(GetcurrentRequest(token))
                setIsFriend(false);
                setIsRequestloading(false)
            }, 1000);
        }
    }




    // console.log('frienddata', friendData)
    // console.log('userdata', userData)
    // console.log('userCurrent', CurrentUserData)
    // console.log('alreadydata', AlreadySent)
    // console.log('Request', requestUser)
    // console.log('checkrequest', isRequestFromUser)


    if (loading) {
        return <Loading />
    }

    if (error || !id) {
        return <div>ไม่พบผลลัพ</div>
    }



    return (
        <div>
            <div>
                {/* header */}
                <div className='bg-[#f2ecff] rounded-xl text-gray-500'>
                    <div className='px-5 flex justify-between border-b-2'>
                        {/* left */}
                        <div>
                            <div className='flex gap-5'>
                                <div className='relative w-[170px] h-[160px]'>
                                    <div className='w-[170px] h-[170px] overflow-hidden flex rounded-full absolute top-[-30px]'>
                                        <img className='object-cover' src={userData.profile_picture} alt="" />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 mt-8'>
                                    <p className='text-3xl font-bold'>{userData.username}</p>
                                    <p className='font-bold text-gray-500'>เพื่อน 3.2 พันคน</p>
                                </div>
                            </div>
                        </div>
                        {/* right */}
                        <div className='mt-14 mr-20 relative'>
                            <div className='flex gap-3 text-lg font-bold text-gray-500'>

                                {
                                    isFriend ? (
                                        <button onClick={handleOpenMenuFriend} className='bg-[#e8dcf8] px-3 py-2 rounded-lg flex items-center gap-2'>
                                            {isRequestloading && <IconLoading1 />} เพื่อน
                                        </button>
                                    )
                                        : isRequestFromUser ? (
                                            <button onClick={handleAcceptRequest} className='bg-[#e8dcf8] px-3 py-2 rounded-lg flex items-center gap-2'>
                                                {isRequestloading && <IconLoading1 />} ตอบรับ
                                            </button>
                                        ) : isSent ? (
                                            <button onClick={handleCancelRequest} className='bg-[#e8dcf8] px-3 py-2 rounded-lg flex items-center gap-2'>
                                                {isRequestloading && <IconLoading1 />} ยกเลิกคำขอ
                                            </button>
                                        ) : (
                                            <button onClick={handleAddFriend} className='bg-[#e8dcf8] px-3 py-2 rounded-lg flex items-center gap-2'>
                                                {isRequestloading && <IconLoading1 />} เพิ่มเพื่อน +
                                            </button>
                                        )
                                }

                                <div className='bg-[#e8dcf8] px-3 py-2 rounded-lg'>
                                    ส่งข้อความ
                                </div>
                            </div>
                            {/* Menu Popup */}
                            {isOpenMenuFriend &&
                                <div ref={friendMenuRef}>
                                    <div className="bg-[#e8dcf8] absolute bottom-1 left-1 rounded-lg p-1 w-[270px] z-20">
                                        <div onClick={handleDeleteFriend} className="px-2 py-1 hover:bg-[#e1d9ec] rounded-lg hover:cursor-pointer flex items-center gap-3">
                                            <UserRoundX size={24} /><p className="font-bold mt-1">เลิกเป็นเพื่อน</p>
                                        </div>
                                    </div>
                                    <div className="absolute w-7 h-7 bg-[#e8dcf8] rotate-[35deg]  top-[50px] left-[10px] z-0"></div>
                                </div>
                            }

                        </div>
                    </div>
                    <div className='flex w-full'>
                        <div className='flex gap-5 font-bold text-gray-400'>
                            <div className='p-5'>
                                โพสต์
                            </div>
                            <div className='p-5'>
                                รูปภาพ
                            </div>
                            <div className='p-5'>
                                เพื่อน
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProfileUser


