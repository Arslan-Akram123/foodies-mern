import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Save, X, Upload, Tag, DollarSign, Package, Image as ImageIcon, Loader2 } from 'lucide-react';
import API from '../../api/axios';
import { getActiveDeals } from '../../features/dealSlice';

const DealForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  const { deals } = useSelector((state) => state.deals);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    items: '',
    originalPrice: '',
    dealPrice: '',
    active: true,
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Pre-fill form if editing
  useEffect(() => {
    if (isEdit) {
      const dealToEdit = deals.find((d) => d._id === id);
      if (dealToEdit) {
        setFormData(dealToEdit);
      } else {
        const fetchDeal = async () => {
          try {
            const res = await API.get(`/deals/${id}`);
            setFormData(res.data);
          } catch (err) {
            console.error("Failed to load deal");
          }
        };
        fetchDeal();
      }
    }
  }, [id, isEdit, deals]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, active: e.target.value === 'Active' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  // 2. Integrated Submit Logic
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = formData.image;

    try {
      // Step A: Upload image if a new file was selected
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);
        const uploadRes = await API.post('/upload', data);
        imageUrl = uploadRes.data.url;
      }

      const finalData = { ...formData, image: imageUrl };

      // Step B: Save to Database
      if (isEdit) {
        await API.put(`/deals/${id}`, finalData);
      } else {
        await API.post('/deals', finalData);
      }

      dispatch(getActiveDeals()); // Refresh deal list in store
      navigate('/admin/deals');
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
          {isEdit ? 'Update' : 'Create'} <span className="text-brand-primary">Combo Deal</span>
        </h2>
        <button 
          onClick={() => navigate('/admin/deals')} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X size={24}/>
        </button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-md shadow-sm border border-gray-100 relative overflow-hidden">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Image Upload Area */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deal Display Image</label>
            <div className="relative group">
              <input 
                type="file" 
                id="deal-image" 
                hidden 
                onChange={handleImageChange}
                accept="image/*"
              />
              <label 
                htmlFor="deal-image"
                className={`w-full h-64 border-2 border-dashed rounded-[0.5rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                  ${formData.image ? 'border-brand-primary border-solid' : 'border-gray-100 hover:border-brand-primary hover:bg-orange-50'}`}
              >
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <img src={formData.image} alt="Deal Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
                        <Upload size={18}/> Change Banner
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-orange-50 rounded-md text-brand-primary mb-3">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Upload deal background</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deal Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={onChange}
              type="text" 
              placeholder="e.g. Weekend Family Combo" 
              className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold text-dark-100" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Included Food Items</label>
            <div className="relative">
                <Package className="absolute left-4 top-4 text-gray-300" size={18}/>
                <textarea 
                  required
                  name="items"
                  value={formData.items}
                  onChange={onChange}
                  rows="1" 
                  placeholder="2 Burgers, 1 Fries, 2 Drinks" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-medium text-gray-600 h-[56px] resize-none"
                ></textarea>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Original Price (Rs)</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input 
                  required
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={onChange}
                  type="number" 
                  placeholder="25.00" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold text-gray-400 line-through" 
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Deal Price (Rs)</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={18}/>
                <input 
                  required
                  name="dealPrice"
                  value={formData.dealPrice}
                  onChange={onChange}
                  type="number" 
                  placeholder="19.99" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-black text-brand-primary text-xl" 
                />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deal Status</label>
            <select 
              value={formData.active ? 'Active' : 'Inactive'}
              onChange={handleStatusChange}
              className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-black text-xs uppercase tracking-widest text-dark-100"
            >
                <option value="Active">Active & Live</option>
                <option value="Inactive">Hidden / Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-brand-primary text-white py-5 rounded-[0.5rem] font-black shadow-xl shadow-orange-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin"/> : <Save size={22}/>} 
              {isEdit ? 'UPDATE COMBO' : 'PUBLISH COMBO'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/deals')} 
              className="px-12 py-5 bg-gray-100 text-gray-500 font-bold rounded-[0.5rem] hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;