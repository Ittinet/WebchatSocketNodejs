import axios from 'axios';
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IconLoading1 from '../Icon/IconLoading1';
import { UpdatePost } from '../../Reducers/postSlice';
const PostWindow = ({ setOpenPostWindow }) => {
    const dispatch = useDispatch()

    const currentuser = useSelector(state => state.user.currentuser)
    const token = useSelector(state => state.auth.token)


    const PostWindowRef = useRef()
    const FileRef = useRef()
    const [images, setImages] = useState([])
    const [ContentInput, setContentInput] = useState('')
    const [PostLoading, setPostLoading] = useState(false)

    // true = แนวตั้ง , false = แนวนอน
    const [ImageShape, setImageShape] = useState(true)

    const handleChooseFile = () => {
        FileRef.current.click()
    }

    const handleChangeInput = (e) => {
        setContentInput(e.target.value)
    }

    const handleChangeFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = e.target.files

            for (const image of files) {
                Resizer.imageFileResizer(
                    image,
                    800,
                    800,
                    "PNG",
                    100,
                    0,
                    (data) => {
                        setImages((prev) => [...prev, data])
                    },
                    "base64"
                )
            }
        }
    }

    useEffect(() => {
        if (images.length > 0) {
            const img = new Image()
            img.src = images[0]
            img.onload = () => {
                if (img.width < img.height) {
                    // true = แนวตั้ง , false = แนวนอน
                    setImageShape(true)
                } else {
                    setImageShape(false)
                }
            }
        }
    }, [images])

    useEffect(() => {
        console.log('image', images)
    }, [images])

    const handlePost = async () => {
        try {
            setPostLoading(true)
            if (ContentInput) {
                const res = await axios.post(`http://localhost:8000/api/post`, {
                    content: ContentInput,
                    images: images,
                    shapeImage: ImageShape
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(res.data)

                toast.success('โพสต์สำเร็จ!')
                dispatch(UpdatePost(res.data.data))
                setOpenPostWindow(false)
            } else {
                toast.error('กรุณาเพิ่มเนื้อหา !')
            }
        } catch (error) {
            console.log(error)
            toast.error('เกิดข้อผิดพลาดบางอย่าง')
            setOpenPostWindow(false)
        } finally {
            setPostLoading(false)
        }



    }



    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (PostWindowRef.current && !PostWindowRef.current.contains(e.target)) {
                setOpenPostWindow(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutSide)

        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [])



    return (
        <div className='fixed flex w-full justify-center items-center inset-0 z-[997]'>

            {/* background */}
            <div className='fixed inset-0  bg-black opacity-70 z-[998]'> </div>

            {/* Mainbody */}
            <div ref={PostWindowRef} className='bg-[#e8e2fd] fixed max-w-[500px] w-full z-[999] rounded-lg'>
                {/* Headers */}
                <div className='text-center relative py-4 border-b mx-3 border-[#ded4ee]'>
                    <p className='text-gray-700 font-bold text-xl'>สร้างโพส</p>
                    <button onClick={() => setOpenPostWindow(false)} className='absolute right-0 top-3 hover:bg-[#dfd6ee] rounded-full p-1 cursor-pointer'><X className='text-gray-500' size={25} /></button>
                </div>

                {/* body */}
                <div className='space-y-4 pb-4 pt-2'>
                    {/* icon */}
                    <div className='flex gap-3 px-4 py-1'>
                        <div>
                            <div className='w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden'><img className=' object-cover' src={currentuser ? currentuser.profile_cropped : ''} alt="" /></div>
                        </div>
                        <div className='space-y-1'>
                            <p className='font-bold px-1'>{currentuser ? currentuser.username : '?'}</p>
                            <button onClick={() => console.log(images)} className='bg-[#e0d5fa] py-[0.5px] px-2 rounded-sm text-[14px] font-bold text-gray-600'>สาธารณะ</button>
                        </div>
                    </div>
                    {/* input */}
                    <div className='overflow-y-auto max-h-[600px] px-4 '>
                        <div className='py-1'>
                            <textarea onChange={handleChangeInput} className={`w-full bg-[#f9f5ff] rounded-lg px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#cacaf8] ${images ? 'h-[80px]' : 'h-[150px]'}`} placeholder='คุณกำลังคิดอะไรอยู่....' type="text" />


                            {/* ImageShow */}
                            {


                                images.length > 0 && <div className='p-2 border border-1 border-[#cccaca] rounded-md overflow-hidden'>
                                    {
                                        images && images.length > 0 && images.length < 3
                                            ?
                                            <div className='flex gap-2'>
                                                {images.map((item, index) =>
                                                    <div className='w-full min-h-[450px]' key={index}>
                                                        <img className='w-full h-full object-cover' src={item} alt="" />
                                                    </div>
                                                )}
                                            </div>
                                            : images && images.length > 3 && images.length < 5
                                                ?
                                                <div>
                                                    {
                                                        ImageShape
                                                            ?
                                                            <div className='flex gap-1 h-[450px]'>
                                                                <div className=' w-3/5'>
                                                                    <img className='h-full object-cover' src={images[0]} alt="" />
                                                                </div>
                                                                <div className='w-2/5 flex flex-col gap-1'>
                                                                    {
                                                                        images.slice(1).map((item, index) =>
                                                                            <div key={index} className='flex-1  h-[30%]' >
                                                                                <img className='h-full w-full object-cover' src={item} alt="" />
                                                                            </div>
                                                                        )
                                                                    }

                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='flex flex-col gap-1 max-h-[500px]'>
                                                                <div className='w-full'>
                                                                    <img className='w-full object-cover' src={images[0]} alt="" />
                                                                </div>
                                                                <div className='flex gap-1'>
                                                                    {
                                                                        images.slice(1).map((item, index) =>
                                                                            <div key={index} className='flex-1' >
                                                                                <img className='w-full h-full object-cover' src={item} alt="" />
                                                                            </div>
                                                                        )
                                                                    }

                                                                </div>
                                                            </div>
                                                    }

                                                </div>


                                                :
                                                <div className='flex gap-1 h-[500px]'>
                                                    <div className='bg-red-200 w-3/5'>
                                                        <img className='h-full object-cover' src={images[0]} alt="" />
                                                    </div>
                                                    <div className='w-2/5 flex flex-col gap-1'>
                                                        {
                                                            images.slice(1, 4).map((item, index) =>
                                                                index === 2
                                                                    ?
                                                                    <div key={index} className='flex-1 bg-red-200 h-[30%] relative' >
                                                                        <img className='h-full w-full object-cover ' src={item} alt="" />
                                                                        <div className='bg-black opacity-40 w-full h-full absolute top-0 flex items-center justify-center z-10'></div>
                                                                        <p className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-3xl font-bold text-white z-20 shadow-lg'>+{images.slice(4).length}</p>
                                                                    </div>
                                                                    :
                                                                    <div key={index} className='flex-1 bg-red-200 h-[30%]' >
                                                                        <img className='h-full w-full object-cover' src={item} alt="" />
                                                                    </div>
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                    }
                                </div>
                            }

                        </div>
                    </div>


                    {/* option */}
                    <div className='flex gap-2 px-4'>
                        <button onClick={handleChooseFile} className="max-w-11 p-2 hover:bg-[#ded3fc] rounded-full cursor-pointer">
                            <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                        </button>
                        <button className="max-w-11 p-2 hover:bg-[#ded3fc] rounded-full cursor-pointer">
                            <img src="https://emojiisland.com/cdn/shop/products/Smiling_Face_Emoji_large.png?v=1571606036" alt="" />
                        </button>
                        {/* hidden inputFileRef */}
                        <input onChange={handleChangeFile} ref={FileRef} type="file" multiple accept='image/*' className='hidden' />
                    </div>

                    {/* botton */}
                    <div className='px-4'>
                        <button onClick={handlePost} className='bg-[#d6cefc] w-full py-2 rounded-lg text-gray-700 text-md hover:bg-[#c6beeb] flex items-center justify-center'>{PostLoading ? <IconLoading1 width={8} /> : 'โพสต์'}</button>
                    </div>

                </div>
            </div>
        </div >

    )
}

export default PostWindow