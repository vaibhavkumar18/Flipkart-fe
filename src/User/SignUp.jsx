import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import { signup } from "../redux/userslice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
const SignUp = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [userdata, setuserdata] = useState({ Name: "", Email: "", Password: "", Gender: "", Address: [], Phone_Number: "", addToCart: [], Orders: [], Username: "" })
    const handlechange = (e) => {
        setuserdata({ ...userdata, [e.target.name]: e.target.value })
    }
    const Signup = async () => {
        if (userdata.Name.length > 0 && userdata.Email.length > 0 && userdata.Password.length > 0 && userdata.Phone_Number.length == 10) {
            const username = userdata.Email.split('@')[0]
            console.log("Userdata", { ...userdata, Username: username })
            const response = await fetch(`${baseURL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Username: username,
                    Name: userdata.Name,
                    Email: userdata.Email,
                    Password: userdata.Password,
                    Gender: userdata.Gender,
                    Address: userdata.Address,
                    Phone_Number: userdata.Phone_Number,
                    addToCart: userdata.addToCart,
                    Orders: userdata.Orders,
                    id: uuidv4()
                })
            });
            const data = await response.json()
            if (data.success) {
                dispatch(signup({
                    ...userdata,
                    Username: username
                }));
                navigate("/")

            } else {
                alert("This Email Already Exist!!!");
            }
        }
    }
    return (
        <>
            <div className="containe items-center flex justify-center w-full mt-[40px] ">
                <div className="signup-containe lg:w-[55vw] m-[20px] md:w-[70vw] sm:w-[40vh] shadow-[0_20px_15px_5px_rgb(0_0_0_/_0.15),_0_10px_20px_-4px_rgb(0_0_0_/_0.15)] lg:max-h-[110vh] md:max-h-[100vh] max-h-[80vh] flex p-0 rounded-xl border-2 border-black">

                    <div className="left-block lg:w-[25vw] lg:h-[80vh]  w-[35vw] lg:pr-0 pr-[10px]  bg-[#2874f0] text-white flex items-center flex-col rounded-xl">

                    </div>

                    <div className="right-block lg:w-[35vw] w-[60vw]">
                        <div className="container flex justify-center items-center flex-col lg:ml-[50px] md:ml-[40px] ml-[20px] mt-[50px] gap-[25px]">
                            {/* Name  */}
                            <div className="relative w-full Name  ">
                                <input
                                    type="text"
                                    id="Name"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-6 pb-2 cursor-pointer"
                                    placeholder=" "
                                    value={userdata.Name}
                                    name="Name"
                                    onChange={(e) => handlechange(e)}
                                />
                                <label htmlFor="Name"
                                    className="absolute left-0 text-gray-500 lg:text-base md:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold">
                                    Enter Your Name
                                </label>
                            </div>
                            {/* Phone Number  */}
                            <div className="relative w-full phone-number  ">
                                <input
                                    type="tel"
                                    id="Phone-number"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-6 pb-2 cursor-pointer"
                                    placeholder=" "
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    value={userdata.Phone_Number}
                                    name="Phone_Number"
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                        if (onlyNumbers.length <= 10) {
                                            // Create a custom event-like object so your handlechange still works
                                            handlechange({
                                                target: {
                                                    name: "Phone_Number",
                                                    value: onlyNumbers,
                                                },
                                            });
                                        }
                                    }}
                                // onChange={(e) => handlechange(e)}
                                />
                                < label htmlFor="Phone-number"
                                    className="absolute left-0 text-gray-500 lg:text-base md:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold" >
                                    Enter Phone Number
                                </label>
                            </div>
                            {/* Email  */}
                            <div className="relative w-full email  ">
                                <input
                                    type="text"
                                    id="Email"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-6 pb-2 cursor-pointer"
                                    placeholder=" "
                                    name='Email'
                                    value={userdata.Email}
                                    onChange={(e) => handlechange(e)}
                                />
                                <label htmlFor="Email"
                                    className="absolute left-0 text-gray-500 lg:text-base md:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold">
                                    Enter Email
                                </label>
                            </div>

                            {/* Password  */}
                            <div className="relative flex flex-row items-center j w-full ">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="Password"
                                    className="peer w-[80%] border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 text-base pt-10 pb-1 cursor-pointer"
                                    placeholder=" "
                                    name='Password'
                                    value={userdata.Password}
                                    onChange={(e) => handlechange(e)}
                                />
                                <label htmlFor="Password"
                                    className="absolute left-0 text-gray-500 lg:text-base md:text-base text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 whitespace-nowrap cursor-pointer font-bold">
                                    Enter Password
                                </label>
                                {showPassword ? (
                                    <>
                                        <img src={`${baseURL}/static/hide.png`} alt="show" onClick={() => { setShowPassword(false) }} className="w-6 h-6 sm:w-6 sm:h-6 mr-[30px] " />
                                    </>
                                ) : (
                                    <>
                                        <img src={`${baseURL}/static/show.png`} alt="show" onClick={() => { setShowPassword(true) }} className="w-6 h-6 sm:w-6 sm:h-6 mr-[30px]" />
                                    </>
                                )}

                            </div>
                        </div>

                        {/* Sign Up  */}
                        <div className="signup-btn flex justify-center items-center mt-[40px]">
                            <button className='border-black border-2 w-[28vw] lg:text-xl md:text-lg  text-sm font-bold h-[6vh] bg-orange-500 text-white hover:scale-90' onClick={() => Signup()} disabled={userdata.Name == "" && userdata.Email == "" && userdata.Password == ""}>Sign Up</button>
                        </div>

                        {/* Login  */}
                        <div className="relative lg:p-4 lg:bottom-[-87px] bottom-[-80px] lg:text-lg md:text-lg text-base">
                            <div className="create-account left-0 flex justify-center lg:flex-row flex-col items-center gap-[5px] md:flex-row">
                                <div onClick={() => { navigate("/Login") }} className="text-blue-500 cursor-pointer ">Existing User? </div>
                                <div onClick={() => { navigate("/Login") }} className="text-blue-500 "> Log in</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SignUp
