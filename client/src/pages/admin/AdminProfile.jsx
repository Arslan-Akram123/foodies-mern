import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, ShieldCheck, Camera, Save, 
  Loader2, CheckCircle2, Lock, ShieldAlert 
} from 'lucide-react';
import { updateProfile, reset as resetAuth } from '../../features/authSlice';
import API from '../../api/axios';

const AdminProfile = () => {
  const dispatch = useDispatch();
  
  // Get Admin data from Redux
  const { user, isLoading, isSuccess } = useSelector((state) => state.auth);

  // Local States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar || "");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Sync form if user data changes
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
      setImagePreview(user.avatar);
    }
  }, [user]);

  // Handle Success Feedback
  useEffect(() => {
    if (isSuccess) {
      setSuccessMsg("Administrator profile synced!");
      const timer = setTimeout(() => {
        setSuccessMsg("");
        dispatch(resetAuth());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let avatarUrl = user?.avatar;

    try {
      // 1. Upload to Cloudinary if new image selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await API.post('/upload', uploadData);
        avatarUrl = uploadRes.data.url;
      }

      // 2. Dispatch Redux Action (Updates Store, LocalStorage, and DB)
      dispatch(updateProfile({ ...formData, avatar: avatarUrl }));
      setImageFile(null);
    } catch (err) {
      alert("System update failed. Please check server logs.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            Admin <span className="text-brand-primary">Account</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-brand-primary"/> Full System Control Access
          </p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-md font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={16}/> {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: AVATAR CARD --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-10 rounded-[0.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary"></div>
            
            <div className="relative inline-block">
              <div className="w-40 h-40 rounded-full border-4 border-orange-50 overflow-hidden shadow-2xl bg-gray-100 mx-auto transition-transform group-hover:scale-[1.02]">
                {imagePreview ? (
                  <img src={imagePreview} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-4xl italic uppercase">
                    {user?.name?.slice(0, 1)}
                  </div>
                )}
              </div>
              
              <input type="file" id="admin-avatar" hidden accept="image/*" onChange={handleImageChange} />
              <label 
                htmlFor="admin-avatar" 
                className="absolute -bottom-2 -right-2 p-3.5 bg-dark-100 text-white rounded-full border-4 border-white cursor-pointer hover:bg-brand-primary hover:scale-110 transition-all shadow-xl active:scale-90"
              >
                <Camera size={20} />
              </label>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black text-dark-100 uppercase tracking-tighter truncate">{user?.name}</h3>
              <p className="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mt-2">Super Administrator</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-center gap-4">
               <div className="text-center px-4">
                  <p className="text-xl font-black text-dark-100">Active</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
               </div>
               <div className="w-[1px] bg-gray-100 h-10"></div>
               <div className="text-center px-4">
                  <p className="text-xl font-black text-dark-100">v4.1</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Platform</p>
               </div>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-[0.5rem] border border-orange-100 flex items-start gap-4">
             <ShieldAlert className="text-brand-primary shrink-0" size={24}/>
             <p className="text-xs font-bold text-dark-100 leading-relaxed italic">
               Note: All profile changes are logged for security auditing. Ensure your registered email is monitored.
             </p>
          </div>
        </div>

        {/* --- RIGHT: SETTINGS FORM --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[0.5rem] shadow-sm border border-gray-100">
            <form onSubmit={handleUpdate} className="space-y-10">
              
              {/* Identity Section */}
              <div className="space-y-8">
                <h4 className="font-black text-sm uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3">
                  <User size={18} className="text-brand-primary"/> Identity Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Display Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 bg-gray-50 rounded-md border-none outline-none focus:ring-4 focus:ring-orange-50 focus:border-brand-primary transition-all font-bold text-dark-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Access</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 bg-gray-50 rounded-md border-none outline-none focus:ring-4 focus:ring-orange-50 focus:border-brand-primary transition-all font-bold text-dark-100" 
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-8 pt-4">
                <h4 className="font-black text-sm uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3">
                  <Lock size={18} className="text-brand-primary"/> Security Authorization
                </h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Update Master Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter new strong password to change..."
                    className="w-full p-2 bg-gray-50 rounded-md border-none outline-none focus:ring-4 focus:ring-orange-50 focus:border-brand-primary transition-all font-bold text-dark-100" 
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-16 py-5 bg-dark-100 text-white rounded-[0.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/10 hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                  Execute Update
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;