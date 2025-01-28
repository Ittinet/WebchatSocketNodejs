import Routes from "./Route/Routes"
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-crop/dist/ReactCrop.css'
import { SocketProvider } from "./SocketContext";



const App = () => {
  return (
    <SocketProvider>
      <Routes />
      <ToastContainer />
    </SocketProvider>
  )
}

export default App