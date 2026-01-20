// ✅ userActions.js
import axios from 'axios';
import { loginSuccess } from './userslice';
const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env

export const fetchUserData = (username) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/api/user/profile`);
        dispatch(loginSuccess(res.data));
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};
