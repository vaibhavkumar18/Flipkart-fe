import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AddAddress } from "../redux/userslice";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
import 'react-toastify/dist/ReactToastify.css';
import { updateAddress } from "../redux/userslice";

const AddAddressForm = ({ address, onClose }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const dispatch = useDispatch();
    const [isAddAddress, setisAddAddress] = useState(false)
    const requiredFields = [
        "Name",
        "Phone_number",
        "PIN_Code",
        "Locality",
        "Address",
        "City",
        "State",
        "Address_Type"
    ];
    const User = useSelector((state) => state.user);
    const [save, setsave] = useState(false)
    const [states, setstates] = useState("--Select State--")
    const [manageaddress, setmanageaddress] = useState({
        id: uuidv4(), Name: "", Phone_number: "", PIN_Code: "", Locality: "", Address: "", City: "", State: "", Landmark: "", Alternate_Phone_Number: "", Address_Type: ""
    })
    const [checkbox, setcheckbox] = useState(true)
    const [errors, setErrors] = useState({});
    const [showeditaddress, setshoweditaddress] = useState(false)
    const [edit, setedit] = useState(false)
    const arr = [
        "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli & Daman & Diu",
        "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
        "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
        "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"
    ];
    useEffect(() => {
        if (address) {
            console.log("True")
            setmanageaddress(address);
        }
    }, [address]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setmanageaddress((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const HandleSave = async (e) => {
        e.preventDefault();

        const hasEmptyRequired = requiredFields.some(
            (field) => !manageaddress[field] || manageaddress[field].trim() === ""
        );

        if (hasEmptyRequired) {
            alert("Please fill in all the required fields.");
            return;
        }

        const isEditing = address !== undefined; // 👈 Detect if we are editing

        const endpoint = isEditing
            ? `${baseURL}/EditAddress/${manageaddress.id}`
            : `${baseURL}/AddAddress`;

        const method = isEditing ? "PUT" : "POST";
        try {
            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: manageaddress.id,
                    Name: manageaddress.Name,
                    Email: User.user.Email,
                    Phone_number: manageaddress.Phone_number || "",
                    PIN_Code: manageaddress.PIN_Code,
                    Locality: manageaddress.Locality,
                    Address: manageaddress.Address,
                    City: manageaddress.City,
                    State: manageaddress.State,
                    Landmark: manageaddress.Landmark,
                    Address_Type: manageaddress.Address_Type || "",
                    Alternate_Phone_Number: manageaddress.Alternate_Phone_Number || "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Server Error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();

            if (isEditing) {
                dispatch(updateAddress({ id: manageaddress.id, ...manageaddress }));
            } else {
                dispatch(AddAddress({ id: manageaddress.id, ...manageaddress }));
            }

            onClose(true); // Notify parent to close
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    };

    return (
        <>
            <div className="containe flex flex-col   w-full h-auto   ">
                <h1 className='text-xl font-semibold mb-[30px] '>Manage Addresses</h1>
                <form >
                    <div className="address-form w-[100%] max-h-[150vh] bg-[#f5faff] p-[15px] flex flex-col gap-[15px]  border-[#e0e0e0] border-2">
                        <span className='text-[#2455f4] font-medium' >ADD A NEW ADDRESS</span>
                        {/* section 1 : name , phone number  */}
                        <div className="name-phone flex gap-2  ">
                            {/* Name  */}
                            <div className="relative lg:w-[35%] md:w-[35%] w-full name   ">
                                {/* input : name  */}
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    value={manageaddress.Name}
                                    className="peer  w-full border-2 border-gray-400 bg-[#ffffff] outline-none focus:border-blue-500  pt-6 pb-2 cursor-pointer pl-[20px] rounded-sm"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : name  */}
                                <label htmlFor="Name"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[15px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[12px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]">
                                    Name
                                </label>
                            </div>
                            {/* Phone number  */}
                            <div className="relative lg:w-[35%] md:w-[35%] w-full phone-number  ">
                                {/* input : phone number  */}
                                <input
                                    type="tel"
                                    id="Phone-number"

                                    name="Phone_number"
                                    value={manageaddress.Phone_number || ""}
                                    className="peer w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[10px] pr-[5px] rounded-sm text-sm"
                                    placeholder=" "
                                    maxLength={10}
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* Label : Phone number  */}
                                <label htmlFor="Phone-number"
                                    className="absolute left-0 pl-[10px] pr-[5px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[0.6rem] xs:peer-placeholder-shown:text-[0.65rem] sm:peer-placeholder-shown:text-xs md:peer-placeholder-shown:text-sm lg:peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                                    peer-focus:top-1 peer-focus:text-[0.5rem] peer-focus:text-blue-500
                                    origin-top-left -translate-y-1/4 top-[0.6rem] text-[0.5rem]
                                    cursor-pointer font-medium text-ellipsis  ">
                                    10-digit mobile number
                                </label>
                            </div>
                        </div>
                        {/* section 2 : pincode , locality  */}
                        <div className="pin-locality flex gap-2 ">
                            {/* Pincode  */}
                            <div className="relative lg:w-[35%] md:w-[35%] w-full pincode   ">
                                {/* input : Pin code  */}
                                <input
                                    type="tel"
                                    id="Pin code"

                                    name="PIN_Code"
                                    value={manageaddress.PIN_Code}
                                    className="peer w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : Pin code  */}
                                <label htmlFor="Pin code"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[15px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[12px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]" >
                                    PIN Code
                                </label>
                            </div>
                            {/* Locality  */}
                            <div className="relative lg:w-[35%] md:w-[35%] w-full locality   ">
                                {/* input : locality  */}
                                <input
                                    type="text"
                                    id="locality"

                                    name="Locality"
                                    value={manageaddress.Locality}
                                    className="peer w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : locality  */}
                                <label htmlFor="locality"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[15px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[12px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]" >
                                    Locality
                                </label>
                            </div>
                        </div>
                        {/* Address-area and street  */}
                        <div className="address flex ">
                            <div className="relative lg:w-[70%] md:w-[100%] w-full address  ">
                                {/* input : Address  */}
                                <input
                                    type="text"
                                    id="address"

                                    name="Address"
                                    value={manageaddress.Address}
                                    className="peer lg:w-[34.5vw] md:w-[34.5vw] w-full h-[15vh]  border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : Address  */}
                                <label htmlFor="address"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[15px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[12px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]" >
                                    Address (Area and Street)
                                </label>
                            </div>
                        </div>

                        {/* City/District/Town and state  */}
                        <div className="city-state flex gap-2">

                            <div className="relative lg:w-[35%] md:w-[35%] w-full city  ">
                                {/* input : city/District/town  */}
                                <input
                                    type="text"
                                    id="city"

                                    name="City"
                                    value={manageaddress.City}
                                    className="peer  w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : City/District/Town  */}
                                <label htmlFor="city"
                                    className="absolute left-0 pl-[10px] pr-[5px] text-[#9e8f87] transition-all duration-300 ease-in-out
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[0.6rem] xs:peer-placeholder-shown:text-[0.65rem] sm:peer-placeholder-shown:text-xs md:peer-placeholder-shown:text-sm lg:peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                       peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500
                       origin-top-left -translate-y-1/4 top-[0.6rem] text-[0.7rem]
                       cursor-pointer font-medium text-ellipsis" >
                                    City/District/Town
                                </label>
                            </div>


                            {/* State with Option  */}

                            <div className="relative lg:w-[35%] md:w-[35%] w-full state  ">
                                {/* input : state  */}
                                <div className='lg:w-[16.5vw] md:w-[16.5vw] w-full max-h-[10vh] border-gray-400 border-2  ' >
                                    <label htmlFor="state" className='relative top-0 pl-[15px] text-sm text-gray-400'>State</label>

                                    <select
                                        name="State"
                                        id="state"

                                        className='pl-[12px] lg:w-[16vw] md:w-[16vw] w-full lg:text-md md:text-md text-xs focus:outline-none font-[400]'
                                        value={manageaddress.State}
                                        onChange={(e) => { handleChange(e) }}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >--Select State--</option>

                                        {arr.map((states, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={states}
                                                >{states}</option>
                                            )
                                        }
                                        )}
                                    </select>
                                </div>

                            </div>
                        </div>

                        {/* Landmark Alternate phone number  */}
                        <div className="landmark-alternatephonenumber flex gap-2">

                            <div className="relative lg:w-[35%] md:w-[35%] w-full landmark  ">
                                {/* input : Landmark  */}
                                <input
                                    type="text"
                                    id="landmark"
                                    name="Landmark"
                                    value={manageaddress.Landmark}
                                    className="peer w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {/* label : Landmark  */}
                                <label htmlFor="landmark"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[13px] md:peer-placeholder-shown:text-[11px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[9px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]" >
                                    Landmark (Optional)
                                </label>
                            </div>



                            <div className="relative lg:w-[35%] md:w-[35%] w-full alternatephonenumber  ">
                                {/* input : alternatephonenumber  */}
                                <input
                                    type="tel"
                                    id="alternatephonenumber"

                                    name="Alternate_Phone_Number"
                                    value={manageaddress.Alternate_Phone_Number}
                                    className="peer w-full border-2 border-gray-400 bg-white outline-none focus:border-blue-500 pt-6 pb-2 pl-[20px] rounded-sm text-base"
                                    placeholder=" "
                                    onChange={(e) => { handleChange(e) }}
                                    maxLength={10}
                                />
                                {/* label : alternatephonenumber  */}
                                <label htmlFor="alternatephonenumber"
                                    className="absolute left-0 pl-[20px] text-[#9e8f87] transition-all duration-300 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 lg:peer-placeholder-shown:text-[13px] md:peer-placeholder-shown:text-[10px] peer-placeholder-shown:text-[9px]
                                        peer-focus:top-1 lg:peer-focus:text-[12px] md:peer-focus:text-[8px] peer-focus:text-[8px] peer-focus:text-blue-500
                                            cursor-pointer font-medium 
                                        peer-placeholder-shown:whitespace-normal peer-placeholder-shown:pr-[20px]" >
                                    Alternate Phone (Optional)
                                </label>
                            </div>

                        </div>

                        {/* Address type  */}
                        <div className="addresstype flex flex-col">
                            <div className='text-[#9e8f87] text-sm'>Address Type</div>
                            <div className="home-work items-center flex pt-[10px] ">
                                {/* Input : Home  */}

                                <div className="home">
                                    <input type="checkbox" name="Home" id="Home" className='appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:bg-blue-500 checked:border-blue-500'

                                        checked={manageaddress.Address_Type === 'Home'}

                                        onChange={(e) => {
                                            setmanageaddress({ ...manageaddress, Address_Type: e.target.checked ? 'Home' : '' })
                                            setcheckbox(!checkbox)
                                        }}
                                        disabled={manageaddress.Address_Type == "Home"}
                                    />
                                    <label htmlFor="Home" className='ml-2'>Home</label>
                                </div>

                                {/* Input : Work  */}
                                <div className="work pl-[20px]">
                                    <input type="checkbox" name="Work" id="Work" className='appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:bg-blue-500 checked:border-blue-500 '

                                        checked={manageaddress.Address_Type === 'Work'}

                                        onChange={(e) => {
                                            setmanageaddress({ ...manageaddress, Address_Type: e.target.checked ? 'Work' : '' })
                                            setcheckbox(!checkbox)
                                        }}
                                        disabled={manageaddress.Address_Type == "Work"}
                                    />
                                    <label htmlFor="Work" className='ml-2'>Work</label>
                                </div>
                            </div>
                        </div>

                        {/* Save and Cancel Button  */}
                        <div className="button flex items-center gap-3 ">

                            <button className='lg:w-[16vw] md:w-[16vw] w-full h-[7vh] border-black border-2 text-lg font-semibold bg-[#2874f0] text-center text-white mt-[15px]' onClick={(e) => { HandleSave(e) }}>SAVE</button>

                            <button
                                type="button"
                                className='text-[#2874f0] lg:w-[10vw] md:w-[13vw] w-full  lg:pl-[25px] md:pl-[25px] text-center mt-[15px] text-lg'
                                onClick={(e) => {
                                    e.preventDefault(); // prevents default form submission or navigation
                                    setisAddAddress(false);
                                    if (onClose) onClose(false); // safely call the onClose with `false` (not saved)
                                }}
                            >
                                CANCEL
                            </button>

                        </div>

                    </div>
                </form>
            </div>
        </>

    )
}

export default AddAddressForm
