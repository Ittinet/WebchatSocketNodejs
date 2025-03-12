import { People, PersonAddAlt1 } from "@mui/icons-material"
import { Settings } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

const FriendManage = () => {
    return (
        <div className="w-full bg-[#f5f4fd] p-2 rounded-lg">
            <div className="flex gap-2">
                {/* SideBar */}
                <div className="bg-[white] max-w-[30%] w-full min-w-[200px] text-gray-500">
                    {/* Header */}
                    <div className="px-4 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold">เพื่อน</h1>
                        <Settings className="text-[#b4aac5]" size={28} />
                    </div>
                    {/* menu */}
                    <div className="text-lg">
                        <NavLink to={'/friend'} end className={({ isActive }) => isActive
                            ? "p-3 flex items-center gap-3 bg-[#f5f4fd]"
                            : "p-3 flex items-center gap-3 hover:bg-[#f5f4fd]"
                        }>
                            <People className="text-[#b4aac5]" sx={{ fontSize: 32 }} />
                            <p>เพื่อนทั้งหมด</p>
                        </NavLink>

                        <NavLink to={'/friend/friendrequest'} className={({ isActive }) => isActive
                            ? "p-3 flex items-center gap-3 bg-[#f5f4fd]"
                            : "p-3 flex items-center gap-3 hover:bg-[#f5f4fd]"
                        }>
                            <PersonAddAlt1 className="text-[#b4aac5]" sx={{ fontSize: 32 }} />
                            คำขอเป็นเพื่อน
                        </NavLink>
                    </div>
                </div>
                {/* Body */}
                <div className="bg-[white] w-[70%]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default FriendManage