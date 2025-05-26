import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from '@component/layout/Header';
import Footer from '@component/layout/Footer';
import HomePage from '@page/customer/HomePage';
import TopBar from '@component/layout/TopBar';
import MobileNav from '@component/ui/MobileNav';
import { AuthProvider } from '@context/AuthContext';
import LoginPage from '@page/auth/LoginPage';
import RegisterPage from '@page/auth/RegisterPage';
import VerifyEmailPage from '@page/auth/VerifyEmailPage';
import { CartProvider } from '@context/CartContext';
import { WishlistProvider } from '@context/WishlistContext';
import ProductDetailPage from '@page/customer/ProductDetailPage';
import ProfilePage from '@page/customer/ProfilePage';
import OrderHistoryPage from '@page/customer/OrderHistoryPage';
import OrderDetailPage from '@page/customer/OrderDetailPage';
import ShippingAddressesPage from '@page/customer/ShippingAddressesPage';
import AddAddressPage from '@page/customer/AddAddressPage';
import EditAddressPage from '@page/customer/EditAddressPage';
import Sidebar from '@component/ui/Sidebar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartPage from '@page/customer/CartPage';
import CheckoutPage from '@page/customer/CheckoutPage';
import ProductListPage from '@page/customer/ProductListPage';
function Layout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
}

function LayoutProfile() {
  return (
    <div className="bg-gray-100 min-h-screen max-md:mb-20 max-md:sm-20">
      <div className="bg-gray-200 border-b-2 border-gray-300">
        <div className="container mx-auto p-3">
          <span className="text-gray-600">Trang chủ / </span>
          <span className="text-gray-800">Tài khoản khách hàng thân thiết</span>
        </div>
      </div>
      <div className="container mx-auto p-3 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar />
        <Outlet />

      </div>


    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastContainer />

            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/product-detail" element={<ProductDetailPage />} />
                <Route path="/account" element={<LayoutProfile />}>
                  <Route index element={<ProfilePage />} />
                  <Route path="order-history" element={<OrderHistoryPage />} />
                  <Route path="order-history/order-detail/:orderId" element={<OrderDetailPage />} />
                  <Route path="shipping-addresses" element={<ShippingAddressesPage />} />
                  <Route path="shipping-addresses/add-address" element={<AddAddressPage />} />
                  <Route path="shipping-addresses/edit-address" element={<EditAddressPage />} />
                </Route>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/products" element={<ProductListPage />} />


              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  );
}

export default App;