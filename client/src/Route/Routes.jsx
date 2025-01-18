import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Checkauth from './Checkauth'
import RegistrationPage from '../Auth/RegistrationPage'
import MainPage from '../Page/MainPage'
import Home from '../Page/SubPage/Home'
import ReelsPage from '../Page/SubPage/ReelsPage'
import ProfileUser from '../Page/SubPage/ProfileUser'
import LayoutProfilePage from '../Page/LayoutProfilePage'



const router = createBrowserRouter([
    {
        path: '/',
        element: <Checkauth element={<MainPage />} />,
        children: [
            { index: true, element: < Home /> },
            { path: 'reels', element: <ReelsPage /> },
            { path: ':id', element: <ProfileUser /> }
        ]
    },
    {
        path: '/profile',
        element: <Checkauth element={<LayoutProfilePage />} />,
        children: [
            { path: ':id', element: <ProfileUser /> }
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