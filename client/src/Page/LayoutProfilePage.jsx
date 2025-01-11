import { Outlet } from "react-router-dom"
import Navbar from "../component/Navbar"


const LayoutProfilePage = () => {
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