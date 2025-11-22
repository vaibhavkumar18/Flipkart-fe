import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Assuming react-icons is installed

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 w-full lg:h-[20vh] h-[40vh] flex items-center"> {/* Added w-full for full width */}
      <div className="container mx-auto px-4 lg:px-8 ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-8">
          {/* Copyright Information */}
          <div className="text-sm font-medium text-gray-300">
            © {new Date().getFullYear()} Ecom. All rights reserved.
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 hover:bg-gray-800" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 hover:bg-gray-800" aria-label="Twitter">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 hover:bg-gray-800" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 hover:bg-gray-800" aria-label="LinkedIn">
              <FaLinkedin size={24} />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center sm:flex-row gap-4 sm:gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;