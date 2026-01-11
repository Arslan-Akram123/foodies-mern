import { useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../features/categorySlice';
import API from '../../api/axios';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete category? This will affect your menu filters.")) {
      try {
        await API.delete(`/categories/${id}`);
        dispatch(getCategories()); // Refresh list
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">Product <span className="text-brand-primary">Categories</span></h2>
        <Link to="/admin/categories/add" className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-md font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
          <Plus size={20}/> Add Category
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-[0.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-primary transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-dark-100 uppercase tracking-tighter">{cat.name}</h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Category</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link to={`/admin/categories/edit/${cat._id}`} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-md transition-all"><Edit size={18}/></Link>
                <button onClick={() => handleDelete(cat._id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;