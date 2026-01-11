import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Save, X, Upload, Loader2 } from 'lucide-react';
import { getCategories } from '../../features/categorySlice';
import API from '../../api/axios';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (isEdit) {
    const fetchCat = async () => {
      try {
        const res = await API.get(`/categories/${id}`); // Now this will return 200 instead of 404
        setName(res.data.name);
        setImage(res.data.image);
      } catch (err) {
        console.error("Error loading category", err);
      }
    };
    fetchCat();
  }
}, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = image;

    try {
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);
        const uploadRes = await API.post('/upload', data);
        imageUrl = uploadRes.data.url;
      }

      const categoryData = { name, image: imageUrl };

      if (isEdit) {
        await API.put(`/categories/${id}`, categoryData);
      } else {
        await API.post('/categories', categoryData);
      }
      
      dispatch(getCategories());
      navigate('/admin/categories');
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          {isEdit ? 'Update' : 'Add'} <span className="text-brand-primary">Category</span>
        </h2>
        <button onClick={() => navigate('/admin/categories')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X/></button>
      </div>

      <div className="bg-white p-10 rounded-[0.5rem] shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2 text-center">
            <input type="file" id="cat-img" hidden onChange={handleImageChange} />
            <label htmlFor="cat-img" className="w-32 h-32 mx-auto border-2 border-dashed border-gray-100 rounded-[0.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:bg-orange-50 transition-all cursor-pointer overflow-hidden group">
               {image ? <img src={image} className="w-full h-full object-contain p-4" /> : <Upload />}
            </label>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Category Icon</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="e.g. Italian Pizza" className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold" />
          </div>

          <button disabled={loading} className="w-full bg-dark-100 text-white py-5 rounded-md font-black flex items-center justify-center gap-2 hover:bg-brand-primary transition-all shadow-xl disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} {isEdit ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;