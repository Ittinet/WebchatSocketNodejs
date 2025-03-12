import { PersonRemove, Refresh } from "@mui/icons-material"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { GetcurrentFriend } from "../../../Reducers/userSlice"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

const Friendship = () => {
    const dispatch = useDispatch()
    const currentfriend = useSelector(state => state.user.currentFriend)
    const token = useSelector(state => state.auth.token)

    const [filterFriends, setFilterFriends] = useState(currentfriend)


    console.log('currentfriend', currentfriend)

    const handleDeleteFriend = async (friendid, friendname) => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/friend/${friendid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('removefriend', res.data)
            toast.success(`คุณเลิกเป็นเพื่อนกับ ${friendname} แล้ว`)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
            console.log(error)
        } finally {
            await dispatch(GetcurrentFriend(token))
            if (filterFriends.length > 0) {
                setFilterFriends(filterFriends.filter(item => item._id !== friendid))
            }
        }
    }

    const handleSearch = (e) => {
        if (!e.target.value) {
            setFilterFriends(currentfriend)
        }
        const filterfriend = currentfriend?.filter(friend =>
            friend.username.toLowerCase().includes(e.target.value.toLowerCase())
        )
        console.log(filterfriend)
        setFilterFriends(filterfriend)
    }

    return (
        <div className="p-2">
            {/* SearchBar */}
            <div className="flex items-center gap-5">
                <div className="flex">
                    <div className="bg-[#f5f4fd] py-2 px-3 rounded-lg flex items-center gap-3">
                        <Search className="text-gray-500" />
                        <input onChange={handleSearch} className="w-[400px] py-2 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#dcd5e9]" type="text" placeholder="ค้นหา...." />
                    </div>
                </div>
                <button onClick={() => {
                    setFilterFriends(currentfriend)
                }} className="hover:scale-110">
                    <Refresh className="text-[#bdacca]" sx={{ fontSize: 25 }} />
                </button>
            </div>


            {/* body */}
            <div className="flex flex-col py-5 h-[600px] overflow-y-auto">
                {/* item */}
                {
                    filterFriends.length > 0
                    &&
                    filterFriends.map((item, index) => (
                        <div key={index} className="flex justify-between items-center hover:bg-[#f7f1ff] py-4 px-3 rounded-lg">
                            <div className="flex gap-5 items-center">
                                <div>
                                    <div className="flex max-w-16 max-h-16 rounded-full overflow-hidden">
                                        <img className="w-full h-full" src={item.profile_cropped} alt="" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold">{item.username}</p>
                                    <p className="text-gray-600 text-sm">เพื่อน</p>
                                </div>
                            </div>

                            <button onClick={() => handleDeleteFriend(item._id, item.username)} className="hover:scale-110">
                                <PersonRemove className="text-[#c5b6d1]" sx={{ fontSize: 30 }} />
                            </button>
                        </div>

                    ))
                }



            </div>
        </div>
    )
}

export default Friendship