import React from 'react'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from '../component/FullScreenLoader';
import { fetchUserData } from "../redux/UserAction";// adjust path if needed
import OrderDetail from './OrderDetail';
const Order = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const User = useSelector((state) => state.user);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [deviceType, setDeviceType] = useState("");
    const [filteropen, setFilteropen] = useState(false)
    if (User.isAuthenticated) {
        useEffect(() => {
            dispatch(fetchUserData(User.user.Username))
        }, [User.user.Username])
    }

    const statusOptions = ['On the way', 'Delivered', 'Cancelled'];
    const timeOptions = ['2025', '2024', '2023', '2022', '2021'];
    console.log(User)
    const filteredOrders = User.isAuthenticated
        ? User.user.Orders.filter(order => {
            const matchStatus = selectedStatus ? order.OrderStatus === selectedStatus : true;
            const matchTime = selectedTime ? order.DeliveredDate.year == selectedTime : true;
            return matchStatus && matchTime;
        })
        : [];

    console.log(filteredOrders)
    useEffect(() => {
        document.title = 'Orders | Ecom';
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // cleanup
    }, []);




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

            {/* the user login or not checking  */}
            {User.isAuthenticated ? (
                <>
                    {/* the user login true  */}
                    {loading ? (
                        <FullScreenLoader message='Fetching Your Order......' />
                    ) : (
                        <>
                            {/* the order is empty code  */}
                            {User.user.Orders.length == 0 ? (
                                <>
                                    <div className="flex flex-col items-center justify-center w-full h-[80vh] px-4">
                                        {/* Image */}
                                        <video
                                            src={`${baseURL}/static/order.mp4`}
                                            alt="No Orders"
                                            className="w-48 h-48 mb-6 rounded-full"
                                            autoPlay loop muted playsInline
                                        />

                                        {/* Text */}
                                        <h2 className="text-[22px] font-medium text-black mb-2">You have no orders yet</h2>
                                        <p className="text-[14px] text-[#878787] mb-6 text-center max-w-md">
                                            Looks like you haven't placed any orders yet. Start shopping now and your orders will show up here.
                                        </p>

                                        {/* Button */}
                                        <button
                                            onClick={() => navigate('/')}
                                            className="flex items-center gap-2 bg-[#2874f0] hover:bg-[#1d5dc9] text-white px-6 py-2 rounded-md text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-110"
                                        >
                                            <img src={`${baseURL}/static/shopping-bag.gif`} className='w-[3vw] h-[5vh] flex items-center' />
                                            Continue Shopping
                                        </button>
                                    </div>

                                </>
                            ) : (
                                <>
                                    {/* order is not empty it have some orders  */}
                                    <div className='orders-containe mt-[1vw] bg-[#f1f3f6] w-full  '>
                                        <div className="order-header w-full flex justify-center items-center">
                                            <img src={`${baseURL}/static/order-page.gif`} alt='Orders' className='lg:w-[5vw] md:w-[5vw] w-[10vw] object-contain' />
                                            <h1 className='font-sans lg:text-[2.5vw] md:text-[2.5vw] text-[5vw]'>Orders</h1>
                                        </div>
                                        <div className="orders-container flex lg:flex-row md:flex-row flex-col mt-[1.5vw]  w-full ">
                                            <div className="left-side lg:max-w-[22%] md:max-w-[22%] w-full    ">

                                                {(deviceType === "Desktop/Laptop" || deviceType === "Tablet") && (
                                                    <div className="filters-containe bg-white max-h-[80vh] flex flex-col w-fullrounded-xl">
                                                        <div className="filter font-semibold text-[25px] ml-[1.5vw] mt-[0.5vw]">
                                                            <h1>FILTER</h1>
                                                        </div>
                                                        <div className="orderstatus text-[14px] text-gray-800 ml-[1.5vw] w-full mt-[1.5vw]">
                                                            {/* ORDER STATUS */}
                                                            <div className="mb-6">
                                                                <h2 className="font-semibold text-[18px] mb-2">ORDER STATUS</h2>
                                                                {statusOptions.map((status, index) => (
                                                                    <div className="flex items-center mb-2" key={index}>
                                                                        <input
                                                                            type="radio"
                                                                            name="status"
                                                                            id={`status-${index}`}
                                                                            checked={selectedStatus === status}
                                                                            onChange={() => setSelectedStatus(status)}
                                                                            className="mr-2 cursor-pointer"
                                                                        />
                                                                        <label htmlFor={`status-${index}`} className="cursor-pointer">
                                                                            {status}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="ordertime text-[14px] text-gray-800 w-full ml-[1.5vw] mb-[1.5vw]  ">
                                                            <h2 className="font-semibold text-[18px] mb-2">ORDER TIME</h2>
                                                            {timeOptions.map((time, index) => (
                                                                <div className="flex items-center mb-2" key={index}>
                                                                    <input
                                                                        type="radio"
                                                                        name='time'
                                                                        id={`time-${index}`}
                                                                        checked={selectedTime === time}
                                                                        onChange={() =>
                                                                            setSelectedTime(selectedTime === time ? null : time)
                                                                        }
                                                                        className="mr-2 cursor-pointer"
                                                                    />
                                                                    <label htmlFor={`time-${index}`} className="cursor-pointer">
                                                                        {time}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {/* Clear Filter */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStatus(null);
                                                                setSelectedTime(null);
                                                            }}
                                                            className=" text-gray-500 cursor-pointer hover:scale-95 w-full flex justify-end p-2"
                                                        >
                                                            Clear Filters
                                                        </button>
                                                    </div>
                                                )}

                                                {(deviceType == "Mobile") && (
                                                    <div className="filter-containe relative flex flex-col mb-[5vw] ">

                                                        <div className='btn flex flex-col items-end pr-[4vw]'>
                                                            <button className=' text-[3.2vw]  bg-gray-300 p-2 uppercase rounded-lg  ' onClick={() => { setFilteropen(prev => !prev) }}>Filter</button>
                                                        </div>

                                                        {filteropen && (

                                                            <div className="filters-container  bg-white overflow-y-auto flex flex-col rounded-xl m-2 p-2 w-screen min-w-[250px]">

                                                                <div className="filter flex items-center justify-center font-semibold text-[25px]  mt-[0.5vw]">
                                                                    <h1>FILTER</h1>
                                                                </div>
                                                                <div className="orderstatus text-[14px] text-gray-800 ml-[0.5vw] mt-[1.5vw] ">
                                                                    {/* ORDER STATUS */}
                                                                    <div className="mb-6 ">
                                                                        <h2 className="font-semibold text-[14px] mb-2">ORDER STATUS</h2>
                                                                        <div className='flex flex-row gap-4 flex-nowrap overflow-x-auto'>
                                                                            {statusOptions.map((status, index) => (
                                                                                <div className="flex items-center mb-2 " key={index}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="status"
                                                                                        id={`status-${index}`}
                                                                                        checked={selectedStatus === status}
                                                                                        onChange={() => setSelectedStatus(status)}
                                                                                        className="mr-2 cursor-pointer"
                                                                                    />
                                                                                    <label htmlFor={`status-${index}`} className="cursor-pointer">
                                                                                        {status}
                                                                                    </label>
                                                                                </div>
                                                                            ))}

                                                                        </div>
                                                                    </div>

                                                                    <div className="ordertime text-[14px] text-gray-800 ml-[0.5vw] mb-[1.5vw]  ">
                                                                        <h2 className="font-semibold text-[14px] mb-2">ORDER TIME</h2>
                                                                        <div className='flex flex-row gap-4 flex-nowrap overflow-x-auto'>
                                                                            {timeOptions.map((time, index) => (
                                                                                <div className="flex items-center mb-2" key={index}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name='time'
                                                                                        id={`time-${index}`}
                                                                                        checked={selectedTime === time}
                                                                                        onChange={() =>
                                                                                            setSelectedTime(selectedTime === time ? null : time)
                                                                                        }
                                                                                        className="mr-2 cursor-pointer"
                                                                                    />
                                                                                    <label htmlFor={`time-${index}`} className="cursor-pointer">
                                                                                        {time}
                                                                                    </label>
                                                                                </div>
                                                                            ))}

                                                                        </div>
                                                                    </div>
                                                                    {/* Clear Filter */}

                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedStatus(null);
                                                                            setSelectedTime(null);
                                                                        }}
                                                                        className=" text-gray-500 cursor-pointer hover:scale-95 text-[20px]"
                                                                    >
                                                                        Clear Filters
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>


                                                )}


                                            </div>

                                            <div className="right-side lg:w-[85%] md:w-[85%] w-[99%] ml-[1vw] mr-[1vw] pb-[10vh]">
                                                <div className="orders-container flex flex-col items-center justify-center">
                                                    {filteredOrders.length === 0 ? (
                                                        <div className="text-center text-gray-500 text-lg mt-4">
                                                            No orders found for selected filters.
                                                        </div>
                                                    ) : (
                                                        filteredOrders.map((item, index) => (
                                                            <div
                                                                className="orders bg-white grid grid-cols-[70px_1fr_80px_1.5fr]  font-medium hover:shadow-[0_8px_30px_-5px_rgb(0_0_0_/_0.12),_0_4px_60px_0_rgb(0_0_0_/_0.08)] lg:text-[18px] md:text-[18px] text-[14px] mb-[12px] cursor-pointer rounded-lg hover:scale-[1.02] max-h-[20vw] w-full lg:gap-0 gap-[5px]"
                                                                key={item._id || index} onClick={() => (navigate("/OrderDetail", { state: { item } }))}
                                                            >
                                                                <div className="img  flex items-center justify-center ">                                                                    <img
                                                                    src={item.ProductData.Img}
                                                                    alt={item.ProductData.productName}
                                                                    className="w-full h-auto object-contain"
                                                                />
                                                                </div>
                                                                <div className=" p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                                                    {item.ProductData.productName}
                                                                </div>
                                                                <div className="price  text-center p-2">$ {item.TotalAmount}</div>
                                                                <div className="order-status overflow-hidden text-ellipsis  whitespace-nowrap   p-2">
                                                                    {item.OrderStatus} on {item.OrderStatus == "Cancelled" ? item.CancelledDate.month : item.DeliveredDate.month}&nbsp;
                                                                    {item.OrderStatus == "Cancelled" ? item.CancelledDate.date : item.DeliveredDate.date}, {item.OrderStatus == "Cancelled" ? item.CancelledDate.year : item.DeliveredDate.year}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>

                            )}
                        </>

                    )}


                </>
            ) : (
                <>
                    {/* if the user not login login : false  */}
                    <div className="flex flex-col items-center justify-center h-[80vh] px-4">
                        {/* Order Illustration */}
                        <video src={`${baseURL}/static/order.mp4`} alt="No Orders"
                            className="w-48 h-48 mb-6 rounded-full"
                            autoPlay loop muted playsInline />

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-black mb-2">Login to view your orders</h2>

                        {/* Description */}
                        <p className="text-sm text-[#878787] mb-6 text-center max-w-md">
                            You need to sign in to check your past orders and track upcoming deliveries.
                        </p>

                        {/* Login Button */}
                        <button
                            onClick={() => navigate('/login')}
                            className="rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] hover:scale-90 text-white px-6 py-2  text-md font-semibold shadow-sm flex flex-row items-center transition duration-200"
                        >
                            <div>Login</div>
                        </button>
                    </div>
                </>
            )
            }

        </>
    )
}

export default Order
