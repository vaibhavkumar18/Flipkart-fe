import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserAction";// adjust path if needed
import { useState, useEffect } from 'react';
import Loader from '../component/Loader';
import FullScreenLoader from '../component/FullScreenLoader';
import InvoiceGenerator from '../component/InvoiceGenerator';
const OrderDetail = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const location = useLocation();
    const dispatch = useDispatch();
    const invoiceRef = useRef();
    const User = useSelector((state) => state.user);
    const OrderId = location.state?.item?.OrderId;
    const data = User.user?.Orders?.find((order) => order.OrderId == OrderId);
    const [loading, setloading] = useState(true)
    const [cancelloader, setCancelloader] = useState(false)
    console.log(data)
    const handleDownload = () => {
        if (invoiceRef.current) {
            invoiceRef.current.downloadPDF(); // ✅ calls the exposed function
        }
    };

    const extractDateParts = (date) => {
        return {
            day: date.toLocaleString('en-IN', { weekday: 'long' }),
            date: date.getDate(),
            month: date.toLocaleString('en-IN', { month: 'long' }),
            year: date.getFullYear(),
            time: date.toLocaleString('en-IN', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }),
        };
    };
    setTimeout(() => {
        setloading(false)
    }, 1000);

    const CancelOrder = async () => {
        setCancelloader(true)
        const canceldate = new Date()
        const canceldateparts = extractDateParts(canceldate)
        const response = await fetch(`${baseURL}/CancelOrder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: User.user.Username,
                OrderId: data.OrderId,
                CancelDate: canceldateparts,
            }),
        });
        const result = await response.json();
        setTimeout(() => {
            setCancelloader(false)

        }, 1000);
        if (result.success) {
            dispatch(fetchUserData(User.user.Username))

        }
        else {
            alert("Failed to cancel order")
        }

    }

    return (
        <>
            {loading ? (
                <FullScreenLoader message='Please Wait.....' />
            ) : (
                <>
                    {!cancelloader ? (
                        <>
                            <div className="container-body bg-[#f1f3f6] flex lg:flex-row md:flex-row flex-col justify-center items-center gap-4 mt-[5vw] m-3 max-h-[100vh]">
                                <div className="left-side lg:w-[50%] md:w-[50%] w-full max-h-screen bg-white rounded-xl  flex flex-col gap-[2vw] shadow-md  p-6">
                                    <div className="name-img flex flex-row items-center justify-between ml-[1.5vw] mt-[1vw]">
                                        <div className="name-content flex flex-col gap-[10px]">
                                            <div className="name lg:text-[22px] md:text-[22px] text-[18px] font-medium">{data.ProductData.productName}</div>
                                            <div className="quantity lg:text-[18px] md:text-[18px] text-[14px] font-medium">Qty : {data.ProductData.quantity}</div>
                                            <div className="amount lg:text-[24px] md:text-[24px] text-[20px] font-bold">$&nbsp;{data.TotalAmount}</div>
                                        </div>
                                        <div className="img">
                                            <img src={data.ProductData.Img} alt={data.ProductData.productName} className='lg:w-[8vw] md:w-[8vw] w-[25vw] object-contain' />
                                        </div>
                                    </div>

                                    <div className="orderstatus flex flex-col gap-[1vw] ml-[1.5vw]">
                                        <div className="orderdate lg:text-[20px] md:text-[20px] text-[16px] font-medium">Order Confirmed , {data.OrderedDate.month} {data.OrderedDate.day} {data.OrderedDate.date}, {data.OrderedDate.year}</div>

                                        <div className="deliveredate lg:text-[20px] md:text-[20px] text-[16px] font-medium">{data.OrderStatus}, {data.OrderStatus == "Cancelled" ? data.CancelledDate.month : data.DeliveredDate.month} {data.OrderStatus == "Cancelled" ? data.CancelledDate.day : data.DeliveredDate.day} {data.OrderStatus == "Cancelled" ? data.CancelledDate.date : data.DeliveredDate.date}, {data.OrderStatus == "Cancelled" ? data.CancelledDate.year : data.DeliveredDate.year}</div>
                                    </div>

                                    {data.OrderStatus == "On the way" ? (
                                        <>


                                            <div className="w-full flex justify-center mt-0">
                                                <button
                                                    onClick={() => { CancelOrder() }}
                                                    className="px-6 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        </>
                                    ) : ""}

                                </div>
                                <div className="right-side lg:w-[40%] md:w-[40%] flex flex-col justify-center items-center w-full max-h-[80vh] rounded-lg ">
                                    {data.OrderStatus == 'Delivered' ? (
                                        <div
                                            className="invoice bg-white w-full lg:h-[3.5vw] md:h-[3.5vh] h-[5vh] rounded-xl shadow-md flex items-center pl-[1vw] lg:mb-[0.6vw] md:mb-[0.6vw] mb-[5vw] p-6 text-center cursor-pointer justify-center hover:bg-gray-100 transition"
                                            onClick={handleDownload}
                                        >
                                            <div >Download Invoice</div>

                                        </div>

                                    ) : ""}

                                    <div className="user-detail bg-white w-full rounded-xl shadow-md p-4 mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Delivery Details</h2>

                                        <div className="address flex items-start  gap-4 bg-gray-50 p-2 rounded-lg w-full">
                                            {/* Icon */}
                                            <img
                                                src={`${baseURL}/static/home.png`}
                                                alt="Home"
                                                className="w-4 h-4 "
                                            />

                                            {/* Address Info */}
                                            <div className="flex flex-row gap-2 text-sm text-gray-700 leading-snug overflow-hidden text-ellipsis whitespace-nowrap">
                                                <span className="font-medium text-gray-900">{data.Address.Address_Type}</span>
                                                <span>{data.Address.Address}</span>
                                            </div>
                                        </div>
                                        <div className="line w-full h-[1px] mt-[5px] bg-[#ececec]"></div>
                                        <div className="contact flex items-center gap-4 bg-gray-50 p-2 rounded-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                            <img
                                                src={`${baseURL}/static/user.png`}
                                                alt="User"
                                                className="w-4 h-4 "
                                            />
                                            <div className="flex flex-row gap-2 text-sm text-gray-700 leading-snug">
                                                <span>{data.Address.Name}</span>
                                                <span>{data.Address.Phone_number}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="amount-summary bg-white rounded-lg shadow-md p-5 w-full max-w-md">
                                        <h2 className="text-gray-700 font-semibold text-sm mb-4">Price Details</h2>

                                        <div className="space-y-3 text-sm text-gray-800">

                                            <div className="flex justify-between">
                                                <span>Selling price</span>
                                                <span className="text-black">$&nbsp;{data.ProductData.price}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span>Cash Handling Fee</span>
                                                <span className="text-black">$ {data.CashHandlingCharge}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span>Delivery Fee</span>
                                                <span className="text-black">$ {data.DeliveryCharge}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span>Tax</span>
                                                <span className="text-black">$ {data.Tax}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold text-black pt-2">
                                                <span>Total Amount</span>
                                                <span>$ {data.TotalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t text-sm text-gray-700">
                                            <span>• Cash On Delivery: <strong>$ {data.TotalAmount}</strong></span>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </>
                    ) : (
                        <Loader message='Cancelling Your Order.....' />
                    )}

                </>
            )
            }
            {/* Hidden Invoice Generator */}
            <InvoiceGenerator ref={invoiceRef} data={data} />
        </>
    )
}

export default OrderDetail
