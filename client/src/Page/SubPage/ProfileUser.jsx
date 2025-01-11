import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import useAuthStore from "../../store/Authstore";
import Loading from "../../component/Loading";
import useDataStore from "../../store/Datastore";
import { toast } from "react-toastify";


const ProfileUser = () => {
    const { id } = useParams();

    const token = useAuthStore(state => state.token)
    const getCurrentUserData = useDataStore(state => state.getCurrentUserData)
    const CurrentUserData = useDataStore(state => state.CurrentUserData)


    const [userData, setUserData] = useState([])
    const [friendData, setFriendData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFriend, setIsFriend] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [AlreadySent, setAlreadySent] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (id && token) {
                    await handleGetuser()
                    await handleGetFriendData()
                    await handleGetAlreadySent()
                    await getCurrentUserData(token)
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchData, 200);

        return () => clearTimeout(timeout)

    }, [token, id])


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

    const handleGetFriendData = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFriendData(res.data.friend)
        } catch (error) {
            console.log(error)
            setError(error.message);
        }
    }

    const handleAddFriend = async () => {
        try {
            const res = await axios.post('http://localhost:8000/api/request/send', {
                senderId: CurrentUserData._id,
                receiverId: userData._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(res.data.message)
        } catch (error) {
            if (error.response) {
                return toast.error(error.response.data.message)
            }
            console.log(error)
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
        }
    }, [userData, friendData])

    console.log('frienddata', friendData)
    console.log('userdata', userData)
    console.log('userCurrent', CurrentUserData)
    console.log('alreadydata', AlreadySent)

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
                <div className='bg-purple-100 rounded-xl'>
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
                        <div className='mt-14 mr-10'>
                            <div className='flex gap-3 text-lg font-bold text-gray-500'>
                                {
                                    isFriend
                                        ? <button className='bg-[#ffd2d2] px-3 py-2 rounded-lg'>
                                            เพื่อน
                                        </button>

                                        : isSent ? <button onClick={handleAddFriend} className='bg-[#ffd2d2] px-3 py-2 rounded-lg'>
                                            ยกเลิกคำขอ
                                        </button>

                                            : <button onClick={handleAddFriend} className='bg-[#ffd2d2] px-3 py-2 rounded-lg'>
                                                เพิ่มเพื่อน +
                                            </button>
                                }

                                <div className='bg-[#ffd2d2] px-3 py-2 rounded-lg'>
                                    ส่งข้อความ
                                </div>
                            </div>
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