import { useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, Tag, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveDeals } from '../../features/dealSlice';
import API from '../../api/axios';

const ManageDeals = () => {
  const dispatch = useDispatch();
  const { deals, isLoading } = useSelector((state) => state.deals);

  // 1. Load deals from Redux on mount
  useEffect(() => {
    dispatch(getActiveDeals());
  }, [dispatch]);

  // 2. Optimized Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this combo deal?")) {
      try {
        await API.delete(`/deals/${id}`);
        // Refresh the list after deletion
        dispatch(getActiveDeals());
      } catch (err) {
        alert("Failed to delete deal: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            Promotional <span className="text-brand-primary">Deals</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Manage your combo offers and seasonal discounts
          </p>
        </div>
        <Link 
          to="/admin/deals/add" 
          className="flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-md font-black shadow-xl shadow-orange-200 hover:scale-105 transition-all uppercase text-xs tracking-widest"
        >
          <Plus size={18} strokeWidth={3}/> Create New Deal
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <Loader2 className="animate-spin text-brand-primary mb-4" size={40}/>
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Updating Deal List...</p>
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div key={deal._id} className="bg-white rounded-[0.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-primary transition-all flex flex-col">
              
              {/* Deal Image with Status Overlay */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={deal.image} 
                  alt={deal.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg ${
                  deal.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {deal.active ? <CheckCircle2 size={12}/> : <EyeOff size={12}/>}
                  {deal.active ? 'Live' : 'Hidden'}
                </div>

                <div className="absolute bottom-4 left-6">
                   <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none">{deal.name}</h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex items-start gap-2 mb-4">
                    <Tag size={14} className="text-brand-primary mt-1 shrink-0"/>
                    <p className="text-gray-500 text-sm font-medium line-clamp-2 italic leading-relaxed">
                      {deal.items}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-gray-50">
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-brand-primary">Rs {deal.dealPrice.toFixed(2)}</span>
                        {deal.originalPrice && (
                          <span className="text-sm font-bold text-gray-300 line-through">Rs {deal.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <Link 
                        to={`/admin/deals/edit/${deal._id}`} 
                        className="p-3 bg-gray-50 text-gray-500 hover:bg-dark-100 hover:text-white rounded-md transition-all shadow-sm active:scale-90"
                      >
                        <Edit size={18}/>
                      </Link>
                      <button 
                        onClick={() => handleDelete(deal._id)} 
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                      >
                        <Trash2 size={18}/>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[0.5rem] border-2 border-dashed border-gray-100 px-10">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
              <Tag size={40} />
           </div>
           <h3 className="text-2xl font-black text-dark-100 uppercase tracking-tighter">No Deals Published</h3>
           <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto font-medium">Your combo offers and discounts will appear here once created.</p>
           <Link 
              to="/admin/deals/add"
              className="mt-8 inline-block bg-dark-100 text-white px-10 py-4 rounded-md font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl"
           >
             Start Your First Deal
           </Link>
        </div>
      )}
    </div>
  );
};

export default ManageDeals;