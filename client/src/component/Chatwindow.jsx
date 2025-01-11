import { ChevronDown, Minus, Phone, Video, X } from 'lucide-react'

const Chatwindow = () => {
    return (
        <div>{/* Chatwindow */}
            <div className='fixed bottom-0 right-5'>
                <div>
                    {/* Mainbody */}
                    <div className='w-[380px]'>
                        {/* header */}
                        <div className='bg-[#e1bffd] rounded-t-lg drop-shadow-md'>
                            <div className='relative'>
                                <div className='flex gap-2 w-[60%] rounded-t-lg'>
                                    <div className='hover:bg-[#c7a6ec] p-1 rounded-lg py-2 px-2 relative'>
                                        <div className='w-[40px] h-[40px] overflow-hidden rounded-full'>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2FIMG_2341.JPG?alt=media&token=e3a65ed7-e91b-4d79-b7a7-9d1be386cc59" alt="" />
                                        </div>
                                        {/* onActive */}
                                        <div className='w-3 h-3 bg-green-400 border rounded-full absolute right-2 bottom-2'></div>
                                    </div>
                                    <div className='w-[60%] space-y-[-2px] py-2'>
                                        <p className='font-bold truncate'>ศิริวรรณ ทาวงษ์</p>
                                        <p className='text-[13px] text-gray-600 truncate'>กำลังใช้งาน</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                                <div className='flex items-center absolute right-[10px] top-3'>
                                    <div className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Phone size={20} />
                                    </div>
                                    <div className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Video size={20} />
                                    </div>
                                    <div className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <Minus size={20} />
                                    </div>
                                    <div className='hover:bg-[#c7a6ec] p-1.5 rounded-full'>
                                        <X size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* body */}
                        <div className='h-[450px] bg-[#e5e5fd] py-5 px-2'>
                            <div className='space-y-3'>
                                {/* Send */}
                                <div>
                                    <div className='flex gap-1'>
                                        <div className='p-1'>
                                            <div className='w-9 h-9  rounded-full overflow-hidden'>
                                                <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2FIMG_2341.JPG?alt=media&token=e3a65ed7-e91b-4d79-b7a7-9d1be386cc59" alt="" />
                                            </div>
                                        </div>

                                        <div className='max-w-[250px] break-words'>
                                            <div className='bg-[#f4d7ff] px-5 py-2 rounded-3xl'>
                                                <p className=''>ทำไรอยู่ ?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recipient */}
                                <div>
                                    <div className='flex flex-row-reverse gap-1'>
                                        <div className='p-1'>
                                            <div className='w-9 h-9  rounded-full overflow-hidden'>
                                                <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2FIMG_2341.JPG?alt=media&token=e3a65ed7-e91b-4d79-b7a7-9d1be386cc59" alt="" />
                                            </div>
                                        </div>

                                        <div className='max-w-[250px] break-words'>
                                            <div className='bg-[#ffffff] px-5 py-2 rounded-3xl'>
                                                <p className=''>ทำไรอยู่ ?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className='bg-[#e1bffd] px-2 py-2'>
                            <div className='flex gap-3'>
                                {/* menuicon */}
                                <div className='flex items-center hover:bg-[#c7a6ec] p-1.5 rounded-full cursor-pointer'>
                                    <div className='w-7'>
                                        <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                                    </div>
                                </div>


                                {/* input */}
                                <div className='w-full'>
                                    <input className=' rounded-full w-full py-2 px-5 bg-[#f1eafc] focus:outline-none focus:ring-2 focus:ring-[#ffcfdb]' type="text" placeholder='Message...' />
                                </div>

                                <div className='flex items-center hover:scale-110 cursor-pointer'>
                                    <div className='w-7'>
                                        <img src="https://cdn-icons-png.freepik.com/512/9520/9520267.png" alt="" />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div></div>
    )
}

export default Chatwindow