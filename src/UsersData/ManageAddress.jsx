import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AddAddress } from "../redux/userslice";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddAddressForm from './AddAddressForm';
import { DeleteAddress } from "../redux/userslice";

const ManageAddress = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ dynamic from .env
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAddAddress, setisAddAddress] = useState(false);
  const [editdata, seteditdata] = useState(null);
  const dispatch = useDispatch();
  const [openMenuId, setOpenMenuId] = useState(null);
  const User = useSelector((state) => state.user);


  // Create a ref for each individual menu container.
  // We'll store refs in an object where keys are item.id
  const menuRefs = useRef({});

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If a menu is open, check if the click was outside of its specific ref
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId].contains(event.target)) {
          setOpenMenuId(null); // Close the menu
        }
      }
    };

    // Add event listener when component mounts or openMenuId changes
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]); // Re-run effect if openMenuId changes

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle based on current openMenuId
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`${baseURL}/api/address/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete from server");
      }

      dispatch(DeleteAddress(id)); // Remove from Redux
      toast.success("Address deleted successfully!", {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete address!", {
        position: "bottom-center",
      });
    }
  };
  // Function to handle Edit click
  const handleEditClick = (item) => {
    seteditdata(item);
    setisAddAddress(true);
    setOpenMenuId(null); // Close the menu
  };
  return (
    <>
      {User.user.Address.length === 0 ? (
        isAddAddress ? (
          <AddAddressForm onClose={(wasSaved) => {
            if (wasSaved) {
              toast.success("Address Is Saved!!", {
                position: "bottom-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
              });
            }
            setTimeout(() => {
              setisAddAddress(false);
              seteditdata(null);
            }, 300);
          }} />
        ) : (
          <div className="containe flex justify-center flex-col items-center w-[60vw] h-[90vh] p-[30px]">
            <div className="img">
              <img src={`${baseURL}/static/address-img.png`} alt="address" className="w-full h-[25vh]" />
            </div>
            <h2 className="text-xl font-semibold">No Addresses found in your account!</h2>
            <p className="m-[15px]">Add a delivery address.</p>
            <button
              className="w-[15vw] h-[8vh] rounded-md bg-[#2874f0] font-semibold text-base text-white"
              onClick={() => setisAddAddress(true)}
            >
              ADD ADDRESSES
            </button>
          </div>
        )
      ) :

        (
          <>
            <div className='manage-address w-full min-h-[80vh] md:p-[10px]'>
              <h1 className='text-xl font-semibold mb-[30px]'>Manage Addresses</h1>

              <div
                className="add-address border-gray-500 border-2 w-full h-[8vh] flex items-center p-[15px] cursor-pointer mb-[30px]"
                onClick={() => {
                  seteditdata(null);
                  setisAddAddress(true);
                }}
              >
                <div className='flex items-center text-lg text-[#2455f4] font-medium'>
                  <div className='text-2xl'>+ &nbsp;</div> ADD A NEW ADDRESS
                </div>
              </div>

              {/* ✅ Render Add New Address Form at the TOP */}
              {isAddAddress && !editdata && (
                <div className="">
                  <AddAddressForm
                    key="new"
                    onClose={(wasSaved) => {
                      if (wasSaved) {
                        toast.success("Address Is Saved!!", {
                          position: "bottom-center",
                          autoClose: 4000,
                          hideProgressBar: false,
                          closeOnClick: false,
                          pauseOnHover: true,
                          draggable: true,
                          theme: "dark",
                          transition: Bounce,
                        });
                      }
                      setTimeout(() => {
                        setisAddAddress(false);
                        seteditdata(null);
                      }, 300);
                    }}
                  />
                </div>
              )}

              {/* ✅ Render list below */}
              {User.user.Address.map((item, index) => (
                <div
                  key={item.id}
                  className="containe w-full h-auto border-black border-2 pl-[20px] pt-[10px] p-[20px] mb-4"
                >
                  <div className="containe text-center flex items-center justify-between w-full">
                    <div className="addresstype w-[50px] ">
                      <div className="text-center bg-[#f0f0f0] text-[#878787] text-xs">
                        {item.Address_Type}
                      </div>
                    </div>
                    <div className="relative lg:w-1/2 md:w-1/4 w-[100%] sm:w-full"
                      ref={el => menuRefs.current[item.id] = el}> {/* Added relative positioning for the 3-dots dropdown */}
                      <img
                        src={`${baseURL}/static/3-dot.svg`}
                        className='ml-auto cursor-pointer'
                        alt="dot"
                        onClick={() => toggleMenu(item.id)} // Pass item.id to toggle specific menu
                      />
                      {/* Check if this specific menu should be open */}
                      {openMenuId === item.id && (
                        <div
                          // Position the dropdown relative to the image
                          className="absolute right-0 mt-2 z-10
                                   lg:w-[120px] md:w-full max-w-full  h-[80px] sm:h-[10vh]
                                   pl-[15px] flex flex-col gap-[7px] justify-center
                                   rounded-[8px] border-black border-2 bg-white shadow-lg"
                        >
                          <button
                            className='text-left mr-2 hover:text-[#2455f4] text-base'
                            onClick={() => handleEditClick(item)} // Use new handler
                          >
                            Edit
                          </button>
                          <button
                            className='text-left mr-2 hover:text-[#2455f4] text-base'
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* ✅ Inline Edit Form OR Static View */}
                  {editdata && editdata.id === item.id ? (
                    <AddAddressForm
                      key={editdata.id}
                      address={editdata}
                      onClose={(wasSaved) => {
                        if (wasSaved) {
                          toast.success("Address Is Updated!!", {
                            position: "bottom-center",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "dark",
                            transition: Bounce,
                          });
                        }
                        setTimeout(() => {
                          seteditdata(null);
                          setisAddAddress(false);
                        }, 300);
                      }}
                    />
                  ) : (
                    <>
                      <div className="name-phone font-bold text-sm pb-[15px] pt-[10px]">
                        {item.Name} &nbsp; {item.Phone_Number}
                      </div>
                      <div className="address text-base">
                        {item.Address}, {item.Locality}, {item.City},
                      </div>
                      <div className='text-base '>
                        {item.State} - <strong>{item.PIN_Code}</strong>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )
      }

    </>
  );
};

export default ManageAddress;
