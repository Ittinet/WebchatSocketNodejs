import axios from 'axios'
import { Ellipsis, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuthStore from '../store/Authstore'

const FriendChat = () => {
    const [OpenChat, setOpenChat] = useState(false)
    const [FriendData, setFriendData] = useState([])

    const token = useAuthStore(state => state.token)

    useEffect(() => {
        GetFriendUser()
    }, [])

    const GetFriendUser = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFriendData(res.data.friend)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(FriendData)

    const handleOpenChat = () => {

    }

    return (
        <div>
            <div className='py-4 pr-3'>
                <div className='flex justify-between border-b pb-3 border-[#abc0ab]'>
                    <h1 className='text-lg font-bold'>ผู้ติดต่อ</h1>
                    <div className='flex gap-3'>
                        <Search />
                        <Ellipsis />
                    </div>
                </div>

                <div>
                    {
                        FriendData.length > 0 && FriendData.map((item, index) =>
                            <div key={index} onClick={handleOpenChat} className='mt-3 py-2 px-2 hover:bg-[#f8e6e6] cursor-pointer rounded-lg'>
                                <div className='flex items-center gap-4'>
                                    <div className='max-w-9 relative'>
                                        <img src={item.profile_picture} alt="" />
                                        {
                                            item.status === "online"
                                                ? <div className='bg-green-400 border-black absolute w-2 h-2 rounded-full right-0 bottom-0'></div>
                                                : ""
                                        }

                                    </div>
                                    <div>
                                        <p className='font-bold'>{item.username}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default FriendChat