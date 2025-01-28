import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OpenEditImage, updateProfileImage } from '../../Reducers/userSlice'
import FileInput from './FileInput'
import ImageCropper from './ImageCropper'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'

const LayoutEditImage = ({ setUserData }) => {
    const dispatch = useDispatch()
    const bodyRef = useRef()

    const token = useSelector(state => state.auth.token)

    const [PageMode, setPageMode] = useState('select')
    const [image, setImage] = useState('')
    const [Loading, setLoading] = useState(false)

    const onCropDone = (croppedImage) => {
        const canvas = document.createElement('canvas')
        canvas.width = croppedImage.width
        canvas.height = croppedImage.height

        const context = canvas.getContext("2d")

        const ImageObj = new Image()
        ImageObj.src = image
        ImageObj.onload = async () => {
            setLoading(true)
            context.drawImage(
                ImageObj,
                croppedImage.x, croppedImage.y, // ตำแหน่งเริ่มต้นบนภาพต้นฉบับ
                croppedImage.width, croppedImage.height, // ขนาดที่ต้องการครอบ
                0, 0, // ตำแหน่งที่วาดภาพใน canvas
                croppedImage.width, croppedImage.height // ขนาดใน canvas
            )
            const imagecropped = canvas.toDataURL('image/png')

            const res = await axios.post('http://localhost:8000/api/profile', { image, imagecropped: imagecropped }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(updateProfileImage({ image: res.data.resultImage.url, imagecropped: res.data.resultImageCropped.url }))
            setUserData((prev) => ({
                ...prev,
                profile_picture: res.data.resultImage.url,
                profile_cropped: res.data.resultImageCropped.url
            }))
            setLoading(false)
            setImage('')
            dispatch(OpenEditImage(false))
        }
    }

    const onCropCancel = () => {
        setPageMode('select')
        setImage('')
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bodyRef.current && !bodyRef.current.contains(e.target)) {
                dispatch(OpenEditImage(false))
            }
        }
        if (!Loading) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            // เมื่อ Loading เป็น true ให้ไม่สามารถคลิกได้
            document.body.style.overflowY = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [Loading])



    return (
        <div className="fixed inset-0 flex justify-center items-center px-5 z-[100] ">

            {/* พื้นหลัง */}
            <div className='fixed inset-0 bg-black opacity-60 top-0 z-[100]'> </div>

            {/* Body */}
            <div ref={bodyRef} className='bg-[#f5effa] w-full h-[700px] max-w-[700px] z-[101] rounded-xl p-5'>
                {
                    image && PageMode === 'edit'
                        ? <ImageCropper image={image} onCropDone={onCropDone} onCropCancel={onCropCancel} />
                        : <div className='w-full h-full bg-[#f0e4ff] rounded-xl py-5 px-5'>
                            {/* header */}
                            <div className='w-full flex justify-center items-center p-1 mb-5'>
                                <h1 className='text-2xl font-bold text-gray-600'>เลือกรูปภาพ</h1>
                            </div>
                            {/* body */}
                            <div className='w-full'>
                                <FileInput setPageMode={setPageMode} setImage={setImage} />
                            </div>
                        </div>

                }

            </div>

            {
                Loading &&
                <div className='w-full fixed z-[198] flex justify-center'>
                    <div className='fixed bg-black opacity-50 w-full h-full z-[199] top-0 flex'>
                    </div>
                    <div className='z-[200] fixed opacity-100 top-[400px]'>
                        <ThreeDots
                            visible={true}
                            height="100"
                            width="100"
                            color="#fff"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default LayoutEditImage
