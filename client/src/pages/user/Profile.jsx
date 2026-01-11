import { useState, useEffect } from 'react';
import { 
  Package, User, MapPin, Save, Settings, Eye, 
  Truck, Receipt, Loader2, CheckCircle2, 
  Camera, ShoppingBag 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../../features/orderSlice';
import { updateProfile, reset as resetAuth } from '../../features/authSlice';
import API from '../../api/axios';

const Profile = () => {
  const dispatch = useDispatch();
  
  // Get live data from Redux Store
  const { user, isLoading: authLoading, isSuccess: authSuccess } = useSelector((state) => state.auth);
  const { orders = [], isLoading: ordersLoading = false } = useSelector((state) => state.orders || {});

  const [activeTab, setActiveTab] = useState('My Orders');
  const [successMsg, setSuccessMsg] = useState("");

  // Local Form & Image States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar || "");
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password:user?.password || ''
  });

  // 1. Load Orders & Sync Form Data
  useEffect(() => {
    dispatch(getMyOrders());
    
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: user.password });
      setImagePreview(user.avatar);
    }
  }, [user]);

  // 2. Clear Auth Success status after update
  useEffect(() => {
    if (authSuccess) {
      setSuccessMsg("Profile synced successfully!");
      const timer = setTimeout(() => {
        setSuccessMsg("");
        dispatch(resetAuth());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authSuccess, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 3. Hande Live Profile Update via Redux
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let avatarUrl = user?.avatar;

    try {
      // Step A: If new image picked, upload to Cloudinary via our API
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await API.post('/upload', uploadData);
        avatarUrl = uploadRes.data.url;
      }

      // Step B: Dispatch Redux Action (Updates store + localStorage + DB)
      dispatch(updateProfile({ ...formData, avatar: avatarUrl }));
      setImageFile(null); // Reset file selection after upload
    } catch (err) {
      alert("Profile update failed. Please check your connection.");
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- 1. REACTIVE SIDEBAR --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[0.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary"></div>
            
            {/* Live Avatar Sync */}
            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-50 shadow-xl overflow-hidden flex items-center justify-center bg-brand-primary text-white text-3xl font-black">
              {user?.avatar ? (
                <img src={user.avatar} alt="profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>

            <h2 className="text-xl font-black text-dark-100 uppercase tracking-tighter truncate">{user?.name}</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Level: {user?.role}</p>
          </div>
          
          <nav className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden p-2">
             {[
               { id: 'My Orders', icon: <Package size={20}/> },
               { id: 'Account Settings', icon: <Settings size={20}/> }
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-4 px-6 py-4 rounded-md transition-all mb-1 last:mb-0 uppercase text-[10px] font-black tracking-widest ${
                   activeTab === tab.id 
                   ? 'bg-brand-primary text-white shadow-lg shadow-orange-200' 
                   : 'text-gray-400 hover:bg-gray-50'
                 }`}
               >
                 {tab.icon} {tab.id}
               </button>
             ))}
          </nav>
        </div>

        {/* --- 2. DYNAMIC CONTENT SECTION --- */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight italic">
              {activeTab.split(' ')[0]} <span className="text-brand-primary">{activeTab.split(' ')[1] || ''}</span>
            </h1>
            {successMsg && (
              <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 size={18}/> {successMsg}
              </div>
            )}
          </div>

          {/* CONTENT: MY ORDERS */}
          {activeTab === 'My Orders' && (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="bg-white p-6 md:p-8 rounded-[0.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-brand-primary transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-brand-primary transition-colors">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-black text-dark-100 uppercase">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Amount Paid</p>
                       <div className="font-black text-brand-primary text-xl">Rs {order.totalPrice.toFixed(2)}</div>
                    </div>
                    
                    <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {order.status}
                    </span>

                    <div className="flex items-center gap-3">
                      <Link to={`/order-detail/${order._id}`} className="p-3 bg-gray-100 text-gray-500 hover:bg-brand-primary hover:text-white rounded-md transition-all shadow-sm">
                        <Eye size={18}/>
                      </Link>
                      <Link to={`/track-order/${order._id}`} className="p-3 bg-gray-100 text-gray-500 hover:bg-dark-100 hover:text-white rounded-md transition-all shadow-sm">
                        <Truck size={18}/>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[0.5rem] border-2 border-dashed border-gray-100">
                   <ShoppingBag size={48} className="mx-auto text-gray-100 mb-4" />
                   <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No orders discovered yet.</p>
                   <Link to="/menu" className="mt-6 inline-block bg-dark-100 text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-brand-primary">Browse Menu</Link>
                </div>
              )}
            </div>
          )}

          {/* CONTENT: SETTINGS (Integrated Image Upload) */}
          {activeTab === 'Account Settings' && (
            <div className="bg-white p-8 md:p-12 rounded-[0.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
               {authLoading && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-brand-primary" size={40}/>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Syncing Profile...</p>
                 </div>
               )}

               <form onSubmit={handleUpdateProfile} className="space-y-12">
                 
                 {/* 2.1 Profile Avatar Upload */}
                 <div className="flex flex-col items-center justify-center space-y-4 pb-8 border-b border-gray-50">
                    <div className="relative group">
                      <div className="w-36 h-36 rounded-full border-4 border-orange-50 overflow-hidden shadow-2xl bg-gray-100 transition-transform group-hover:scale-[1.02]">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-4xl italic">
                             {getInitials(user?.name)}
                          </div>
                        )}
                      </div>
                      
                      <input type="file" id="avatar-field" hidden accept="image/*" onChange={handleImageChange} />
                      <label htmlFor="avatar-field" className="absolute bottom-1 right-1 p-3.5 bg-brand-primary text-white rounded-full border-4 border-white cursor-pointer hover:scale-110 transition-transform shadow-xl active:scale-90">
                        <Camera size={20} strokeWidth={3} />
                      </label>
                    </div>
                    <div className="text-center">
                      <h4 className="font-black text-dark-100 uppercase text-xs tracking-widest italic">Identity Image</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Recommended: 1:1 Aspect Ratio</p>
                    </div>
                 </div>

                 {/* 2.2 Text Fields */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                     <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-5 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-bold text-dark-100 transition-all" 
                    />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Registered Email</label>
                     <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-5 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-bold text-dark-100 transition-all" 
                    />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Security Key (Update Password)</label>
                     <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter new password to change..." 
                      className="w-full p-5 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-bold text-dark-100 transition-all" 
                    />
                   </div>
                 </div>
                 
                 <div className="flex pt-4">
                   <button 
                    type="submit"
                    disabled={authLoading}
                    className="w-full md:w-auto px-12 py-5 bg-dark-100 text-white rounded-md font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/10 hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {authLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                     Update My Identity
                   </button>
                 </div>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;