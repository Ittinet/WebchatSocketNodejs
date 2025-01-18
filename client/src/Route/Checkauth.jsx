import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Loading from '../component/Loading'
import { useSelector } from 'react-redux'

const Checkauth = ({ element }) => {
    const [checkuser, setCheckUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const token = useSelector(state => state.auth.token)

    useEffect(() => {
        if (token) {
            handleChecktoken()
        } else {
            setLoading(false)
            setCheckUser(false)
        }

    }, [token])

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
            console.log(error)
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
                checkuser ? element : <Navigate to={'/authen'} />
            }
        </div>
    )
}

export default Checkauth