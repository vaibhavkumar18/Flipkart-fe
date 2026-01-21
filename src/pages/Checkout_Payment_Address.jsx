import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../redux/UserAction";// adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import FullScreenLoader from '../component/FullScreenLoader';
import { v4 as uuidv4 } from "uuid";

const Checkout_Payment_Address = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.user);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalAmount, settotalAmount] = useState(0)
  const [quantities, setQuantities] = useState({});
  const cart = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    dispatch(fetchUserData(User.user.Username))

  }, [User.user.Username])

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
    setLoading(false)
  }, 1000);
  console.log(cart)
  useEffect(() => {
    document.title = 'Checkout | Flipkart';
  }, []);


  useEffect(() => {
    const initialQuantities = {};
    cart.forEach(item => {
      initialQuantities[item.productId] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cart]);



  const RedirectToPage = () => {
    navigate("/MyProfile/ManageAddress")
  }


  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const qty = quantities[item.productId] || 1;
      return sum + item.price * qty + 25 + 18 % + 5;
    }, 0);
    settotalAmount(total);
  }, [cart, quantities]);


  const Checkout = async () => {
    if (selectedAddress == null) {
      alert("Select Billing Address!!!");
      return;
    }
    let allOrdersSuccessful = true; // ✅ Track if all orders succeeded
    const orderDate = new Date(); // or replace with a passed-in date
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 7); // Add 7 days
    const orderedParts = extractDateParts(orderDate);
    const deliveryParts = extractDateParts(deliveryDate);
    try {
      for (const item of cart) {
        const baseAmount = item.price * item.quantity;
        const taxAmount = baseAmount * 0.18;
        const deliveryCharge = 25;
        const cashHandlingCharge = 5;



        const orderData = {
          OrderId: uuidv4(),
          Phone_number: User.user.Phone_Number,
          Address: User.user.Address[selectedAddress],
          TotalAmount: (item.price * item.quantity + 25 + 5 + ((item.price * item.quantity) * 0.18)).toFixed(2),
          ProductData: {
            productId: item.productId,
            title: item.title,
            productName: item.name,
            Img: item.productImg,
            quantity: item.quantity,
            price: item.price,
          },
          BaseAmount: baseAmount.toFixed(2),
          Tax: taxAmount.toFixed(2),
          DeliveryCharge: deliveryCharge,
          CashHandlingCharge: cashHandlingCharge,
          OrderedDate: orderedParts,
          DeliveredDate: deliveryParts,
          CancelledDate: null,
          OrderStatus: "Delivered",
        };

        const response = await fetch(`${baseURL}/Order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
          credentials: "include"
        });

        const data = await response.json()
        if (!data.success && data.message !== "Item added to order") {
          console.error("Failed to add order:", item.title);
          allOrdersSuccessful = false; // ❌ Mark as failed
        }
      }

      // After all individual orders placed, empty the cart
      if (allOrdersSuccessful) {
        const emptyRes = await fetch(`${baseURL}/EmptyCart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: User.user.Username }),
        });

        const emptyData = await emptyRes.json();
        if (emptyData.success) {
          dispatch(fetchUserData(User.user.Username));
          navigate("/Placeorder");
        } else {
          console.error("❌ Failed to empty cart");
          alert("Cart empty failed");
        }
      } else {
        alert("Some orders failed. Please check console for more info.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place the order.");
    }
  };



  return (

    <>
      {loading ? (<FullScreenLoader message='Please Wait.....' />) : (

        <div className="payment-address flex lg:flex-row md:flex-row flex-col justify-center">

          <div className="address lg:w-[50%] md:w-[50%] w-full flex items-center flex-col">
            <div className="heading lg:mt-[2vw] md:mt-[2vw] mt-[3vw] mb-[2vw] items-center flex flex-row  lg:w-[35vw] md:w-[35vw] w-full justify-center">
              <h1 className='billing-address lg:text-[2.5vw] md:text-[2.5vw] text-[5vw] '>Billing Address</h1>
            </div>

            <div style={{
              scrollbarWidth: 'none',         // Firefox
              msOverflowStyle: 'none',        // IE 10+
              overflowY: 'scroll',
            }} className="address-card-container lg:w-[35vw] md:w-[35vw] w-full  max-h-[70vh] overflow-y-auto overflow-x-hidden flex flex-col items-center lg:gap-[1.5vw] md:gap-[1.5vw] gap-[3vw] lg:mt-0 md:mt-0 mt-[3vw]   ">
              {Array.isArray(User?.user?.Address) ? (
                User.user.Address.map((item, index) => (
                  <label htmlFor={index} key={item.id}>
                    <input
                      type="radio"
                      id={index}
                      name="selectedAddress"
                      value={index}
                      checked={selectedAddress === index}
                      onChange={() => setSelectedAddress(index)}
                      className="hidden"
                    />

                    <div
                      className={`address-card lg:w-[30vw] md:w-[30vw] w-[80vw] max-h-[40vh] text-black border-2 rounded-md lg:p-2 md:p-2 p-[2vw] ${selectedAddress === index ? 'border-blue-500 bg-blue-50' : 'border-black'
                        }`}
                    >
                      <div className="containe mt-[1vw]">
                        <div className="addresstype w-[65px] ">
                          <div className="text-center bg-[#f0f0f0] text-[#878787] text-xs">
                            {item.Address_Type}
                          </div>
                        </div>
                      </div>

                      <div className="container-data ml-[1vw]">
                        <div className="name-phone font-bold lg:text-sm md:text-sm text-[12px] pb-[15px] pt-[10px]">
                          {item.Name} &nbsp; {item.Phone_number}
                        </div>
                        <div className="address lg:text-base md:text-base text-sm">
                          {item.Address}, {item.Locality}, {item.City},
                        </div>
                        <div className='text-base '>
                          {item.State} - <strong>{item.PIN_Code}</strong>
                        </div>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-2">Loading or no address found.</p>
              )}
            </div>

            <div className="add-new-address border-2 border-black lg:w-[30vw] md:w-[30vw] w-full flex items-center justify-center lg:mt-[2vw] md:mt-[2vw] mt-[3vw] rounded-md hover:scale-90 cursor-pointer transition duration-200" onClick={() => { RedirectToPage() }}>
              <div className='lg:text-[25px] md:text-[15px] text-[20px] p-[5px] uppercase flex flex-row items-center'>
                <div>Add New Address</div>
              </div>
            </div>
          </div>

          <div className="line2 flex flex-col justify-center items-center lg:mt-[3vw] md:mt-[3vw] mt-[6vw] lg:w-[1px] md:w-[1px] w-full bg-slate-500 lg:h-[50vw] md:h-[50vw] h-[1px]"></div>

          <div className="payment lg:w-[50%] flex flex-col items-center md:w-[50%] pl-[4vw] w-full">

            <div className="payment-header mt-[1.5vw] relative lg:right-10  md:right-10 text-center flex flex-row items-center right-0  ">

              <h1 className='lg:text-[2.5vw] md:text-[2.5vw] text-[4vw]'>Order Summary</h1>
              {/* <div className="line w-[18vw] bg-cyan-500 h-[2px] "></div> */}
            </div>
            <div className="order-summary lg:w-[30vw] md:w-[30vw] w-full lg:pl-0 md:pl-0 pl-[5vw]  mt-[2vw] lg:text-[18px] md:text-[18px] text-[14px] font-medium flex flex-col justify-center items-start gap-6">

              {/* Cart Details */}
              <div className="w-full ">

                <div className="grid grid-cols-[auto_20px_auto]  gap-y-4 gap-x-2 w-full">

                  {/* Cart Amount */}
                  <div>Cart Amount</div>
                  <div>:</div>
                  <div>${(totalAmount - 5 - 18 % - 25).toFixed(2)}</div>

                  {/* GST */}
                  <div>GST</div>
                  <div>:</div>
                  <div>18%</div>

                  {/* Delivery Charges */}
                  <div>Delivery Charges</div>
                  <div>:</div>
                  <div>$25</div>

                  {/* Cash Handling Charges */}
                  <div>Cash Handling Charge</div>
                  <div>:</div>
                  <div>$5</div>
                </div>
              </div>

              {/* Divider Line */}
              <div className="lg:w-[25vw] md:w-[25vw] w-[94%] h-[1px] bg-gray-300"></div>

              {/* Total Amount */}
              <div className="w-full grid grid-cols-[auto_20px_auto] text-[1.2rem] font-semibold">
                <div className='lg:text-[1.5vw] md:text-[1.5vw] text-[3.5vw]'>Total Amount</div>
                <div className='lg:text-[1.5vw] md:text-[1.5vw] text-[3.5vw]'> :</div>
                <div className='lg:text-[1.5vw] md:text-[1.5vw] text-[3.5vw]'>${totalAmount.toFixed(2)}</div>
              </div>

              {/* Payment Info */}
              <div className="paymentmode lg:text-[18px] md:text-[18px] text-[13px] mt-[1vw] text-gray-700">
                &bull; Payment Mode is <span className="font-bold text-black">Cash On Delivery</span>.
              </div>
            </div>

            <div className="checkout border-2 border-black lg:w-[30vw] md:w-[30vw] w-full h-[7vh] mt-[4vw] lg:text-[25px] md:text-[25px] text-[22px] flex items-center justify-center cursor-pointer hover:scale-90 rounded-lg transition duration-200" disabled={selectedAddress == null} onClick={() => {
              if (selectedAddress == null) {
                alert("Select Billing Address!!!")
              }
              Checkout();
            }} >
              <div className="checkoutbtn uppercase flex flex-row items-center  transition duration-200">
                Checkout
              </div>
            </div>

          </div>

        </div>
      )}
    </>

  )
}

export default Checkout_Payment_Address
