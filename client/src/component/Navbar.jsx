import { ArrowLeft, Bell, Home, MessageCircleMore, Search, Users, Youtube } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios'

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FriendNotify from './Navbar/FriendNotify'
import { useDispatch, useSelector } from 'react-redux'
import { Getcurrentuser } from '../Reducers/userSlice'
import { DeletePost, GetNotify, UpdateAcceptFriendNotify, UpdateLikeNotify, UpdatePost, UpdatePostNotify, UpdateUnlinkeNotify } from '../Reducers/postSlice';
import { useSocket } from '../SocketContext';

const Navbar = ({ handleOpenMenu, MessageWindowRef, RequestWindowRef, handleRefreshHome, NotifyWindowRef }) => {
    // const CurrentUser = useDataStore(state => state.CurrentUserData)
    // const GetCurrentUser = useDataStore(state => state.getCurrentUserData)
    // const token = useAuthStore(state => state.token)
    const dispatch = useDispatch()
    const { socket } = useSocket()

    const CurrentUser = useSelector(state => state.user.currentuser)
    const token = useSelector(state => state.auth.token)
    const currentFriend = useSelector(state => state.user.currentFriend)
    const LastMessage = useSelector(state => state.chat.LastMessage)

    const notifyData = useSelector(state => state.post.notifydata)
    // กรองเอาเฉพาะข้อมูลที่มีอยู่จริงไ่เอา mog
    const notifyDataFilter = notifyData.filter((item) => !(item.type === 'like' && item.content.likes.length < 1) && !item.readByReceiver)

    const [OpenChat, setOpenChat] = useState(false)
    const [SearchQuery, setSearchQuery] = useState('')
    const [FriendSearch, setFriendSearch] = useState([])
    const [CountUnread, setCountUnread] = useState(0)

    const searchRef = useRef(null)


    useEffect(() => {
        let countunreadmessage = 0
        if (LastMessage.length > 0) {
            LastMessage.forEach(item => {
                if (!item.messages.readByReceiver && item.messages.sender._id !== CurrentUser._id) {
                    countunreadmessage += 1
                }
            });
            setCountUnread(countunreadmessage)
        }

    }, [LastMessage])


    useEffect(() => {
        dispatch(Getcurrentuser(token))
    }, [])

    useEffect(() => {
        dispatch(GetNotify(token))
    }, [])

    useEffect(() => {
        SearchFriend()
    }, [SearchQuery])

    useEffect(() => {
        // ตรวจจับการคลิกนอก div ที่ต้องการ
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setOpenChat(false)  // ถ้าคลิกนอก div จะปิด Search bar
            }
        }

        // เพิ่ม event listener
        document.addEventListener('mousedown', handleClickOutside)

        // ลบ event listener เมื่อ component ถูก unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Notify

    //PostNotify
    useEffect(() => {
        socket.on('PostFeed', (data) => {
            dispatch(UpdatePost(data))
            console.log('PostFeed', data)
        })

        socket.on('PostNotify', (data) => {
            console.log('PostNotify', data)
            dispatch(UpdatePostNotify(data))
        })

        return () => {
            socket.off('PostFeed')
            socket.off('PostNotify')
        }
    }, [dispatch])



    // LikeNotify
    useEffect(() => {
        socket.on('LikeNotify', (data) => {
            dispatch(UpdateLikeNotify(data))
        })

        socket.on('UnLikeNotify', ({ userlikedId, postdata }) => {
            dispatch(UpdateUnlinkeNotify({ userlikedId, postdata }))
        })

        return () => {
            socket.off('LikeNotify')
        }
    }, [])

    // DeleltePostNotify
    useEffect(() => {
        socket.on('DeletePostAlready', (postid) => {
            console.log('deletepost', postid)
            dispatch(DeletePost(postid))
        })
    }, [])

    // AcceptNotify
    useEffect(() => {
        socket.on('AcceptNotify', (notifydatasocket) => {
            dispatch(UpdateAcceptFriendNotify(notifydatasocket))
        })
    }, [])


    const SearchFriend = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/user/search?query=${SearchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFriendSearch(res.data)
        } catch (error) {
            console.log(error)
        }

    }

    const handleChangeSearchFriend = (e) => {
        setSearchQuery(e.target.value)
    }


    return (
        <div>
            <nav className="bg-[#ffd8da] py-2 relative z-70 flex justify-center items-center">

                {/* MenuMain */}
                <div className="flex items-center z-[990] py-7 md:py-0" >
                    <NavLink onClick={handleRefreshHome} to={"/"} end className={({ isActive }) =>
                        isActive
                            ? 'bg-[#e7b9b9] py-3 px-10 rounded-lg hidden md:block'
                            : 'py-3 px-10 rounded-xl hover:bg-[#e7b9b9] hidden md:block'
                    }>
                        <Home size={30} color='white' />
                    </NavLink>

                    <NavLink to={"reels"} className={({ isActive }) =>
                        isActive
                            ? 'bg-[#e7b9b9] py-3 px-10 rounded-lg hidden md:block'
                            : 'py-3 px-10 rounded-xl hover:bg-[#e7b9b9] hidden md:block'
                    }>
                        <Youtube size={30} color='white' />
                    </NavLink>

                </div>




                {/* SearchBar left */}
                <div ref={searchRef} className={`fixed left-0 top-0 ${OpenChat && 'focus-within:z-[999]'} `}>
                    <div className={`flex flex-col bg-[#ffd8da] ${OpenChat && 'shadow-md'}`}>
                        <div className={`${!OpenChat ? '' : ''}  py-5 pr-4`}>
                            <div className="flex gap-3 px-5 items-center w-[350px] relative  ">

                                <div className=''>
                                    <p className={`font-bold tracking-[5px] text-2xl text-white drop-shadow-md transition-all duration-700 ${!OpenChat ? 'opacity-1' : 'opacity-0'}`}>STITZ</p>
                                </div>


                                <button className={`hover:bg-[#e6c5c5] p-2 rounded-full absolute transition-all duration-500 ${!OpenChat ? 'opacity-0 left-[100px]' : 'opacity-1 left-[10px]'}`}>
                                    <ArrowLeft />
                                </button>

                                <label htmlFor="searchbar" className={`flex items-center px-2 py-3 rounded-full bg-white gap-3 transition-all duration-700 absolute right-0 ${OpenChat ? 'lg:w-[290px] w-[290px]' : 'w-[40px] lg:w-[230px] left-[130px] lg:left-auto'}`}>
                                    <span><Search /></span>
                                    <input
                                        onChange={handleChangeSearchFriend}
                                        onFocus={() => setOpenChat(true)}
                                        id="searchbar"
                                        className="bg-transparent focus:outline-none focus:border-none w-full"
                                        placeholder="ค้นหา..."
                                        type="text"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className='bg-[#ffeced]'>
                            <div>
                                {
                                    (FriendSearch.length > 0 && OpenChat) &&
                                    FriendSearch.map((item, index) =>
                                        <Link onClick={() => setOpenChat(false)} to={`/${item._id}`} key={index} className='flex px-3 py-3 gap-4 items-center hover:bg-[#f8e4e5]'>
                                            <div>
                                                <div className='w-12 h-12 rounded-full flex items-center justify-center overflow-hidden'>
                                                    <img className='object-cover' src={item.profile_cropped} alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-md font-bold'>{item.username}</p>
                                                {
                                                    currentFriend.some(friend => friend._id === item._id) ? <p className='text-sm text-gray-600'>เพื่อน</p> : ''
                                                }
                                            </div>
                                        </Link>
                                    )


                                }

                            </div>
                        </div>
                    </div>
                </div>




                {/* menu right */}
                <div className="fixed right-5">

                    <div className="flex justify-center items-center gap-5">

                        {/* Friend */}
                        <div ref={RequestWindowRef} onClick={() => handleOpenMenu('RequestWindow')}>
                            <FriendNotify />
                        </div>


                        {/* Message */}
                        <div ref={MessageWindowRef} onClick={() => handleOpenMenu('MessageWindow')} className='relative'>
                            <button className="bg-[#e7b9b9] p-2.5 rounded-full">
                                <QuestionAnswerIcon size={25} className='text-white' />
                            </button>
                            {CountUnread !== 0 && <div className='absolute w-6 h-6 bg-red-600 rounded-full left-[-5px] top-[-1px] text-[12px] flex items-center justify-center p-2.5 font-bold text-white animate-bounce'>{CountUnread}</div>}
                        </div>

                        {/* Notifi */}
                        <div ref={NotifyWindowRef} onClick={() => handleOpenMenu('NotifyWindow')} className='relative'>
                            <button className="bg-[#e7b9b9] p-2.5 rounded-full">
                                <NotificationsIcon size={25} className='text-white' />
                            </button>
                            {
                                notifyDataFilter.length > 0 && <div className='absolute w-6 h-6 bg-red-600 rounded-full left-[-5px] top-[-1px] text-[12px] flex items-center justify-center p-2.5 font-bold text-white animate-bounce'>{notifyDataFilter.length}</div>
                            }

                        </div>

                        {/* Account */}
                        <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center">
                            <img className='object-cover' src={CurrentUser?.profile_cropped} alt="" />
                        </div>

                    </div>

                </div>
            </nav >
        </div >
    )
}

export default Navbar