import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { Bell, User, Menu, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'; // 1. Import Redux hooks
import { logout, reset } from '../features/authSlice'; // 2. Import Auth actions
import { AnimatePresence } from 'framer-motion';
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 3. Initialize dispatch

  // 4. Get live Admin data from Redux
  const { user } = useSelector((state) => state.auth);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Functional Logout Handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout from Admin Panel?")) {
      dispatch(logout()); // Clears LocalStorage & State
      dispatch(reset());  // Resets Success/Error flags
      navigate('/auth/login');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md text-dark-100"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-black text-dark-100 uppercase tracking-tighter italic">
              Dashboard <span className="text-brand-primary">Control</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <Bell size={20}/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 border-l pl-4 md:pl-6 focus:outline-none group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-dark-100 group-hover:text-brand-primary transition-colors uppercase tracking-tight">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                    {user?.role === 'admin' ? 'Admin' : 'Staff'}
                  </p>
                </div>
                
                {/* Dynamic Avatar */}
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-95 transition-transform overflow-hidden border-2 border-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="admin" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-xs">{user?.name?.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-[0.5rem] shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in zoom-in duration-200 origin-top-right overflow-hidden">
                    <Link 
                      to="/admin/profile" 
                      className="flex items-center gap-3 px-6 py-3 hover:bg-orange-50 hover:text-brand-primary text-xs font-black uppercase tracking-widest text-gray-600 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <ShieldCheck size={18} className="text-brand-primary"/> My Account
                    </Link>
                    
                    <div className="mx-6 mt-3 pt-3 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-500 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <LogOut size={16}/> Logout 
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;