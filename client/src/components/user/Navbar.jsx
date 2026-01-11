import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, Package, Plus, Minus, ShoppingBag, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/authSlice';
import { cartActions } from '../../features/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  // Get State from Redux
  const { user } = useSelector(state => state.auth);
  const { totalQuantity, items, totalAmount } = useSelector(state => state.cart);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
    setIsCartOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/auth/login');
  };

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(cartActions.addToCart({ ...item, qty: newQty }));
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Remove this item?")) {
      dispatch(cartActions.removeFromCart(id));
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Deals', path: '/deals' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-brand-primary uppercase italic">
            FOODIE<span className="text-dark-100 font-bold">S</span>
          </Link>

          {/* Middle Navigation (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path 
                  ? 'text-brand-primary bg-orange-50' 
                  : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons & Profile */}
          <div className="flex items-center space-x-1 md:space-x-3">
            
            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-600 hover:text-brand-primary transition-colors cursor-pointer active:scale-90"
            >
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 text-white bg-brand-primary text-[9px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-black border-2 border-white animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center focus:outline-none transition-transform active:scale-90"
              >
                <div className={`w-12 h-12  rounded-full flex items-center justify-center text-brand-primary   text-xs font-black  overflow-hidden ${user?.avatar ? '' : 'border-2 border-brand-primary'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    user?.name?.slice(0, 1).toUpperCase() || 'JD'
                  )}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white rounded-[0.5rem] shadow-2xl border border-gray-100 py-4 z-50 origin-top-right overflow-hidden"
                  >
                    <Link to="/profile" className="flex items-center gap-3 px-6 py-3.5 hover:bg-orange-50 hover:text-brand-primary text-xs font-black uppercase tracking-widest text-gray-600 transition-colors">
                      <User size={16}/> My Profile
                    </Link>
                    <Link to="/my-orders" className="flex items-center gap-3 px-6 py-3.5 hover:bg-orange-50 hover:text-brand-primary text-xs font-black uppercase tracking-widest text-gray-600 transition-colors">
                      <Package size={16}/> My Orders
                    </Link>
                  
                    
                    <div className="mx-6 mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-500 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        <LogOut size={10}/> Logout 
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-dark-100 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- CART SIDEBAR (DRAWER) --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-dark-100/60 z-[60] backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[400px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-3 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-md text-brand-primary">
                    <ShoppingBag size={20}/>
                  </div>
                  <span className="text-lg font-black   text-dark-100">
                    {totalQuantity} item(s)
                  </span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {items.length > 0 ? items.map((item) => (
                  <div key={item.food} className="flex gap-5 group">
                    <div className="w-16 h-16 bg-gray-50 rounded-[0.5rem] overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 relative">
                      <h4 className="font-black text-dark-100 text-sm uppercase tracking-tight leading-tight pr-6">{item.name}</h4>
                      <p className="text-brand-primary font-black text-sm mt-1">Rs {item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-0 mt-1 w-fit border border-gray-100 rounded-md p-1 bg-gray-50/50">
                        <button onClick={() => updateQty(item, item.qty - 1)} className="p-1 text-gray-400 hover:text-brand-primary"><Minus size={10} strokeWidth={3}/></button>
                        <span className="font-black text-sm w-4 text-center text-dark-100">{item.qty}</span>
                        <button onClick={() => updateQty(item, item.qty + 1)} className="p-1 text-gray-400 hover:text-brand-primary"><Plus size={10} strokeWidth={3}/></button>
                      </div>

                      <button onClick={() => handleRemoveItem(item.food)} className="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-500 transition-colors">
                        <X size={14}/>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-4">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.2em] text-[10px]">Your bag is currently empty</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50/30 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Excluding Shipping</p>
                  <div className="flex justify-between items-end">
                    <span className="font-black text-dark-100 uppercase text-md tracking-tighter">Order Subtotal</span>
                    <span className="text-xl font-black text-brand-primary tracking-tighter italic">Rs {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/checkout')}
                    disabled={items.length === 0}
                    className="w-full bg-dark-100 text-white py-5 rounded-[0.5rem] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-2xl shadow-orange-900/10 disabled:opacity-50 active:scale-95 text-xs"
                  >
                    Checkout Now (Rs {totalAmount.toFixed(0)})
                  </button>
                  <button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-white border-2 border-dark-100 text-dark-100 py-4 rounded-[0.5rem] font-black uppercase tracking-widest hover:bg-gray-100 transition-all text-[10px]"
                  >
                    View Shopping Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-50 overflow-hidden shadow-inner"
          >
            <div className="py-8 px-6 space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`block w-full px-8 py-5 rounded-[0.5rem] text-xl font-black uppercase tracking-tighter transition-all ${
                    location.pathname === link.path ? 'bg-brand-primary text-white shadow-xl shadow-orange-200' : 'text-dark-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;