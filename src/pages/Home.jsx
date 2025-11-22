import React from 'react'
import { useState, useEffect } from 'react'
import ProductCard from '../component/ProductCard'
import ImageSlider from '../component/ImageSlider'
import Loader from '../component/Loader'
const Home = () => {
  const [product, setproduct] = useState([])
  const [loading, setLoading] = useState(true);
  const getdata = async () => {
    try {
      const data = await fetch('https://dummyjson.com/products');
      const storeData = await data.json();
      setproduct(storeData.products);
      setLoading(false); // done loading
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getdata()

    }, 500);
  }, [])
  useEffect(() => {
    document.title = 'Online Shoping Of Mobiles and Other Accessories';
  }, []);
  console.log(product)
  return (
    <>
    <div className="w-full flex flex-col">

        <ImageSlider />

        {
          loading ?
            (
              <Loader message="Fetching products..." />
            )
            : (

              <div className="flex flex-wrap lg:justify-between justify-center gap-5 lg:p-5 p-3">
                {product.map((product) => (
                  <ProductCard key={product.id} product={product} /> // Display each product
                ))}
              </div>
            )

        }
      </div>

    </>
  )
}
export default Home



