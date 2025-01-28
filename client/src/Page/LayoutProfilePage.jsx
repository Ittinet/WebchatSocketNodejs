import { Outlet } from "react-router-dom"
import Navbar from "../component/Navbar"
import LayoutEditImage from "../component/ImageProfile/LayoutEditImage"
import { useState } from "react"
import { useSelector } from "react-redux"


const LayoutProfilePage = () => {
    const isOpenEditImage = useSelector((state => state.user.isOpenEditImage))

    return (
        <div className="relative">
            {/* Navbar */}
            <div className="sticky top-0 z-[80] drop-shadow-md">
                <Navbar />
            </div>

            {/* body */}
            <div className="max-w-[1200px] mx-auto mt-10">
                <Outlet />
            </div>

            

        </div>
    )
}

export default LayoutProfilePage