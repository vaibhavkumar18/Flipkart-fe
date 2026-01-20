import React from 'react'
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const products = product;

    return (
        <div
            className="
                p-3 bg-[#E2E8F0] shadow-xl rounded-lg cursor-pointer hover:scale-105 transition duration-200
                w-full sm:w-[160px] md:w-[170px] lg:w-[190px] xl:w-[210px]
                h-[220px] sm:h-[240px] md:h-[250px] lg:h-[260px] xl:h-[270px]
                flex flex-col items-center justify-between 
            "
            onClick={() => navigate('/ProductDetail', { state: { products } })}
        >
            <img
                src={product.thumbnail}
                alt={product.title}
                className="
                    rounded-md object-contain
                    h-[100px] sm:h-[110px] md:h-[130px] lg:h-[150px]
                "
            />

            <h3 className="font-semibold text-[11px] sm:text-xs md:text-sm text-center text-[#4A5568]">
                {product.title}
            </h3>

            <p className="font-bold text-[12px] sm:text-sm md:text-base lg:text-lg text-center text-[#2D3748]">
                ${product.price}
            </p>
        </div>
    );
};

export default ProductCard;
