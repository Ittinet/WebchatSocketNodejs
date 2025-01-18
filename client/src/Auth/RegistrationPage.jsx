import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Login, Register } from "../Reducers/authSlice"
import { toast } from "react-toastify"

const LoginState = {
    email: '',
    password: ''
}

const RegisterState = {
    email: '',
    password: '',
    username: ''
}

const RegistrationPage = () => {
    const dispatch = useDispatch()

    const [switchRL, setswitchRL] = useState('signin')
    const [LoginForm, setLoginForm] = useState(LoginState)
    const [RegisterForm, setRegisterForm] = useState(RegisterState)

    const loading = useSelector(state => state.auth.loading)



    const navigate = useNavigate()

    const handleswitch = (value) => {
        setswitchRL(value)
    }

    const handleSubmitRegister = async (e) => {
        e.preventDefault()
        // const res = await actionRegister(RegisterForm)
        // if (res) {
        //     navigate('/')
        // }
        const res = await dispatch(Register(RegisterForm))
        if (res.type.endsWith('/fulfilled')) {
            navigate('/')

        } else {
            toast.error(res.payload)
        }
        console.log('res', res)
    }


    const handleChangeRegister = (e) => {
        setRegisterForm({
            ...RegisterForm,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        // const res = await actionLogin(LoginForm)
        // console.log(res)
        // if (res) {
        //     navigate('/')
        // }
        const res = await dispatch(Login(LoginForm))
        if (res.type.endsWith('/fulfilled')) {
            navigate('/')
            toast.success('เข้าสู่ระบบสำเร็จ!')
        } else {
            toast.error(res.payload)
        }
    }

    const handleChangeLogin = (e) => {
        setLoginForm({
            ...LoginForm,
            [e.target.name]: e.target.value
        })
    }



    return (
        <div className="bg-[#dad6ff] w-full h-screen">
            <div className="w-full flex justify-center">

                {/* form */}
                <div className="bg-white max-w-[700px] w-full h-[500px] mt-32 rounded-3xl relative overflow-hidden">
                    <div className="flex justify-center p-3">
                        <div className="flex relative rounded-full overflow-hidden">
                            <button onClick={() => handleswitch('signin')} className="border-l border-y px-2 py-3 rounded-l-full z-20">
                                Signin
                            </button>
                            <button onClick={() => handleswitch('signup')} className="border-r border-y px-2 py-3 rounded-r-full z-20">
                                Signup
                            </button>
                            <div className={`absolute bg-[#ffd1d4] w-20 h-16 rounded-full top-[-5px] transition-all duration-300 ${switchRL === 'signin'
                                ? '-translate-x-[15px]'
                                : 'translate-x-[60px]'
                                } `}></div>
                        </div>
                    </div>

                    <div className={`max-w-[1400px] absolute flex transition-all duration-500 ${switchRL === 'signin'
                        ? ''
                        : '-translate-x-[700px]'
                        }
                        `}>
                        <div className="flex mt-10  w-full">
                            <div className="w-[700px] px-10">
                                <form action="">
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold w-32" htmlFor="">Email:</label>
                                            <input className="bg-gray-100 px-5 py-2 rounded-full w-full" name="email" type="text" onChange={handleChangeLogin} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold w-32" htmlFor="">Password:</label>
                                            <input className="bg-gray-100 px-5 py-2 rounded-full w-full" name="password" type="text" onChange={handleChangeLogin} />
                                        </div>
                                        <button onClick={handleSubmitLogin} className="bg-[#d5bcfd] px-5 py-2 rounded-full mt-20">{loading ? 'Loading...' : 'Login'}</button>
                                    </div>
                                </form>
                            </div>

                            <div className="w-[700px] px-10">
                                <form onSubmit={handleSubmitRegister} action="">
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold w-32" htmlFor="">Username:</label>
                                            <input className="bg-gray-100 px-5 py-2 rounded-full w-full" type="text" name="username" onChange={handleChangeRegister} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold w-32" htmlFor="">Email:</label>
                                            <input className="bg-gray-100 px-5 py-2 rounded-full w-full" type="text" name="email" onChange={handleChangeRegister} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold w-32" htmlFor="">Password:</label>
                                            <input className="bg-gray-100 px-5 py-2 rounded-full w-full" type="text" name="password" onChange={handleChangeRegister} />
                                        </div>
                                        <button className="bg-[#d5bcfd] px-5 py-2 rounded-full mt-20">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default RegistrationPage