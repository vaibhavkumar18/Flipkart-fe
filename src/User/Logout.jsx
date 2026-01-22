import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userslice";
import LogoutLoader from "../component/LogoutLoader";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const doLogout = async () => {
            try {
                await fetch(`${baseURL}/logout`, {
                    method: "POST",
                    credentials: "include",
                });
            } catch (e) {
                console.error(e);
            }

            setTimeout(() => {
                dispatch(logout());
                navigate("/Login");
            }, 2000);
        };

        doLogout();
    }, []);

    return <LogoutLoader />; // 🔥 FULL SCREEN
};

export default Logout;
