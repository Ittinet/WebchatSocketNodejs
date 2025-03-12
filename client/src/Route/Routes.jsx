import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Checkauth from './Checkauth'
import RegistrationPage from '../Auth/RegistrationPage'
import MainPage from '../Page/MainPage'
import Home from '../Page/SubPage/Home'
import ReelsPage from '../Page/SubPage/ReelsPage'
import ProfileUser from '../Page/SubPage/ProfileUser'
import FriendManage from '../Page/SubPage/FriendManage/FriendManage'
import Friendship from '../Page/SubPage/FriendManage/Friendship'
import FriendRequest from '../Page/SubPage/FriendManage/FriendRequest'



const router = createBrowserRouter([
    {
        path: '/',
        element: <Checkauth element={<MainPage />} />,
        children: [
            { index: true, element: < Home /> },
            { path: 'reels', element: <ReelsPage /> },
            { path: ':id', element: <ProfileUser /> },
            {
                path: 'friend',
                element: <FriendManage />,
                children: [
                    { index: true, element: <Friendship /> },
                    { path: 'friendrequest', element: <FriendRequest /> }
                ]
            }
        ]
    },
    {
        path: '/authen',
        element: <RegistrationPage />
    }
])

const Routes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Routes