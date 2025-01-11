import { Ellipsis, X } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { ThumbsUp } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { SquareArrowOutUpRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="mt-5 flex flex-col gap-5">
            {/* PostInput */}
            <div className="w-full bg-[#ffffff] rounded-xl p-4 px-4 drop-shadow-lg">
                <div className="flex gap-4">
                    <div className="max-w-12">
                        <img src="https://cdn-icons-png.flaticon.com/512/1458/1458201.png" alt="" />
                    </div>
                    <input className="bg-[#f7f7f7] w-full rounded-full px-5" type="text" placeholder="คุณคิดอะไรอยู่..." />
                </div>

                <div className="flex mt-2 justify-center items-center w-full hover:bg-[#ffe9eb] rounded-lg">
                    <div className="py-3 flex gap-2 text-lg font-bold justify-center items-center">
                        <div className="max-w-10">
                            <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                        </div>
                        <p>รูปภาพ/วิดีโอ</p></div>
                </div>
            </div>

            <div className="">

                {/* Content */}
                <div className="bg-white py-5 rounded-lg drop-shadow-lg">
                    <div className="flex flex-col gap-3">
                        {/* Header */}
                        <div className="flex justify-between px-5">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-full  overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2FIMG_2341.JPG?alt=media&token=e3a65ed7-e91b-4d79-b7a7-9d1be386cc59" alt="" />
                                </div>
                                <div>
                                    <p className="font-bold">Ittinet</p>
                                    <p className="text-[12px] font-bold text-gray-500">24 นาที</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Ellipsis />
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="break-words px-5">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, illum.</p>
                        </div>

                        {/* image */}
                        <div className="w-full flex items-center justify-center bg-white">
                            <div className="max-w-[80%]">
                                <img className="h-full" src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2FIMG_2341.JPG?alt=media&token=e3a65ed7-e91b-4d79-b7a7-9d1be386cc59" alt="" />
                            </div>
                        </div>

                        {/* like people */}
                        <div className="px-5">
                            <div className="border-b pb-3 flex gap-2 items-center">
                                <div className="w-[20px] h-[20px] bg-blue-500 rounded-full flex justify-center items-center p-1">
                                    <FontAwesomeIcon icon={faThumbsUp} className="size-3" color="white" />
                                </div>
                                <p className="text-gray-500 text-sm">Siriwan Tawong และคนอื่นๆ อีก 28 คน</p>
                            </div>
                        </div>

                        {/* menubar */}
                        <div className="px-5 w-full flex ">

                            <div className="flex-grow flex items-center justify-center hover:bg-[#fceded] py-2 rounded-lg gap-2 cursor-pointer">
                                <ThumbsUp size={18} />
                                <p>ถูกใจ</p>
                            </div>

                            <div className="flex-grow flex items-center justify-center hover:bg-[#fceded] py-2 rounded-lg gap-2 cursor-pointer">
                                <MessageCircle size={18} />
                                <p>แสดงความคิดเห็น</p>
                            </div>

                            <div className="flex-grow flex items-center justify-center hover:bg-[#fceded] py-2 rounded-lg gap-2 cursor-pointer">
                                <SquareArrowOutUpRight size={18} />
                                แชร์
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home