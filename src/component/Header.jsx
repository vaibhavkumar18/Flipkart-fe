import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userslice";
const Header = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const navigate = useNavigate();
    const [IsOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch();
    const User = useSelector((state) => state.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);
    const [deviceType, setDeviceType] = useState("");
    const [hamOpen, setHamOpen] = useState(false)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/Login');
    }

    const handleMouseEnter = () => {
        if (!isMobile) setIsOpen(true);
    };

    const handleMouseLeave = (e) => {
        if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    const handleToggleDropdown = () => {
        if (isMobile) setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth;

            if (width <= 767) setDeviceType("Mobile");
            else if (width <= 1024) setDeviceType("Tablet");
            else setDeviceType("Desktop/Laptop");
        };

        checkDeviceType(); // initial check
        window.addEventListener("resize", checkDeviceType);

        return () => window.removeEventListener("resize", checkDeviceType);
    }, []);

    return (
        <>
            <div className="navbar flex lg:justify-evenly md:justify-evenly justify-around items-center shadow-md bg-white pr-[15px] h-[7vh] md:h-[9vh] w-[98%] lg:h-[10vh] z-1000 lg:mt-[20px] mt-[25px] m-[2px] rounded-full">
                <div className="logo flex justify-center items-center lg:mr-[2vw]">
                    <img src={`${baseURL}/static/logo.png`} alt="Flipkart" className='cursor-pointer lg:w-[5vw] md:w-[8vw] w-[9vw]' onClick={() => navigate("/")} />
                </div>
                <div className="search  flex  justify-center items-center bg-[#f0f5ff] w-[55vw] md:w-[40vw] h-[4vh] lg:w-[45vw] shadow-md lg:h-[6vh] rounded-[10px]  lg:pl-[10px] md:pl-[10px] mr-[5px] ">
                    <div className='lg:w-[2vw] w-[1vw] cursor-pointer '>
                        <img src={`${baseURL}/static/search.png`} alt="search" className='w-[1.5vw] lg:w-[2vw] mr-[50px] lg:mr-[5px]' />
                    </div>
                    <input type='text' className=' text-black w-[50vw] lg:w-[45vw] md:w-[40vw] border-none focus:outline-none lg:h-[6vh] h-[4vh] text-left pl-[10px] text-[10px] lg:text-lg font-normal  cursor-pointer items-center bg-[#f0f5ff] ' placeholder='Search For Products, Brands and More' />
                </div>
                {/* desktop code  */}
                {deviceType == "Desktop/Laptop" || deviceType == "Tablet" ? (
                    <div className="sections flex justify-center items-center ">
                        <ul className=" flex justify-center items-center lg:gap-10 md:gap-5 gap-2 text-[8px] lg:text-xl font-semibold">
                            <div className="home flex justify-center items-center lg:hover:scale-110 cursor-pointer" onClick={() => navigate("/")}>
                                <li className='cursor-pointer rounded-[10px] text-black lg:text-[20px] md:text-[15px] text-[12px]' onClick={() => navigate("/")}>Home</li>
                            </div>
                            {(isAuthenticated) ? (
                                <>
                                    <div
                                        className="relative inline-block"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        ref={dropdownRef}
                                    >
                                        <li className='cursor-pointer hover:scale-110 rounded-[10px] lg:text-[20px] md:text-[15px] p-[5px]  text-black  '
                                            onClick={handleToggleDropdown}
                                        >Hi,&nbsp;{User.user.Username}</li>
                                        {IsOpen && (<>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[5rem] lg:w-[10rem] bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-md border z-50  "
                                            // Close when leaving dropdown
                                            >
                                                <ul className="py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => navigate("/MyProfile")}>
                                                    <div className="signup-container flex justify-between items-center cursor-pointer mb-[5px] mt-[5px]" >
                                                        <li className='cursor-pointer lg:text-sm text-[10px] pl-[1vw] ' onClick={() => navigate("/MyProfile")}>My Profile</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[5rem] h-[1px] bg-gray-500"></div>
                                                <ul className=" py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => navigate("/Order")}>
                                                    <div className="signup-container flex items-center cursor-pointer mb-[5px] mt-[5px]" >
                                                        <li className='cursor-pointer lg:text-sm text-[10px]  flex items-center pl-[1vw] ' onClick={() => navigate("/Order")}>Orders</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[5rem] h-[1px] bg-gray-500"></div>
                                                <ul className="py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => handleLogout()}>
                                                    <div className="signup-container flex justify-between items-center cursor-pointer mb-[5px] mt-[5px]" >
                                                        <li className='cursor-pointer lg:text-sm text-[10px] pl-[1vw]   ' onClick={() => handleLogout()}>Logout</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[5rem] h-[1px] bg-gray-500"></div>
                                            </div>
                                        </>)}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="relative inline-block"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        ref={dropdownRef}
                                    >
                                        <div className={`container flex flex-row items-center `} >
                                            <li className={`cursor-pointer hover:scale-110 rounded-[10px] p-[5px] text-black lg:text-[20px] md:text-[15px] text-[12px]`}
                                                onClick={() => navigate("/Login")}
                                            >Login
                                            </li>
                                            {IsOpen ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" onClick={handleToggleDropdown}>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" onClick={handleToggleDropdown}>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            )}
                                        </div>
                                        {IsOpen && (<>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[5rem] lg:w-[10rem] bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-md border z-50  "
                                            // Close when leaving dropdown
                                            >
                                                <ul className="py-2 lg:p-[5px] p-[2px] hover:bg-[#fafafa]">
                                                    <div className="signup-container flex justify-between pl-[1vw] flex-col cursor-pointer lg:mb-[15px] lg:mt-[5px] mb-[0px] mt-[1px]">
                                                        <span>
                                                            <li className='cursor-pointer lg:text-sm md:text-[9px]  ' onClick={() => navigate("/SignUp")}>New Customer?</li>
                                                        </span>
                                                        <li className='cursor-pointer lg:text-sm md:text-[9px] ' onClick={() => navigate("/SignUp")}>Sign Up</li>
                                                    </div>
                                                </ul>

                                                <div className="lg:w-[10rem] w-[6rem] h-[1px] bg-gray-300"></div>
                                                <ul className="py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => navigate("/MyProfile")}>
                                                    <div className="signup-container flex justify-between items-center cursor-pointer mb-[5px] mt-[5px]" onClick={() => navigate("/MyProfile")}>
                                                        <li className='cursor-pointer lg:text-sm text-[10px] pl-[1vw] '>My Profile</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[6rem] h-[1px] bg-gray-500"></div>
                                                <ul className="py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => navigate("/Order")}>
                                                    <div className="signup-container flex justify-between items-center cursor-pointer mb-[5px] mt-[5px]" onClick={() => navigate("/Order")}>
                                                        <li className='cursor-pointer lg:text-sm text-[10px] pl-[1vw]  '>Orders</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[6rem] h-[1px] bg-gray-500"></div>
                                                <ul className="py-1 hover:bg-[#fafafa] flex flex-row items-center cursor-pointer" onClick={() => handleLogout()}>
                                                    <div className="signup-container flex justify-between items-center cursor-pointer mb-[5px] mt-[5px]" onClick={() => handleLogout()}>
                                                        <li className='cursor-pointer lg:text-sm text-[10px] pl-[1vw]  ' onClick={() => handleLogout()}>Logout</li>
                                                    </div>
                                                </ul>
                                                <div className="lg:w-[10rem] w-[6rem] h-[1px] bg-gray-500"></div>

                                            </div>
                                        </>)}
                                    </div>
                                </>
                            )}
                            <div className=" flex flex-row items-center lg:hover:scale-110 cursor-pointer mr-[5px]" onClick={() => navigate("/CartPage")}>
                                <li className='cursor-pointer lg:hover:scale-110 rounded-[10px] text-[10px] md:text-[15px]  lg:text-[22px] text-black' onClick={() => navigate("/CartPage")}>Cart</li>
                            </div>

                        </ul>
                    </div>
                ) : (
                    <>
                        <div className="mobile">
                            {!hamOpen ? (
                                <div className="hamburger cursor-pointer" onClick={() => { setHamOpen(!hamOpen) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={"25px"} viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
                                </div>
                            ) :
                                (
                                    <>
                                        <div
                                            className={`slide fixed top-0 right-0 h-screen xxs:w-full w-[50vw] bg-white z-[9999] transform transition-transform duration-500 ease-[cubic-bezier(.17,.67,.83,.67)] ${hamOpen ? "translate-x-0" : "-translate-x-full"}`}
                                        >
                                            <div className="containe ml-[30px]">
                                                <div className="close w-full flex justify-start mt-5 mb-5 cursor-pointer" onClick={() => { setHamOpen(!hamOpen) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[30px] cursor-pointer ' viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                                                </div>

                                                <div className="content xxs:text-base text-xl flex flex-col gap-5">
                                                    <h1 className='cursor-pointer' onClick={() => {
                                                        setHamOpen(!hamOpen)
                                                        navigate("/")
                                                    }}>Home</h1>
                                                    <h1 className='cursor-pointer' onClick={() => {
                                                        setHamOpen(!hamOpen)
                                                        navigate("/MyProfile")
                                                    }}>MyProfile</h1>
                                                    <h1 className='cursor-pointer' onClick={() => {
                                                        setHamOpen(!hamOpen)
                                                        navigate("/Order")
                                                    }}>Orders</h1>
                                                    <h1 className='cursor-pointer' onClick={() => {
                                                        setHamOpen(!hamOpen)
                                                        navigate("/CartPage")
                                                    }}>Cart</h1>
                                                    <h1 className='cursor-pointer' onClick={() => {
                                                        setHamOpen(!hamOpen)
                                                        handleLogout()
                                                    }}>Logout</h1>
                                                </div>

                                            </div>

                                        </div>




                                    </>
                                )}


                        </div>
                    </>

                )}

            </div >
        </>
    )
}
export default Header
