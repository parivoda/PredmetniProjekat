import '../src/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Users/Registration';
import Verification from './components/Users/Verification';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import { useDispatch, useSelector} from 'react-redux';
import PrivateRoutes from './utils/PrivateRoutes';
import { setUser, clearUser } from './redux/userSlice';
import { useEffect, useState } from 'react';
import { GetUserRole, GetUserVerification } from './utils/CurrentUser';
import SellerArticles from './components/Items/SellerArticles';
import AllArticles from './pages/Article/AllArticles';
import Cart from './pages/Cart/Cart';
import CustomerOrders from './components/Orders/CustomerOrders';
import AllOrders from './components/Orders/AllOrders';
import SellerDeliveredOrders from './components/Orders/SellerDeliveredOrders';
import SellerNewOrders from './components/Orders/SellerNewOrders';
import PendingOrders from './pages/Order/Pending/PendingOrders';
import OrderMap from './components/Orders/OrderMap';
import { isTokenExpired } from './utils/TokenExpiration';

function App() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) {
        const user = {
          token,
          role: GetUserRole(token),
          isVerified: GetUserVerification(token),
        };
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    }
    setLoading(false);
  }, [dispatch]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <>
      <Routes>
        {/* rute koje zelim da zastitim */}
        <Route element={<PrivateRoutes/>}> 
            <Route path="/profile" element={<Profile />} />
            {user.role === "Administrator" ? (
              <>
              <Route path="/verification" element={<Verification />} />
              <Route path="/all-orders" element={<AllOrders />} />
              </>
            ) : (
              <>
              <Route path="/verification" element={<Navigate to="/" />} />
              <Route path="/all-orders" element={<Navigate to="/" />} />
              </>
            )}
            {user.role === "Seller" && user.isVerified === 'True' ? (
              <>
              <Route path="/seller-articles" element={<SellerArticles />} />
              <Route path="/seller-orders" element={<SellerDeliveredOrders />} />
              <Route path="/new-orders" element={<SellerNewOrders />} />
              <Route path="/map" element={<OrderMap />} />
              </>
            ) : (
              <>
              <Route path="/seller-articles" element={<Navigate to="/" />} />
              <Route path="/seller-orders" element={<Navigate to="/" />} />
              <Route path="/new-orders" element={<Navigate to="/" />} />
              <Route path="/map" element={<Navigate to="/" />} />
              </>
            )}
             {user.role === "Customer" ? (
                <>
                  <Route path="/all-articles" element={<AllArticles />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/customer-orders" element={<CustomerOrders/>}/>
                  <Route path="/pending-orders" element={<PendingOrders />} />
                </>) : (<>
                <Route path="/all-articles" element={<Navigate to="/" />} />
                <Route path="/cart" element={<Navigate to="/" />} />
                <Route path="/customer-orders" element={<Navigate to="/" />}/>
                <Route path="/pending-orders" element={<Navigate to="/" />} />
                </>
              )}
        </Route>
        <Route path="/" element={<Home/>} />
        <Route path="/registration" element={<Registration />}/>
      </Routes>
      </>
  );
}

export default App;