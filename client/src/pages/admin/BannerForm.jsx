import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Upload, X, Tag as TagIcon, DollarSign, Loader2 } from 'lucide-react';
import API from '../../api/axios';
import { getActiveBanners } from '../../features/bannerSlice';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    discountTag: '',
    active: true,
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { banners } = useSelector((state) => state.banners);

  // 1. Fetch Banner Details if in Edit Mode
  useEffect(() => {
  if (isEdit) {
    const fetchBanner = async () => {
      try {
        // This was returning 404, now it will return the Banner data (200 OK)
        const res = await API.get(`/banners/${id}`); 
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load banner data", err);
      }
    };
    fetchBanner();
  }
}, [id, isEdit]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  // 2. Submit Logic (Cloudinary + MongoDB)
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = formData.image;

    try {
      // Step A: Upload new image to Cloudinary if selected
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);
        const uploadRes = await API.post('/upload', data);
        imageUrl = uploadRes.data.url;
      }

      const finalData = { ...formData, image: imageUrl };

      // Step B: Create or Update in Database
      if (isEdit) {
        await API.put(`/banners/${id}`, finalData);
      } else {
        await API.post('/banners', finalData);
      }

      dispatch(getActiveBanners()); // Refresh the global list
      navigate('/admin/banners');
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          {isEdit ? 'Update' : 'Create'} <span className="text-brand-primary">Banner</span>
        </h2>
        <button 
          onClick={() => navigate('/admin/banners')} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X size={24}/>
        </button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[0.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Status Switcher */}
          <div className="md:col-span-2 flex items-center justify-between p-6 bg-orange-50 rounded-[0.5rem] border border-orange-100/50">
             <div>
                <p className="font-black text-dark-100 uppercase text-xs tracking-widest">Active Visibility</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Make this banner live on the home page slider?</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="active"
                checked={formData.active} 
                onChange={onChange}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary shadow-inner"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Heading</label>
            <input required name="title" value={formData.title} onChange={onChange} type="text" placeholder="e.g. Mega Cheese Monday" className="w-full p-4 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-bold text-dark-100" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Tag</label>
            <div className="relative">
              <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
              <input name="discountTag" value={formData.discountTag} onChange={onChange} type="text" placeholder="e.g. 50% OFF" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-black text-red-500 uppercase" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Offer Description / Subtitle</label>
            <input name="subtitle" value={formData.subtitle} onChange={onChange} type="text" placeholder="e.g. Get 50% Off on all Burgers today only!" className="w-full p-4 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-medium text-gray-600" />
          </div>

          {/* Image Upload Area */}
          <div className="md:col-span-2 space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Background Image</label>
             <input type="file" id="banner-upload" hidden onChange={handleImageChange} accept="image/*" />
             <label htmlFor="banner-upload" className="w-full h-56 border-2 border-dashed border-gray-100 rounded-[0.5rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group hover:border-brand-primary">
                {formData.image ? (
                   <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                   <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-orange-50 rounded-md flex items-center justify-center text-brand-primary mx-auto group-hover:scale-110 transition-transform">
                        <Upload size={30}/>
                      </div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Click to upload banner background</p>
                   </div>
                )}
             </label>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
             <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-brand-primary text-white py-5 rounded-[0.5rem] font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin"/> : <Save size={24}/>}
                {isEdit ? 'UPDATE PROMOTION' : 'PUBLISH PROMOTION'}
             </button>
             <button onClick={() => navigate('/admin/banners')} type="button" className="px-12 py-5 bg-gray-100 text-gray-500 font-bold rounded-[0.5rem] hover:bg-gray-200 transition-colors">
                Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;