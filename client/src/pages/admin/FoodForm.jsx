import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Save, X, Upload, Loader2 } from 'lucide-react';
import { createFood, updateFoodAction, resetFood, getFoods } from '../../features/foodSlice';
import { getCategories } from '../../features/categorySlice';
import API from '../../api/axios';

const FoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    status: 'Available',
    description: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { foods, isLoading, isSuccess, isError, message } = useSelector((state) => state.foods);
  const { categories } = useSelector((state) => state.categories);

  // 1. Initial Load
  useEffect(() => {
    dispatch(getCategories());
    if (isEdit) {
      // Find food from existing state or fetch it
      const foodToEdit = foods.find((f) => f._id === id);
      if (foodToEdit) {
        setFormData(foodToEdit);
      }
    }
  }, [id, isEdit, foods, dispatch]);

  // 2. Handle Success/Error Redirects
  useEffect(() => {
    if (isSuccess) {
      dispatch(resetFood());
      navigate('/admin/foods');
    }
    if (isError) alert(message);
  }, [isSuccess, isError, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 3. Image Selection Logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFormData({ ...formData, image: URL.createObjectURL(file) }); // Local preview
  };

  // 4. Form Submission
  const onSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;

    // If a new file was selected, upload it to Cloudinary first
    if (imageFile) {
      setUploading(true);
      const data = new FormData();
      data.append('image', imageFile);
      try {
        const uploadRes = await API.post('/upload', data);
        imageUrl = uploadRes.data.url;
      } catch (err) {
        alert("Image upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const finalData = { ...formData, image: imageUrl };

    if (isEdit) {
      dispatch(updateFoodAction({ id, foodData: finalData }));
    } else {
      dispatch(createFood(finalData));
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">{isEdit ? 'EDIT' : 'ADD NEW'} <span className="text-brand-primary">FOOD</span></h2>
        <button onClick={() => navigate('/admin/foods')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X/></button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[0.5rem] shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Image Upload Area */}
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Food Image</label>
            <input type="file" id="food-img" hidden onChange={handleImageChange} accept="image/*" />
            <label htmlFor="food-img" className="w-full h-52 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:bg-orange-50 transition-all cursor-pointer overflow-hidden group">
               {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
               ) : (
                  <>
                    <Upload className="mb-2 group-hover:text-brand-primary" />
                    <p className="text-sm font-bold">Click to upload food photo</p>
                  </>
               )}
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Food Name</label>
            <input required name="name" value={formData.name} onChange={onChange} type="text" placeholder="e.g. Double Beef Zinger" className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
            <select required name="category" value={formData.category} onChange={onChange} className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold">
               <option value="">Select Category</option>
               {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price (Rs)</label>
            <input required name="price" value={formData.price} onChange={onChange} type="number" placeholder="9.99" className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</label>
            <select name="status" value={formData.status} onChange={onChange} className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold">
               <option value="Available">Available</option>
               <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea required name="description" value={formData.description} onChange={onChange} rows="4" placeholder="Describe the ingredients..." className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-medium"></textarea>
          </div>

          <div className="md:col-span-2 flex gap-4 pt-6">
            <button 
              type="submit" 
              disabled={isLoading || uploading}
              className="flex-1 bg-brand-primary text-white py-5 rounded-md font-black flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {(isLoading || uploading) ? <Loader2 className="animate-spin"/> : <Save size={20}/>} 
              {isEdit ? 'UPDATE FOOD ITEM' : 'SAVE FOOD ITEM'}
            </button>
            <button type="button" onClick={() => navigate('/admin/foods')} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-md font-bold hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodForm;