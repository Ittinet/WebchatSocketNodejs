import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddChat, GetLastMessage } from '../../Reducers/chatSlice'

const MessageWindow = ({ setMenuWindow, MessageWindowRef }) => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const LastMessage = useSelector(state => state.chat.LastMessage)
    const currentuser = useSelector(state => state.user.currentuser)
    const componentRef = useRef(null)



    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (componentRef.current && !componentRef.current.contains(e.target) && !MessageWindowRef.current.contains(e.target)) {
                setMenuWindow('close')

            }
        }

        document.addEventListener('mousedown', handleClickOutSide)

        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }

    }, [])

    useEffect(() => {
        // console.log('currentuser', currentuser)
        console.log('Lastmessage', LastMessage)
    }, [])

    const handleOpenChat = (data) => {
        dispatch(AddChat(data))
    }


    return (
        <div ref={componentRef} className='fixed w-[400px] h-[calc(100%-70px)] top-[65px] bg-[#ede7ff] right-2 z-[100] rounded-xl'>
            <div>

                <div className='flex flex-col gap-2'>
                    {/* header */}
                    <div className='px-5 py-1 space-y-2'>
                        <div className='py-3'>
                            <h1 className='text-2xl text-gray-600 font-bold'>แชท</h1>
                        </div>
                        <div className='w-full relative'>
                            <input placeholder='ค้นหาข้อความ....' className='w-full rounded-full pl-12 py-2 bg-[#ffffff] opacity-60 focus:outline-none focus:ring-2' type="text" />
                            <div className='absolute top-2 left-3'>
                                <Search className='text-gray-500' />
                            </div>
                        </div>
                    </div>


                    {/* Body */}
                    <div className='py-2 px-2 gap-1 flex flex-col h-[1600px] overflow-y-auto'>
                        {
                            LastMessage.length > 0 && LastMessage.map((item, index) =>
                                <div onClick={() => handleOpenChat(item.messages.targetuser)} key={index} className='flex gap-5 relative rounded-lg hover:bg-[#e6e0f7] cursor-pointer py-3 px-3 '>
                                    <div>
                                        <div className='w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white'>
                                            <img className='object-cover' src={item.messages.targetuser.profile_cropped} alt="" />
                                        </div>
                                    </div>
                                    <div className='mt-1'>
                                        <h1 className='text-md font-bold text-gray-600'>{item.messages.targetuser.username}</h1>
                                        <p className='text-sm text-gray-400 mt-[1px]'>{item.messages.sender._id === currentuser._id && "คุณ : "}{item.messages.messageContent}</p>
                                    </div>
                                    {
                                        (!item.messages.readByReceiver && item.messages.sender._id !== currentuser._id) && <div className='absolute right-5 top-7 w-3 h-3 bg-[#e0aefd] rounded-full'></div>
                                    }

                                </div>
                            )


                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageWindow