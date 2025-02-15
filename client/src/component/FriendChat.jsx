import { Ellipsis, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetcurrentFriend } from '../Reducers/userSlice'
import { AddChat, UpdateLastMessage } from '../Reducers/chatSlice'
import { useSocket } from '../SocketContext'

const FriendChat = () => {
    const { socket } = useSocket()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const currentFriend = useSelector(state => state.user.currentFriend)
    
    useEffect(() => {
        dispatch(GetcurrentFriend(token))
    }, [])


    useEffect(() => {
        socket.on('NotityfyChat', (senderData) => {
            dispatch(AddChat(senderData))

        })
        socket.on('NewMessage', (data) => {
            dispatch(UpdateLastMessage(data))
        })
    }, [])

    const handleOpenChat = (data) => {
        dispatch(AddChat(data))
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
                        currentFriend.length > 0 && currentFriend.map((item, index) =>
                            <div key={index} onClick={() => handleOpenChat(item)} className='mt-3 py-2 px-2 hover:bg-[#f8e6e6] cursor-pointer rounded-lg'>
                                <div className='flex items-center gap-4'>
                                    <div className='relative'>
                                        <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center'>
                                            <img className='object-cover' src={item.profile_cropped} alt="" />
                                            {
                                                item.status === "online"
                                                    ? <div className='bg-green-400 border-black absolute w-2 h-2 rounded-full right-0 bottom-0'></div>
                                                    : ""
                                            }

                                        </div>
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