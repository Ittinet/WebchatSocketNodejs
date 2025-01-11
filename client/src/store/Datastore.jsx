import axios from "axios"
import { create } from "zustand"


const dataStore = (set) => ({
    CurrentUserData: null,
    getCurrentUserData: async (token) => {
        try {
            const res = await axios.get('http://localhost:8000/api/user/currentuser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({
                CurrentUserData: res.data.userData
            })
        } catch (error) {
            console.log(error)
        }
    }
})



const useDataStore = create(dataStore)

export default useDataStore;