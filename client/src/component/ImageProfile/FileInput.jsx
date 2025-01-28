import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import Resizer from "react-image-file-resizer";

const FileInput = ({ setPageMode, setImage }) => {
    const FileRef = useRef()

    const handleChooseImage = () => {
        FileRef.current.click()
    }

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            Resizer.imageFileResizer(
                file,
                800,
                800,
                "PNG",
                100,
                0,
                (data) => {
                    setImage(data)
                    setPageMode('edit')
                },
                "base64"
            )


            // const reader = new FileReader()
            // reader.readAsDataURL(e.target.files[0])
            // reader.onload = (e) => {
            //     onImageSelected(reader.result)
            // }
        }
    }

    return (
        <div>
            <input onChange={handleChange} className='hidden' accept='image/*' type="file" ref={FileRef} />
            <button onClick={handleChooseImage} className='bg-[#fdfdfd] p-5 rounded-xl w-full text-[#c29add] font-bold text-xl border border-[#d3b2f8] flex justify-center items-center gap-5 cursor-pointer hover:scale-95'>
                <div className="max-w-10">
                    <img src="https://firebasestorage.googleapis.com/v0/b/projectwtelogin-b9a23.appspot.com/o/iconChatWeb%2Fpictures.png?alt=media&token=61e4886f-b74e-4867-b842-7322e7234ec5" alt="" />
                </div>
                อัพโหลดรูปภาพ
            </button>
        </div>
    )
}

export default FileInput