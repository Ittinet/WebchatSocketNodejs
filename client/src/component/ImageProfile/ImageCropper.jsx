import { useEffect, useState } from "react"
import Cropper from "react-easy-crop"

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [croppedArea, setCroppedArea] = useState(null)
    const [aspectRatio, setAspectRatio] = useState(1 / 1);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels)
    }

    return (
        <div className="relative h-full w-full">
            <Cropper
                image={image}
                aspect={aspectRatio}
                showGrid={false}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                className="w-[50%] bg-red-500"
                style={{
                    containerStyle: {
                        width: '100%',
                        height: '70%',
                        zIndex: "60",
                        backgroundColor: 'white',  // ใช้สีพื้นหลังในรูปแบบ CSS ปกติ
                    },

                    cropAreaStyle: {
                        borderRadius: '50%',
                    }
                }}
            />
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-1/2 flex gap-5">
                <p className="text-xl">-</p>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full"
                />
                <p className="text-xl">+</p>
            </div>
            <div className="absolute bottom-12 flex w-full justify-center gap-5">
                <button onClick={() => onCropDone(croppedArea)} className="bg-[#e7c4ff] px-2 py-2 rounded-lg text-white hover:bg-[#d5a6f5]">Crop & Apply</button>
                <button onClick={() => onCropCancel()} className="bg-white px-6 py-2 rounded-lg text-[#e7c4ff] border-[#e7c4ff] border border-1 hover:bg-gray-100">Calcel</button>
            </div>
        </div>
    )
}

export default ImageCropper