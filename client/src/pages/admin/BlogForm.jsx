import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Save, X, Upload, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { createBlogAction, updateBlogAction } from '../../features/blogSlice';
import API from '../../api/axios';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Food Trends',
    content: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { blogs } = useSelector((state) => state.blogs);

  // 1. If editing, pre-fill the form
  useEffect(() => {
    if (isEdit) {
      const blogToEdit = blogs.find((b) => b._id === id);
      if (blogToEdit) {
        setFormData(blogToEdit);
      } else {
        // Fallback: Fetch directly from API if not in state
        const fetchSingle = async () => {
           const res = await API.get(`/blogs/${id}`);
           setFormData(res.data);
        }
        fetchSingle();
      }
    }
  }, [id, isEdit, blogs]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = formData.image;

    try {
      // Step A: Upload image if a new one was picked
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);
        const uploadRes = await API.post('/upload', data);
        imageUrl = uploadRes.data.url;
      }

      // Step B: Save blog data
      const finalData = { ...formData, image: imageUrl };

      if (isEdit) {
        await dispatch(updateBlogAction({ id, blogData: finalData }));
      } else {
        await dispatch(createBlogAction(finalData));
      }

      navigate('/admin/blogs');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          {isEdit ? 'Edit' : 'Write'} <span className="text-brand-primary">Article</span>
        </h2>
        <button onClick={() => navigate('/admin/blogs')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={24}/></button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[0.5rem] shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Image Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Featured Image</label>
            <input type="file" id="blog-image" hidden onChange={handleImageChange} accept="image/*" />
            <label htmlFor="blog-image" className="w-full h-64 border-2 border-dashed border-gray-100 rounded-[0.5rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group hover:border-brand-primary">
               {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
               ) : (
                  <div className="text-center space-y-2">
                     <div className="w-16 h-16 bg-orange-50 rounded-md flex items-center justify-center text-brand-primary mx-auto group-hover:scale-110 transition-transform">
                        <ImageIcon size={30}/>
                     </div>
                     <p className="text-sm font-bold text-gray-400">Upload cover photo</p>
                  </div>
               )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Article Title</label>
              <input required name="title" value={formData.title} onChange={onChange} type="text" placeholder="e.g. 5 Secrets to a Perfect Pizza" className="w-full p-5 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-bold text-dark-100" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
              <select name="category" value={formData.category} onChange={onChange} className="w-full p-5 bg-gray-50 rounded-md border-none outline-none focus:ring-2 focus:ring-brand-primary font-black text-xs uppercase tracking-widest">
                 <option>Food Trends</option>
                 <option>Recipes</option>
                 <option>Healthy Eating</option>
                 <option>Company News</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Article Content</label>
            <textarea 
              required 
              name="content" 
              value={formData.content} 
              onChange={onChange} 
              rows="12" 
              placeholder="Write your story here..." 
              className="w-full p-8 bg-gray-50 rounded-[0.5rem] border-none outline-none focus:ring-2 focus:ring-brand-primary font-medium text-gray-700 leading-relaxed"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-brand-primary text-white py-5 rounded-md font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin"/> : <Save size={22}/>}
                {isEdit ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
             </button>
             <button type="button" onClick={() => navigate('/admin/blogs')} className="px-12 py-5 bg-gray-100 text-gray-500 font-bold rounded-md hover:bg-gray-200">
                Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;