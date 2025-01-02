import Routes from "./Route/Routes"
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Routes />
      <ToastContainer />
    </>
  )
}

export default App