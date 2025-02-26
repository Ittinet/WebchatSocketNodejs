import Navbar from "../component/Navbar";
import FriendChat from "../component/FriendChat";
import Sidebar from "../component/Sidebar";
import { Outlet, useParams } from "react-router-dom";
import Chatwindow from "../component/Chatwindow";
import RequestWindow from "../component/Navbar/RequestWindow";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageWindow from "../component/Navbar/MessageWindow";
import { GetLastMessage } from "../Reducers/chatSlice";

const MainPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [MenuWindow, setMenuWindow] = useState('')

    const token = useSelector(state => state.auth.token)
    const activeChats = useSelector(state => state.chat.activeChats)

    const MessageWindowRef = useRef(null)
    const RequestWindowRef = useRef(null)

    const handleOpenMenu = (mode) => {
        if (mode === MenuWindow) {
            setMenuWindow('close')
        } else {
            setMenuWindow(mode)
        }
    }

    const handleRefreshHome = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (token) {
            dispatch(GetLastMessage(token))
        }

    }, [token, dispatch])

    return (
        <div className="relative">
            {/* Navbar */}
            <div className="sticky top-0 z-[80] drop-shadow-md">
                <Navbar handleRefreshHome={handleRefreshHome} handleOpenMenu={handleOpenMenu} MessageWindowRef={MessageWindowRef} RequestWindowRef={RequestWindowRef} />
            </div>

            {/* Body */}
            {
                id
                    ?
                    <div className="max-w-[1200px] mx-auto mt-10">
                        <Outlet />
                    </div>
                    :
                    <div className="flex justify-between">

                        {/* Sidebar */}
                        <div className="xl:max-w-[360px] hidden lg:block max-w-[265px] bg-[#fdf6f6] w-full h-[calc(100vh-70px)] sticky top-[70px] ">
                            <Sidebar />
                        </div>



                        {/* Maincontent */}
                        <div className="flex-grow px-[32px] bg-[#fdf6f6]">
                            <div className="w-full justify-center flex xl:min-w-[680px] md:min-w-[450px]">
                                <div className="w-full max-w-[680px]">
                                    <Outlet />
                                </div>
                            </div>
                        </div>


                        {/* FriendChat */}
                        <div className="xl:max-w-[360px] lg:max-w-[265px] max-w-[290px] hidden md:block h-[calc(100vh-70px)]  bg-[#fdf6f6] w-full h- sticky top-[70px]">
                            <FriendChat />
                        </div>



                    </div>
            }


            {/* FriendRequestWindow */}
            {
                MenuWindow === 'RequestWindow' && <RequestWindow setMenuWindow={setMenuWindow} RequestWindowRef={RequestWindowRef} />
            }


            {/* MessageWindow */}
            {
                MenuWindow === 'MessageWindow' && <MessageWindow setMenuWindow={setMenuWindow} MessageWindowRef={MessageWindowRef} />
            }


            {/* Chatwindow */}
            <div className='fixed bottom-0 right-5 z-[200]'>
                <div className="flex gap-3 flex-row-reverse">
                    {
                        activeChats.length > 0 && activeChats.map((item, index) => (
                            <div key={index}>
                                <Chatwindow chatData={item} />
                            </div>

                        ))
                    }
                </div>
            </div>

        </div >
    );
};

export default MainPage;
