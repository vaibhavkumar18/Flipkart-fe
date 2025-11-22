import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css"; // <-- Required for slick height fix
import Slider from 'react-slick';
import { useNavigate } from "react-router-dom";

const ImageSlider = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const settings = {
        dots: false,          // dots removed
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    };

    const arr = ["pic-1.png", "pic-2.png", "pic-3.png", "pic-4.png", "pic-5.png", "pic-6.png"];

    return (
        <div className="w-full max-w-[98vw] mx-auto mb-5 mt-5 rounded-lg">
            <Slider {...settings}>
                {arr.map((image, index) => (
                    <div key={index} className="w-full h-[180px] sm:h-[220px] md:h-[300px] lg:h-[380px] xl:h-[430px] overflow-hidden rounded-lg">
                        <img
                            src={`${baseURL}/static/${image}`}
                            alt="slide"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default ImageSlider;
