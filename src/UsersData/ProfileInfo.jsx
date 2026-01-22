import React from 'react'
import { useState } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateprofile } from "../redux/userslice";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProfileInfo = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
    const dispatch = useDispatch();
    const User = useSelector((state) => state.user);
    const [showeditprofileinfo, setshoweditprofileinfo] = useState(true)
    const [showemailedit, setshowemailedit] = useState(true)
    const [showphonenumedit, setshowphonenumedit] = useState(true)
    const [profile, setprofile] = useState({ Name: User.user.Name, Gender: User.user.Gender, Email: User.user.Email, Phone_Number: User.user.Phone_Number || "" })
    const handlechange = (e) => {
        setprofile({ ...profile, [e.target.name]: e.target.value })
    }
    console.log("User",User)
    const handleSave = async () => {
        if (profile.Name.length > 0) {
            try {
                const response = await fetch(`${baseURL}/updateprofile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        Name: profile.Name,
                        Email: profile.Email,          // editable email
                        Gender: profile.Gender,
                        Phone_Number: profile.Phone_Number
                    })
                });


                if (!response.ok) {
                    const errorData = await response.text(); // for more detailed error
                    throw new Error(`Server Error: ${response.status} - ${errorData}`);
                }
                const data = await response.json();
                dispatch(updateprofile({
                    Name: profile.Name,
                    Gender: profile.Gender,
                    Phone_Number: profile.Phone_Number
                }));
                toast.success(`Successfully Updated!!`, {
                    position: "bottom-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log("Success:", data);
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        }
    }
    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="profile-info lg:w-[60vw] md:w-[60vw] w-full max-h-[250vh] lg:mt-0 md:mt-0 mt-[10vw] ">
                <div className="profile-info-container lg:pl-[35px] md:pl-[35px] pl-7 lg:pt-[20px] lg:p-[10px]">

                    {/* personal info :name  */}
                    <div className="personal-info w-full">
                        <div className="heading flex items-center gap-[20px]">
                            <h2 className='text-xl text-center font-medium'>Personal Information</h2>
                            <button className='text-[#2455f4] text-md text-center' onClick={() => {
                                setprofile(prev => ({
                                    ...prev,
                                    Name: User.user.Name || "",
                                    Gender: User.user.Gender || ""
                                }));
                                setshoweditprofileinfo(!showeditprofileinfo)

                            }}>{showeditprofileinfo ? "Edit" : "Cancel"}</button>
                        </div>
                        <div className="main-content mt-[20px] flex lg:flex-row md:flex-row flex-col">
                            <div className="personal">
                                <div className={`containe ${showeditprofileinfo ? "cursor-not-allowed" : ""}`}>
                                    <input type="text" name="Name" id="First-name" value={profile.Name} className={` text-md border-[#e0e0e0] border-[2px] rounded-[5px]  p-[16px]  ${showeditprofileinfo ? "pointer-events-none ,hover:cursor-not-allowed , opacity-60 , bg-[#fafafa]  " : " bg-white , border-[#2455f4] border-[1px]"}`} disabled={showeditprofileinfo == true} onChange={(e) => { handlechange(e) }} />
                                </div>
                                {/* Gender  */}
                                <div className="containe mt-[25px]">
                                    <div className='mb-[10px] text-md'>Your Gender</div>
                                    <div className={`gender-container flex items-center gap-[40px] ${showeditprofileinfo ? "cursor-not-allowed" : ""}`}>
                                        <div className={`male flex gap-[10px] items-center ${showeditprofileinfo ? "pointer-events-none ,hover:cursor-not-allowed , opacity-60 , bg-[#fafafa]  " : " bg-white"}`}>
                                            <input type="checkbox" name="Male" id="Male" value={profile.Gender} className={`appearance-none h-4 w-4 border border-gray-400 rounded-full checked:bg-[#2874f0]  checked:border-[#2874f0] relative `}
                                                checked={profile.Gender === 'Male'}
                                                disabled={showeditprofileinfo == true} onChange={(e) => { setprofile({ ...profile, Gender: e.target.checked ? 'Male' : '' }) }} />

                                            <label htmlFor="Male" className='rounded-[50px]'>Male</label>
                                        </div>
                                        <div className={`female flex gap-[10px] items-center ${showeditprofileinfo ? "pointer-events-none ,hover:cursor-not-allowed , opacity-60 , bg-[#fafafa]  " : " bg-white "} ${showeditprofileinfo ? "cursor-not-allowed" : ""}`}>

                                            <input type="checkbox" name="Female" id="Female" value={profile.Gender} className={`appearance-none h-4 w-4 border border-gray-400 rounded-full checked:bg-[#2874f0]  checked:border-[#2874f0] relative `}
                                                checked={profile.Gender === 'Female'} disabled={showeditprofileinfo == true} onChange={(e) => { setprofile({ ...profile, Gender: e.target.checked ? 'Female' : '' }) }} />

                                            <label htmlFor="Female">Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showeditprofileinfo ? "" : (
                                <button className='lg:ml-[50px] md:ml-[50px] ml-0 mt-5 lg:w-[8vw] md:w-[8vw] w-1/2 lg:h-[6vh] md:h-[6vh] h-10 text-lg border-black border-2 bg-[#2874f0] text-white font-semibold' onClick={() => {
                                    handleSave()
                                    setshoweditprofileinfo(!showeditprofileinfo)
                                }} disabled={profile.Name.length == 0 && profile.Gender == ""}>SAVE</button>
                            )}
                        </div>

                        {/* Email Address  */}
                        <div className="email-container mt-[50px]">
                            <div className="heading flex items-center gap-[20px]">
                                <h2 className='text-xl text-center font-medium'>Email Address</h2>
                                <button className='text-[#2455f4] text-md text-center' onClick={() => {
                                    setprofile(prev => ({
                                        ...prev,
                                        Email: User.user.Email || ""
                                    }));
                                    setshowemailedit(!showemailedit)
                                }}>{showemailedit ? "Edit" : "Cancel"}</button>
                            </div>
                            <div className={`email ${showemailedit ? "cursor-not-allowed" : ""}`}>
                                <div className="containe mt-[20px]">
                                    <input type="text" name="Email" id="Email" value={profile.Email} className={` text-md border-[#e0e0e0] border-[2px] rounded-[5px]  p-[16px]  ${showemailedit ? "pointer-events-none ,hover:cursor-not-allowed , opacity-60 , bg-[#fafafa]  " : " bg-white , border-[#2455f4] border-[1px]"}`} disabled={showemailedit == true} onChange={(e) => { handlechange(e) }} />
                                    {showemailedit ? "" : (
                                        <button className='lg:ml-[50px] md:ml-[50px] ml-0 mt-5 lg:w-[8vw] md:w-[8vw] w-1/2 lg:h-[6vh] md:h-[6vh] h-10 text-lg border-black border-2 bg-[#2874f0] text-white font-semibold' onClick={() => {
                                            handleSave()
                                            setshowemailedit(!showemailedit)
                                        }} disabled={profile.Email.length == 0}>SAVE</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phone_number  */}
                        <div className="phone-number-container mt-[50px]">
                            <div className="heading flex items-center gap-[20px]">
                                <h2 className='text-xl text-center font-medium'>Phone Number</h2>
                                <button className='text-[#2455f4] text-md text-center' onClick={() => {
                                    setprofile(prev => ({
                                        ...prev,
                                        Phone_Number: User.user.Phone_Number || ""
                                    }));
                                    setshowphonenumedit(!showphonenumedit)
                                }}>{showphonenumedit ? "Edit" : "Cancel"}</button>
                            </div>
                            <div className={`email ${showphonenumedit ? "cursor-not-allowed" : ""}`}>
                                <div className="containe mt-[20px]">
                                    <input type="tel" name="Phone_Number" id="Phone_Number" value={profile.Phone_Number || ""} className={` text-md border-[#e0e0e0] border-[2px] rounded-[5px]  p-[16px]  ${showphonenumedit ? "pointer-events-none ,hover:cursor-not-allowed , opacity-60 , bg-[#fafafa] , checked:bg-[#fafafa] , checked:border-[#fafafa] " : " bg-white , border-[#2455f4] border-[1px]"}`} disabled={showphonenumedit == true} onChange={(e) => { handlechange(e) }} />
                                    {showphonenumedit ? "" : (
                                        <button className='lg:ml-[50px] md:ml-[50px] ml-0 mt-5 lg:w-[8vw] md:w-[8vw] w-1/2 lg:h-[6vh] md:h-[6vh] h-10 text-lg border-black border-2 bg-[#2874f0] text-white font-semibold' onClick={() => {
                                            handleSave()
                                            setshowphonenumedit(!showphonenumedit)
                                        }} disabled={profile.Phone_Number.length == 0}>SAVE</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* texts  */}
                    <div className="texts mt-[70px]">
                        <h1 className='text-xl font-[500]'>FAQs</h1>
                        <div className="question-container flex flex-col gap-[20px] mt-[30px]">
                            <span className='font-medium'>What happens when I update my email address (or mobile number)?</span>
                            <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                            <span className='font-medium'>When will my Flipkart account be updated with the new email address (or mobile number)?</span>
                            <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                            <span className='font-medium'>What happens to my existing Flipkart account when I update my email address (or mobile number)?</span>
                            <p>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
                            <span className='font-medium'>Does my Seller account get affected when I update my email address?</span>
                            <p>Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also.</p>
                        </div>
                    </div>

                    {/* button  */}
                    <div className="button flex flex-col items-start mt-[40px] gap-[20px]">
                        <button className='text-[#1b3aa1] cursor-pointer'>Deactivate Account</button>
                        <button className='text-red-700 cursor-pointer'>Delete Account</button>
                    </div>
                </div>
                {/* image  */}
                <div className="img">
                    <img src={`${baseURL}/static/personal-info-bottom.png`} alt="img" className='w-full' />
                </div>
            </div>
        </>
    )
}

export default ProfileInfo
