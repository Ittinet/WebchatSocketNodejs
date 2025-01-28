import { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import FileInput from '../../component/ImageProfile/FileInput';
import ImageCropper from '../../component/ImageProfile/ImageCropper';

const ReelsPage = () => {
    const [image, setImage] = useState('')
    const [currentPage, setCurrentPage] = useState("choose-img")
    const [imageAfterCrop, setImageAfterCrop] = useState('')

    const onImageSelected = (selectedimg) => {
        setImage(selectedimg)
        setCurrentPage("crop-img")
    }

    const onCropDone = (imgCropped) => {
        const canvas = document.createElement("canvas")
        canvas.width = imgCropped.width;
        canvas.height = imgCropped.height;

        const context = canvas.getContext("2d")

        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = () => {
            context.drawImage(
                imageObj1,
                imgCropped.x, imgCropped.y, // ตำแหน่งเริ่มต้นบนภาพต้นฉบับ
                imgCropped.width, imgCropped.height, // ขนาดที่ต้องการครอบ
                0,  0,  // ตำแหน่งที่วาดภาพใน canvas
                imgCropped.width,imgCropped.height // ขนาดใน canvas
            )
            const dataURL = canvas.toDataURL("image/jpeg")

            setImageAfterCrop(dataURL)
            setCurrentPage('choose-img')
            console.log('imageobj', imageObj1)
        }


    }

    const onCropCancel = () => {
        setCurrentPage('choose-img')
    }

    return (
        <div className='mt-10'>
            <div className='w-full bg-[#eeeeee] p-5 flex flex-col'>
                {currentPage === 'choose-img' ?
                    <FileInput onImageSelected={onImageSelected} />
                    : currentPage === 'crop-img' ?
                        <ImageCropper
                            image={image}
                            onCropDone={onCropDone}
                            onCropCancel={onCropCancel}

                        />
                        : <div>

                        </div>
                }
                <div className='w-[300px] h-[300px] flex rounded-full overflow-hidden'>
                    <img src={imageAfterCrop} alt="" />
                </div>

            </div>
        </div>
    );
};

export default ReelsPage;

