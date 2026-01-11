import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from './features/cartSlice'; // Bundle import is enough
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Profile from './pages/user/Profile';
import About from './pages/user/About';
import Blog from './pages/user/Blog';
import Menu from './pages/user/Menu';
import Deals from './pages/user/Deals';
import OrderSuccess from './pages/user/OrderSuccess';
import MyOrders from './pages/user/MyOrders';
import TrackOrder from './pages/user/TrackOrder';
import OrderDetail from './pages/user/OrderDetail';
import BlogDetail from './pages/user/BlogDetail';
// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import Categories from './pages/admin/Categories';
import FoodForm from './pages/admin/FoodForm';
import CategoryForm from './pages/admin/CategoryForm';
import OrderDetails from './pages/admin/OrderDetails'; // Admin side detail
import ManageBanners from './pages/admin/ManageBanners';
import BannerForm from './pages/admin/BannerForm';
import AdminProfile from './pages/admin/AdminProfile';
import ManageDeals from './pages/admin/ManageDeals';
import DealForm from './pages/admin/DealForm';
import ManageShipping from './pages/admin/ManageShipping';
import ManageReviews from './pages/admin/ManageReviews';
import ManageBlogs from './pages/admin/ManageBlogs';
import BlogForm from './pages/admin/BlogForm';
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Sync Cart from Database on startup/login
  useEffect(() => {
    if (user) {
      dispatch(cartActions.fetchCart());
    }
  }, [user, dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* --- User Routes --- */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />

          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="menu" element={<Menu />} />
          <Route path="deals" element={<Deals />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="track-order/:id" element={<TrackOrder />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="order-detail/:id" element={<OrderDetail />} />
          </Route>

        </Route>

        {/* --- Auth Routes --- */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="foods" element={<ManageFoods />} />
            <Route path="foods/add" element={<FoodForm />} />
            <Route path="foods/edit/:id" element={<FoodForm />} />

            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />

            <Route path="banners" element={<ManageBanners />} />
            <Route path="banners/add" element={<BannerForm />} />
            <Route path="banners/edit/:id" element={<BannerForm />} />

            <Route path="deals" element={<ManageDeals />} />
            <Route path="deals/add" element={<DealForm />} />
            <Route path="deals/edit/:id" element={<DealForm />} />

            <Route path="orders" element={<ManageOrders />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            <Route path="users" element={<ManageUsers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="shipping" element={<ManageShipping />} />
            <Route path="reviews" element={<ManageReviews />} />

            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="blogs/add" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;