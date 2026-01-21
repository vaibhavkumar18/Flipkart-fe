import React from 'react'
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/cartslice";
import { useNavigate } from "react-router-dom";
import Checkout_Payment_Address from './Checkout_Payment_Address';
import FullScreenLoader from '../component/FullScreenLoader';


const CartPage = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env

    const navigate = useNavigate();
    const [totalAmount, settotalAmount] = useState(0)
    const dispatch = useDispatch();
    const cart = useSelector(state =>
        Array.isArray(state.cart.items) ? state.cart.items : []
    );

    const User = useSelector((state) => state.user)
    const [quantities, setQuantities] = useState({});
    const [isCheckout, setisCheckout] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!Array.isArray(cart)) return;

        const initialQuantities = {};
        cart.forEach(item => {
            initialQuantities[item.productId] = item.quantity;
        });
        setQuantities(initialQuantities);
    }, [cart]);



    useEffect(() => {
        document.title = 'Shopping Cart | Flipkart';
    }, []);

    useEffect(() => {
        const total = cart.reduce((sum, item) => {
            const qty = quantities[item.productId] || 1;
            return sum + item.price * qty + 25 + 18 + 5;

        }, 0);
        settotalAmount(total);
    }, [cart, quantities]); // <== quantities included here

    useEffect(() => {
        if (!User.isAuthenticated) {
            navigate("/Login");
            return;
        }

        if (User.user?.Username) {
            dispatch(fetchCart());
        }
    }, [User.isAuthenticated, User.user, dispatch, navigate]);


    const handleRemove = async (productId) => {
        await fetch(`${baseURL}/remove-From-Cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: User.user.Username, productId }),
        });
        dispatch(removeFromCart(productId));
    };
    const Checkout = async () => {
        const cartToSend = cart.map(item => ({
            ...item,
            quantity: quantities[item.productId]
        }));

        await fetch(`${baseURL}/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: User.user.Username,
                cart: cartToSend
            })
        });

        if (User.user) {
            dispatch(fetchCart(User.user.Username));
            setisCheckout(true);
        }

    };


    return (
        <>
            {User.isAuthenticated ? (
                <>
                    {cart.length == 0 ? (

                        <div className="w-full h-[80vh] flex flex-col items-center justify-center px-4">
                            {/* Icon or Image */}

                            <video src={`${baseURL}/static/cart.mp4`} type="video/mp4" autoPlay loop muted playsInline className="lg:w-[10vw] w-[25vw] object-contain rounded-full" />


                            {/* Message */}
                            <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Your cart is empty</h2>
                            <p className="text-sm text-center text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="rounded-full bg-gradient-to-r from-[#818cf8] via-[#3b82f6] to-[#4f46e5] text-white px-6 py-3  shadow hover:bg-blue-700 transition duration-200 flex flex-row items-center hover:scale-90 text-md "
                            >

                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {loading ? (<FullScreenLoader message='Loading Your Cart.....' />) : (



                                <div className="container flex justify-center items-center flex-col w-full ">
                                    <div className="header-container flex justify-center items-center flex-col ">
                                        <h1 className='lg:text-4xl md:text-2xl text-xl font-bold text-center mb-[20px] mt-[15px] '> Your Cart</h1>
                                    </div>
                                    <div className="cart-container  w-full ">
                                        <div className="upperheading w-full  ">
                                            <ul className="flex flex-row justify-center items-center list-none w-full lg:text-[22px] md:text-[18px] text-[14px] font-bold ">
                                                <li className="w-1/5 text-center">Image</li>
                                                <li className="w-1/5 text-center">Name</li>
                                                <li className="w-1/5 text-center">Price</li>
                                                <li className="w-1/5 text-center">Quantity</li>
                                                <li className="w-1/5 text-center">Delete</li>
                                            </ul>
                                        </div>
                                        <div className="w-[90vw] h-[2px] bg-cyan-500 m-4"></div>
                                        <div className="productcart w-full overflow-auto h-[60vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                            {cart.map((product, index) => {
                                                const quantity = quantities[product.productId] || 1;
                                                // settotalAmount(totalAmount + product.price) 
                                                return (

                                                    // Main Container 
                                                    <div className='cart-container flex flex-col justify-center items-center' key={index}>

                                                        {/* Container  */}
                                                        <div className="container flex justify-between items-center lg:text-[18px] md:text-[15px] text-[11px] ">

                                                            {/* Image Container */}
                                                            <div className="image-container flex items-center justify-center text-center w-1/5">
                                                                <img src={product.productImg} alt={product.name} className='lg:w-[6vw] md:w-[7vw] w-[15vw] object-contain lg:mx-auto' />
                                                            </div>

                                                            {/* Name Container */}
                                                            <div className="name-container flex items-center justify-center text-center w-1/5">
                                                                <div>{product.name}</div>
                                                            </div>

                                                            {/* Price Container */}
                                                            <div className="price-container flex items-center justify-center text-center w-1/5">
                                                                <div>${quantity * (product.price)}</div>
                                                            </div>

                                                            {/* Quantitiy Container */}
                                                            <div className="quantity-container flex items-center justify-center text-center w-1/5 h-full">

                                                                {/* Quantity Block Container  */}
                                                                <div className='quantity-block-container flex flex-row gap-[10px] lg:text-[22px] md:text-[18px] text-[16px] justify-center items-center'>

                                                                    {/* Decrement Button  */}
                                                                    <button className="decrement-btn lg:w-[25px] md:w-[20px] w-[18px] lg:h-[25px] md:h-[20px] h-[18px] bg-red-500 text-white rounded-[5px] flex justify-center items-center border border-black" onClick={() => {
                                                                        if (quantity > 1) {
                                                                            setQuantities(prev => ({
                                                                                ...prev,
                                                                                [product.productId]: quantity - 1
                                                                            }));
                                                                        }
                                                                    }}>-</button>

                                                                    {/* Quantity  */}

                                                                    <span className="quantity">{quantity}</span>

                                                                    {/* Increment Container  */}
                                                                    <button className="increment-btn rounded-[5px]  border flex items-center justify-center border-black g:w-[25px] md:w-[20px] w-[18px] lg:h-[25px] md:h-[20px] h-[18px] bg-green-500 text-white" onClick={() => {
                                                                        if (quantity < 10) {
                                                                            setQuantities(prev => ({
                                                                                ...prev,
                                                                                [product.productId]: quantity + 1
                                                                            }));
                                                                        }
                                                                    }}>+</button>
                                                                </div>
                                                            </div>

                                                            {/* Delete Button Container  */}
                                                            <div className="Delete-container flex items-center justify-center text-center w-1/5">
                                                                <div>
                                                                    <img src={`${baseURL}/static/bin.gif`} alt="Delete" className='cursor-pointer lg:w-[3vw] md:w-[4vw] w-[7vw] object-contain' onClick={() => handleRemove(product.productId)} />
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div className="container flex justify-center items-center">
                                                            <div className="w-[85vw] h-[1px] bg-gray-500 m-4"></div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}

                                        </div>

                                    </div>

                                    <div className="amount-checkout-container flex lg:flex-col md:flex-col flex-row justify-center w-full lg:items-end md:items-end items-center lg:mr-[10vw] md:mr-[10vw] lg:m-[25px] md:m-[25px]   ">

                                        <div className="amount lg:text-[2vw] md:text-[3vw] text-[4vw] lg:w-full md:w-full  text-center h-[7vh] flex flex-row lg:items-end md:items-end items-center lg:justify-end  md:justify-end justify-center">
                                            <span className='font-bold lg:text-[2vw] md:text-[3vw] text-[3.5vw]'>
                                                Total Amount &nbsp;:&nbsp;
                                            </span>
                                            &nbsp;${totalAmount.toFixed(2)}
                                        </div>
                                        <div className="line lg:w-[17vw] md:w-[30vw] w-[1px] lg:h-[1px] md:h-[1px] h-[8vh] bg-black m-[20px]"></div>
                                        <div className="checkout lg:text-[20px] md:text-[20px] flex justify-center items-center lg:mr-[25px] cursor-pointer hover:scale-95 rounded-lg border-2 border-black transition duration-200">
                                            <button className="checkout rounded-lg lg:p-[8px] md:px-[15px] p-[5px] lg:w-full md:w-full w-full lg:h-[7vh] flex flex-row items-center hover:scale-95 justify-center lg:text-[2vw] md:text-[3vw] text-[4vw] transition duration-200" disabled={!cart} onClick={() => {
                                                if (cart) {
                                                    Checkout();

                                                }
                                                if (isCheckout) {
                                                    navigate("/Checkout_Payment_Address")
                                                }
                                            }}>
                                                <div>Checkout</div>

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>

                    )}
                </>
            ) : (
                <>
                    <div className=" max-h-screen mt-[5vw] flex flex-col items-center justify-center gap-5 px-4">

                        {/* Cart Icon */}
                        <video src={`${baseURL}/static/online-shop.mp4`} type="video/mp4" autoPlay loop muted playsInline className="lg:w-[10vw]  md:w-[10vw] w-[30vw] object-contain rounded-full" />

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Your Cart is Waiting
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-6">
                            You need to log in or create an account to view and checkout your cart items.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center items-center">
                            <button
                                onClick={() => navigate("/Login")}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition "
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate("/SignUp")}
                                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </>
            )}





        </>
    )
}
export default CartPage
