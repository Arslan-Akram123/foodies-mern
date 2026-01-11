import { useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFoods, deleteFoodAction, resetFood } from '../../features/foodSlice';

const ManageFoods = () => {
  const dispatch = useDispatch();
  const { foods, isLoading, isError, message } = useSelector((state) => state.foods);

  useEffect(() => {
    dispatch(getFoods());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This will permanently delete the food item.")) {
      dispatch(deleteFoodAction(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">Food <span className="text-brand-primary">Inventory</span></h2>
        <Link to="/admin/foods/add" className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-md font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
          <Plus size={20}/> Add New Food
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>
      ) : (
        <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="p-6">Item</th>
                <th className="p-6">Category</th>
                <th className="p-6">Price</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 flex items-center gap-4">
                    <img src={food.image} className="w-12 h-12 rounded-md object-cover border border-gray-100" alt="" />
                    <span className="font-black text-dark-100">{food.name}</span>
                  </td>
                  <td className="p-6 text-gray-500 font-bold text-sm uppercase">{food.category}</td>
                  <td className="p-6 font-black text-brand-primary text-lg">Rs {food.price.toFixed(2)}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${food.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {food.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/foods/edit/${food._id}`} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-md transition-all"><Edit size={18}/></Link>
                      <button onClick={() => handleDelete(food._id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;