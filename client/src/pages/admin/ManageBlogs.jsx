import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/blogs');
      setBlogs(res.data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this article?")) {
      await API.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(b => b._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase italic">Manage <span className="text-brand-primary">Blogs</span></h2>
        <Link to="/admin/blogs/add" className="bg-dark-100 text-white px-6 py-3 rounded-md font-bold hover:bg-brand-primary transition-all flex items-center gap-2">
          <Plus size={20}/> New Article
        </Link>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" /></div> : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-white p-6 rounded-[0.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-brand-primary transition-all">
              <div className="flex items-center gap-6">
                <img src={blog.image} className="w-20 h-20 rounded-md object-cover" alt="" />
                <div>
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-gray-400 text-xs uppercase font-black">{blog.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blogs/edit/${blog._id}`} className="p-3 bg-gray-50 rounded-md hover:bg-dark-100 hover:text-white transition-all"><Edit size={18}/></Link>
                <button onClick={() => handleDelete(blog._id)} className="p-3 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;