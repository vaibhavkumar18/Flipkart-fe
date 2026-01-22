import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { logout } from "../redux/userslice";
import FullScreenLoader from '../component/FullScreenLoader';
import { fetchUserData } from '../redux/UserAction';
import LogoutLoader from '../component/LogoutLoader';


// --- Reusable Sidebar Component ---
// This component contains the navigation links. We'll use it for both mobile and desktop.
const ProfileSidebar = ({ onLinkClick }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const User = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation(); // Use location to determine the active path
    const dispatch = useDispatch();


    const handleNavigate = (path) => {
        navigate(path);
        if (onLinkClick) {
            onLinkClick(); // Close mobile menu on navigation
        }
    };



    const navItems = [
        { path: '/MyProfile/ProfileInfo', label: 'Profile Information' },
        { path: '/MyProfile/ManageAddress', label: 'Manage Addresses' },

    ];

    const isActive = (path) => location.pathname === path || (path === '/MyProfile/ProfileInfo' && location.pathname === '/MyProfile');

    return (
        <div className="flex flex-col max-h-full  ">
            {/* User Info Header */}
            <div className="flex items-center p-4 gap-4 border-b flex-shrink-0 bg-white ">
                <img src={`${baseURL}/static/profile.svg`} alt="profile" className="w-12 h-12" />
                <div>
                    <p className='text-xs text-gray-500'>Hello,</p>
                    <p className='font-semibold text-base'>{User.user.Username}</p>
                </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-white shadow-md">
                {/* MY ORDERS */}
                <div className="flex items-center gap-5 cursor-pointer" onClick={() => handleNavigate("/Order")}>
                    <img src={`${baseURL}/static/myorder.svg`} alt="orders" />
                    <p className='font-medium text-sm text-gray-500 hover:text-[#2874f0]'>MY ORDERS</p>
                </div>
                <hr />
                {/* ACCOUNT SETTINGS */}
                <div>
                    <div className="flex items-center gap-5 mb-2">
                        <img src={`${baseURL}/static/account.svg`} alt="account" />
                        <p className='font-medium text-sm text-gray-800'>ACCOUNT SETTINGS</p>
                    </div>
                    <div className="flex flex-col space-y-1 pl-4">
                        {navItems.map(item => (
                            <span key={item.path} onClick={() => handleNavigate(item.path)} className={`cursor-pointer p-3 rounded-md text-sm ${isActive(item.path) ? 'bg-[#f0f5ff] text-[#2874f0] font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="payments w-full">
                    <div className='flex justify-start gap-[20px] mt-[20px]'>
                        <img src={`${baseURL}/static/account.svg`} alt="" className='object-contain ' />
                        <p className='text-lg text-gray-500'>PAYMENTS</p>
                    </div>
                    <div className="personal flex flex-col w-full space-y-1 pl-4">
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >Gift Cards</p>
                        </span>
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >Saved UPI</p>
                        </span>
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >Saved Cards</p>
                        </span>

                    </div>
                </div>
                <div className='w-full h-[1px] bg-gray-300'></div>
                <div className="mystuff w-full">
                    <div className='flex justify-start gap-[20px] mt-[20px]'>
                        <img src={`${baseURL}/static/stuff.svg`} alt="" className='object-contain' />
                        <p className='text-lg text-gray-500'>My STUFF</p>
                    </div>
                    <div className="personal flex flex-col w-full space-y-1 pl-4">
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >My Coupons</p>
                        </span>
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >My Reviews & Ratings</p>
                        </span>
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >All Notifications</p>
                        </span>
                        <span className='cursor-pointer p-3 rounded-md text-sm hover:text-[#2874f0] hover:bg-[#f0f5ff]   hover:font-semibold'>
                            <p >My Wishlist</p>
                        </span>

                    </div>
                </div>
                <hr />
                {/* LOGOUT */}
                <div className="flex items-center gap-5 cursor-pointer" onClick={() => navigate("/Logout")}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#2874F0" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>
                    <p className='font-medium text-sm text-gray-500 hover:text-[#2874f0]'>LOGOUT</p>
                </div>
            </div>
        </div>
    );
};


// --- Main MyProfile Component ---
const MyProfile = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile hamburger menu


    useEffect(() => {
        document.title = "My Profile";

        if (isAuthenticated) {
            dispatch(fetchUserData())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

    }, [dispatch, isAuthenticated]);


    if (!isAuthenticated) {
        // You can navigate them to the login page directly or show a message
        // For now, keeping your "Login to access" component
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
                <img src={`https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90`} alt="Login to access" className="w-48 h-48 mb-6" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Missing Cart items?</h2>
                <p className="text-sm text-gray-500 mb-6">Login to see the items you added previously</p>
                <button onClick={() => navigate('/Login')} className="rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white px-12 py-3  text-sm font-semibold shadow-sm hover:scale-90 transition duration-200">
                    Login
                </button>
            </div>
        );
    }

    if (loading) {
        return <FullScreenLoader message='Fetching Your Details...' />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
            {/* --- Hamburger Menu logic is unchanged --- */}
            <div className="md:hidden mb-4">
                <button onClick={() => setIsMenuOpen(true)} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>
            {isMenuOpen && (
                <div className={`fixed inset-0 z-50 md:hidden`}>
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)}></div>
                    <div className={`relative w-4/5 max-w-xs h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform-none' : '-translate-x-full'}`}>
                        <ProfileSidebar onLinkClick={() => setIsMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* --- THE FIX: SWITCHING TO CSS GRID --- */}
            {/* We replaced 'flex flex-row' with 'grid' classes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Desktop Sidebar */}
                {/* We replaced 'w-1/4' with 'col-span-1' for the grid */}
                <div className="hidden md:block md:col-span-1   rounded-sm">
                    <ProfileSidebar />
                </div>

                {/* Content Area */}
                {/* We replaced 'w-3/4' with 'col-span-3' for the grid */}
                <div className="col-span-1 md:col-span-3 bg-white shadow-md rounded-sm p-4 sm:p-6">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default MyProfile;