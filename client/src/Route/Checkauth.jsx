
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const checkauth = ({ element }) => {
    const checkauth = false
    return (
        <div>
            {
                checkauth ? element : <Navigate to="/" />
            }
        </div>
    )
}

export default checkauth