import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Getcurrentuser } from "../Reducers/userSlice"

const Sidebar = () => {
    // const CurrentUser = useDataStore(state => state.CurrentUserData)
    // const GetCurrentUser = useDataStore(state => state.getCurrentUserData)

    const CurrentUser = useSelector(state => state.user.currentuser)
    const token = useSelector(state => state.auth.token)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(Getcurrentuser(token))
    }, [token])

    return (
        <div className=" py-5 px-2 flex flex-col gap-2">

            <div className="flex items-center gap-3 border-b py-3 px-5 hover:bg-[#f8e6e6] rounded-lg">
                <div className="max-w-14">
                    <img src={CurrentUser?.profile_picture} alt="" />
                </div>
                <p className="text-xl">{CurrentUser?.username}</p>
            </div>

            <div className="hover:bg-[#f8e6e6] px-5 py-4 rounded-lg flex items-center gap-4">
                <div className="max-w-10">
                    <img src="https://cdn-icons-png.flaticon.com/512/3429/3429199.png" alt="" />
                </div>
                <p className="text-xl">เพื่อน</p>
            </div>
            <div className="hover:bg-[#f8e6e6] px-5 py-4 rounded-lg flex items-center gap-4">
                <div className="max-w-10">
                    <img src="https://cdn-icons-png.flaticon.com/512/6546/6546704.png" alt="" />
                </div>
                <p className="text-xl">ข้อความ</p>
            </div><div className="hover:bg-[#f8e6e6] px-5 py-4 rounded-lg flex items-center gap-4">
                <div className="max-w-10">
                    <img src="https://icons.veryicon.com/png/o/miscellaneous/admin-dashboard-flat-multicolor/setting-19.png" alt="" />
                </div>
                <p className="text-xl">ตั้งค่า</p>
            </div>
        </div>
    )
}

export default Sidebar