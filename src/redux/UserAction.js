// ✅ userActions.js
import axios from 'axios';
import { loginSuccess } from './userslice';
const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env

export const fetchUserData = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/api/user/profile`, {
            withCredentials: true
        });
        console.log("res",res)
        dispatch(loginSuccess(res.data.user));
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};
