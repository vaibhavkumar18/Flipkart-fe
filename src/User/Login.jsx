import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userslice";
import { Loader2 } from "lucide-react";
import LoginLoader from '../component/LoginLoader';

const Login = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { setislogin } = useAuth()
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();
        setErrorMessage("");
        setLoading(true);
        // Input validation
        if (!email.trim() || !password.trim()) {
            setErrorMessage("Email and Password cannot be empty.");
            setLoading(false);
            return;
        }


        let response;
        try {
            response = await fetch(`${baseURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"   // 🔥 REQUIRED
            });

        } catch (err) {
            setErrorMessage("Server unreachable.");
            setLoading(false);
            return;
        }
        const contentType = response.headers.get("content-type");

        const text = await response.text();

        // Try parsing only if it's JSON
        if (contentType && contentType.includes("application/json")) {
            try {
                const data = JSON.parse(text);
                if (data.success && data.user) {
                    const profileRes = await fetch(`${baseURL}/api/user/profile`, {
                        method: "GET",
                        credentials: "include"
                    });
                    const fullUser = await profileRes.json();
                    if (!profileRes.ok) {
                        setLoading(false);
                        return;
                    }
                    dispatch(loginSuccess(fullUser.user));
                    setislogin(false);
                    navigate("/");

                } else {
                    setErrorMessage(data.message || "Login failed");
                    setLoading(false);
                }
            } catch (err) {
                console.error("JSON parse error:", err);
                setErrorMessage("Invalid response from server.");
                setLoading(false);
            }
        } else {
            console.error("Not JSON response. Got HTML or something else.");
            setErrorMessage("Server error. Please try again later.");
        }
        // const data = await response.json()
    };
    if (loading) {
        return (
            <LoginLoader />
        );
    }

    return (
        <>
            <div
                className="max-h-screen w-full flex justify-center items-center py-[40px]"
            >
                <div className="login-containe  w-[100%] m-[20px] shadow-[0_20px_15px_5px_rgb(0_0_0_/_0.15),_0_10px_20px_-4px_rgb(0_0_0_/_0.15)]  h-[100%]  flex p-0 rounded-xl" >

                    <div className="right-block  w-[110%] p-8">
                        <div className="heading mt-[20px] flex flex-col gap-2 text-center" >
                            <h1 className='lg:text-3xl md:text-3xl text-xl font-semibold'>Welcome Back</h1>
                            <p className='lg:text-sm md:text-sm text-[15px]'>Access you Orders and Wishlist</p>
                        </div>
                        <div className="container flex justify-center items-center flex-col lg:ml-[30px] ml-[20px] mt-[15px] gap-[25px] ">

                            <div className="relative w-full email-username  ">
                                <input
                                    required
                                    type="email"
                                    id="inputField"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-6 pb-2 cursor-pointer"
                                    placeholder=" "
                                    onChange={(e) => setemail(e.target.value)}
                                />
                                <label htmlFor="inputField"
                                    className="absolute left-0 text-gray-500 lg:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold">
                                    Enter Email
                                </label>
                            </div>


                            <div className="relative flex flex-row items-center j w-full ">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-10 pb-1 cursor-pointer"
                                    placeholder=" "
                                    onChange={(e) => setpassword(e.target.value)}
                                />
                                <label htmlFor="password"
                                    className="absolute left-0 text-gray-500 lg:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold">
                                    Enter Password
                                </label>
                                {showPassword ? (
                                    <>
                                        <img src={`${baseURL}/static/hide.png`} alt="show" onClick={() => { setShowPassword(false) }} className="w-6 h-6 sm:w-6 sm:h-6 mr-[30px] lg:mr-[60px]" />
                                    </>
                                ) : (
                                    <>
                                        <img src={`${baseURL}/static/show.png`} alt="show" onClick={() => { setShowPassword(true) }} className="w-6 h-6 sm:w-6 sm:h-6 mr-[30px]" />
                                    </>
                                )}



                            </div>
                        </div>
                        <div className="login-btn flex justify-center items-center mt-[40px]">
                            <button className='rounded-full w-[28vw] lg:text-xl md:text-lg  text-sm font-bold h-[6vh] bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white hover:scale-90 transition duration-200' onClick={(e) => {

                                handleLogin(e)
                            }}>Login</button>

                        </div>
                        <div className="relative ">
                            <div className="create-account left-0 flex justify-center items-center lg:flex-row flex-col  lg:gap-[5px] lg:text-md text-sm gap-0 mt-5">
                                <div onClick={() => { navigate("/SignUp") }} className="text-blue-500 cursor-pointer ">New to Flipkart? </div>
                                <div onClick={() => { navigate("/SignUp") }} className="text-blue-500 cursor-pointer">Create Account</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
