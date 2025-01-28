import Navbar from "../component/Navbar";
import FriendChat from "../component/FriendChat";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";
import Chatwindow from "../component/Chatwindow";
import RequestWindow from "../component/RequestWindow";
import { useState } from "react";
import { useSelector } from "react-redux";

const App = () => {
    const [isOpenRequestMenu, setIsOpenRequestMenu] = useState(false)

    const activeChats = useSelector(state => state.chat.activeChats)

    return (
        <div className="relative">
            {/* Navbar */}
            <div className="sticky top-0 z-[80] drop-shadow-md">
                <Navbar OpenMenu={isOpenRequestMenu} setOpenMenu={setIsOpenRequestMenu} />
            </div>

            {/* Body */}
            <div className="flex justify-between">

                {/* Sidebar */}
                <div className="xl:max-w-[360px] hidden lg:block max-w-[265px] bg-[#fdf6f6] w-full h-[calc(100vh-70px)] sticky top-[70px] ">
                    <Sidebar />
                </div>

                {/* Maincontent */}
                <div className="flex-grow px-[32px] bg-[#fdf6f6]">
                    <div className="w-full justify-center flex xl:min-w-[680px] md:min-w-[450px]">
                        <div className="w-full max-w-[680px] h-[2000px]">
                            <Outlet />
                        </div>
                    </div>
                </div>

                {/* FriendChat */}
                <div className="xl:max-w-[360px] lg:max-w-[265px] max-w-[290px] hidden md:block h-[calc(100vh-70px)]  bg-[#fdf6f6] w-full h- sticky top-[70px] ">
                    <FriendChat />
                </div>
            </div>

            {/* FriendRequestWindow */}
            <RequestWindow OpenMenu={isOpenRequestMenu} setOpenMenu={setIsOpenRequestMenu} />

            {/* Chatwindow */}
            <div className='fixed bottom-0 right-5'>
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

        </div>
    );
};

export default App;
