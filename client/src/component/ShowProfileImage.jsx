import { useEffect, useRef } from "react"

const ShowProfileImage = ({ imageProfile, setIsOpenProfileImage }) => {
    const imageRef = useRef()

    useEffect(() => {
        const handleClickOutside = (e) => {
            setIsOpenProfileImage(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div>
            <div className="fixed inset-0 bg-black opacity-70 z-[200]"></div>
            <div className="fixed z-[201] h-full px-10 left-[50%] -translate-x-[50%] top-0">
                <div className="w-full h-full min-w-[400px] flex">
                    <img ref={imageRef} className="object-contain w-full h-full" src={imageProfile} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ShowProfileImage