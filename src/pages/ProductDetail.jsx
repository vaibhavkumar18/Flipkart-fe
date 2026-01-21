import React from 'react'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/cartslice";
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import Loader from '../component/Loader';
import FullScreenLoader from '../component/FullScreenLoader';
const ProductDetail = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const dispatch = useDispatch()
    const location = useLocation();
    const [isAddToCart, setisAddToCart] = useState(false)
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, []);

    const { products } = location.state || {};
    useEffect(() => {
        if (!products) {
            navigate("/");
        }
    }, [products, navigate]);

    const User = useSelector((state) => state.user)
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const addToCart = async () => {
        if (isAuthenticated) {
            const response = await fetch(`${baseURL}/add-To-Cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: products.id,
                    name: products.title,
                    price: products.price,
                    productImg: products.thumbnail,
                    quantity: 1,
                }),
                credentials: "include"

            });
            const data = await response.json();

            if (data.success) {
                dispatch(fetchCart());
            } else {
                alert("Failed to add item to cart");
            }

        }
        else {
            alert("Please Login or SignUp to Continue!!!")
        }
    };

    return (
        <>
            {
                loading ? (<FullScreenLoader message='Loading Your Product.....' />) : (
                    <div className="containe flex flex-col justify-center items-center">

                        <div className="lg:w-[95vw] w-[80vw] max-h-[300vh] shadow-[0_25px_30px_-3px_rgba(0,0,0,0.1),0_20px_20px_-4px_rgba(0,0,0,0.1)] flex mt-[20px] lg:flex-row flex-col items-center m-[50px]">

                            <div className="left lg:w-[40vw] lg:h-[85vh] flex flex-col ">
                                <div className="img">
                                    <img src={products.images} alt={products?.tags?.[1]} className="w-[90%] max-w-[350px] h-auto mx-auto hover:scale-105 transition-all" />
                                </div>
                                <div className="btn-container flex justify-center items-center gap-[10px]">

                                    <div className="add-to-cart-btn m-[15px]">
                                        {isAddToCart ? (
                                            <button className="w-full sm:w-40 px-4 py-2 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white  hover:scale-90 transition duration-200" onClick={
                                                () => {
                                                    navigate("/CartPage")
                                                }
                                            }>Got To Cart</button>
                                        ) :
                                            (
                                                <button className="w-full sm:w-40 px-4 py-2 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white hover:scale-90 transition duration-200" onClick={
                                                    () => {
                                                        setisAddToCart(true)
                                                        addToCart()
                                                    }
                                                }>Add To Cart</button>

                                            )}
                                    </div>
                                    <div className="buy-now-btn">
                                        <button className="w-full sm:w-40 px-4 py-2 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white  hover:scale-90 transition duration-200 " onClick={() => {
                                            addToCart()
                                            navigate("/CartPage")
                                        }}>Buy Now</button>
                                    </div>
                                </div>
                            </div>
                            <div className="right lg:w-[50vw] lg:h-[85vh] ml-[40px] lg:ml-[70px] mt-[20px] mr-[15px]">
                                <div className="product-name mb-[20px]">
                                    <h1 className='lg:text-3xl sm:text-2xl text-xl capitalize font-bold'>{products.title}<p className='lg:text-lg text-md font-normal'>#{products?.tags?.[1]}  #{products?.tags?.[0]}</p>

                                    </h1>
                                </div>

                                <div className="ratings mb-[10px]">

                                    <h2 className="rating  bg-green-500 text-white sm:w-[10vw] h-[4vh] sm:h-[4vh] w-[12vw] lg:w-[5vw] rounded-[4px] lg:h-[4vh] flex justify-center items-center lg:text-sm text-sm sm:text-lg p-[1px] lg:p-0 font-bold">{products.rating} ★ </h2>
                                </div>
                                <div className="price mb-[20px] mt-[15px]">
                                    <h3 className='lg:text-3xl sm:text-2xl text-xl font-semibold'>${products.price}</h3>
                                </div>
                                <div className="highlights flex gap-[10px] xl:gap-[40px] sm:text-[20px] lg:flex-row flex-col text-[15px] lg:text-lg  ">
                                    <div className="left">
                                        <h2 className='font-bold'> Highlights</h2>
                                    </div>
                                    <div className="right">
                                        <ul className="flex flex-wrap gap-2 text-sm sm:text-base">
                                            <li className='font-semibold'>Width : {products?.dimensions?.width} cm  </li>|
                                            <li className='font-semibold'>Height : {products?.dimensions?.height} cm </li>|
                                            <li className='font-semibold'>Depth : {products?.dimensions?.depth} cm </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="description mb-[20px] mt-[20px] flex lg:gap-[43px] flex-col lg:flex-row gap-[15px] sm:gap-[40px] lg:text-[15px] text-[20px]">
                                    <div className="left  ">
                                        <h3 className='font-bold'> Description </h3>
                                    </div>
                                    <div className="right ">
                                        <p className=''>&nbsp;{products.description}</p>
                                    </div>
                                </div>
                                <div className="brand flex lg:gap-[95px] lg:text-xl gap-[15px] flex-col lg:flex-row text-md mb-[20px]">
                                    <div className="left ">
                                        <h3 className='font-bold'>Brand</h3>
                                    </div>
                                    <div className="right">
                                        <p className=''>{products.brand}</p>
                                    </div>
                                </div>
                                <div className="reviews pb-[20px]">
                                    <h2 className='lg:text-2xl sm:text-xl text-lg  font-bold underline'>Reviews</h2>
                                    <div className="cont lg:text-[15px] md:text-sm text-[10px] mt-[15px] flex flex-col">
                                        {Array.isArray(products?.reviews) && products.reviews.map((item, index) => {
                                            return (
                                                <div key={index} className='flex lg:gap-[20px] gap-[1px] m-[5px]'>
                                                    <h2>Hi, I am {item.reviewerName}</h2>|
                                                    <p>Comment : {item.comment}</p>|
                                                    <p>Rating : {item.rating}★ </p>
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div >
                )
            }

        </>
    )
}

export default ProductDetail
