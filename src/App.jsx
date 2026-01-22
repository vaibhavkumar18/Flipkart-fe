import Home from './pages/Home'
import Header from './component/Header'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './User/SignUp';
import Login from './User/Login';
import Footer from './component/Footer';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import MyProfile from './User/MyProfile';
import Placeorder from './pages/Placeorder';
import Order from './pages/Order';
import ManageAddress from './UsersData/ManageAddress';
import AddAddressForm from './UsersData/AddAddressForm';
import Checkout_Payment_Address from './pages/Checkout_Payment_Address';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileInfo from './UsersData/ProfileInfo';
import Loader from './component/Loader';
import FullScreenLoader from './component/FullScreenLoader';
import OrderDetail from './pages/OrderDetail';
import InvoiceGenerator from './component/InvoiceGenerator';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginLoader from './component/LoginLoader';
import SignupLoader from './component/SignupLoader';
import Logout from './User/Logout';

function App() {

  return (
    <>
      <div className='flex flex-col items-center min-h-screen'>
        <Header />
        <main className='flex-grow pb-20 overflow-x-hidden'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />
            <Route path="/CartPage" element={<CartPage />} />
            {/* Nested Route for MyProfile */}
            <Route path="/MyProfile" element={<MyProfile />}>
              <Route index element={<ProfileInfo />} />
              <Route path='ProfileInfo' element={<ProfileInfo />} />
              <Route path="ManageAddress" element={<ManageAddress />} />
            </Route>


            <Route path="/Placeorder" element={<Placeorder />} />
            <Route path="/Order" element={<Order />} />

            <Route path="/AddAddressForm" element={<AddAddressForm />} />
            <Route path="/Checkout_Payment_Address" element={<Checkout_Payment_Address />} />

            <Route path="/Loader" element={<Loader />} />
            <Route path="/FullScreenLoader" element={<FullScreenLoader />} />
            <Route path="/OrderDetail" element={<OrderDetail />} />
            <Route path="/InvoiceGenerator" element={<InvoiceGenerator />} />
            <Route path="/LoginLoader" element={<LoginLoader />} />
            <Route path="/SignupLoader" element={<SignupLoader />} />
            <Route path="/Logout" element={<Logout />} />


          </Routes>
        </main>
        <Footer />
      </div>
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
    </>
  )
}
export default App
