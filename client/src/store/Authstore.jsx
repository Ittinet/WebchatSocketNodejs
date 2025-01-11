import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

const authStore = (set) => ({
    token: null,
    user: null,
    actionRegister: async (form) => {
        try {
            const res = await axios.post("http://localhost:8000/api/register", form)
            if (res) {
                const reslogin = await axios.post("http://localhost:8000/api/login", form)
                set({
                    token: reslogin.data.token,
                    user: reslogin.data.payload
                })
            }
            toast.success(res.data.message)
            return res

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    },
    actionLogin: async (form) => {
        try {
            const res = await axios.post("http://localhost:8000/api/login", form)
            set({
                token: res.data.token,
                user: res.data.payload
            })
            toast.success(res.data.message)
            return res
        } catch (error) {
            console.log(error)
            if (!error.response) {
                toast.error("เซิฟเวอร์ปปิดปรับปรุงกรุณาลองใหม่ในภายหลัง")
            }
            toast.error(error.response.data.message)
        }
    }

})



const usePersist = {
    name: 'chat-app',
    storage: createJSONStorage(() => localStorage)
}

const useAuthStore = create(persist(authStore, usePersist))

export default useAuthStore;