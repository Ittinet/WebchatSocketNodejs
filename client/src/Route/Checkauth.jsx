import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Loading from '../component/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useSocket } from '../SocketContext'
import { GetcurrentFriend, updateOfflineStatus, updateOnlineStatus } from '../Reducers/userSlice'
import { UpdateChatIsOffline, UpdateChatIsOnline } from '../Reducers/chatSlice'

const Checkauth = ({ element }) => {
    const dispatch = useDispatch()
    const { connectSocket } = useSocket();
    const [checkuser, setCheckUser] = useState(false)
    const [isSocketConnected, setIsSocketConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const token = useSelector(state => state.auth.token)

    const user = useSelector(state => state.auth.user)
    const currentFriend = useSelector(state => state.user.currentFriend)



    useEffect(() => {
        if (token) {
            handleChecktoken()
        } else {
            setLoading(false)
            setCheckUser(false)
        }

    }, [token])

    useEffect(() => {
        if (checkuser) {
            const socketInstance = io('http://localhost:8000', {
                extraHeaders: {
                    Authorization: `Bearer ${token}`
                },

            })

            socketInstance.on('connect', () => {
                console.log("Connected with socket id", socketInstance.id)
                connectSocket(socketInstance)
                setIsSocketConnected(true)
                socketInstance.emit('updateStatus', { userid: user.user_id, socketid: socketInstance.id })
                dispatch(GetcurrentFriend(token))

            })

            // ถ้า socket หลุด
            socketInstance.on('disconnect', (reason) => {
                console.log('Socket disconnected due to:', reason);  // log reason for disconnect
                // setIsSocketConnected(false);
            });

            socketInstance.on('connect_error', (error) => {
                console.log(error)
                setIsSocketConnected(false)
            })

            // อัพเดท Status เมื่อ online  อัพเดทตั้งข้อมูลแชท และข้อมูลเพื่อน
            socketInstance.on('isUserOnline', ({ userid, socketid }) => {
                dispatch(updateOnlineStatus({ userid, socketid }))
                dispatch(UpdateChatIsOnline({ userid, socketid }))
                console.log('restart', socketid)
            })

            //อัพเดท Status เมื่อ Offline อัพเดทตั้งข้อมูลแชท และข้อมูลเพื่อน
            socketInstance.on('isUserOffline', ({ userid, socketid }) => {
                dispatch(updateOfflineStatus({ userid, socketid }))
                dispatch(UpdateChatIsOffline({ userid, socketid }))
            })
            return () => {
                socketInstance.close()
                setIsSocketConnected(false)
            }
        }

    }, [checkuser, token, user])




    const handleChecktoken = async () => {
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/checklogin', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCheckUser(true)

            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.log('Token Check Failed', error)
            setLoading(false)
            setCheckUser(false)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            {
                checkuser && isSocketConnected ? element : <Navigate to={'/authen'} />
            }
        </div>
    )
}

export default Checkauth

