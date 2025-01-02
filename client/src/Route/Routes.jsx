import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Checkauth from './Checkauth'
import RegistrationPage from '../Auth/RegistrationPage'
import MainPage from '../Page/MainPage'
import Home from '../Page/SubPage/Home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RegistrationPage />
    },
    {
        path: '/chat',
        element: <Checkauth element={<MainPage />} />,
        children: [
            {
                index: true, element: <Home />
            }
        ]
    }
])

const Routes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Routes