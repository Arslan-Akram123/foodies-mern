import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const res = await API.get('/banners');
      setBanners(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this banner from home page?")) {
      await API.delete(`/banners/${id}`);
      setBanners(banners.filter(b => b._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">Home <span className="text-brand-primary">Banners</span></h2>
        <Link to="/admin/banners/add" className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-md font-bold hover:scale-105 transition-all shadow-lg shadow-orange-200">
          <Plus size={20}/> Add New Banner
        </Link>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(banner => (
            <div key={banner._id} className="bg-white p-4 rounded-[0.5rem] border border-gray-100 shadow-sm group relative overflow-hidden">
              <div className="h-44 rounded-md overflow-hidden relative mb-4">
                <img src={banner.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${banner.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {banner.active ? 'Visible' : 'Hidden'}
                </div>
              </div>
              <div className="flex justify-between items-center px-2 pb-2">
                <div>
                  <h3 className="font-black text-dark-100">{banner.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase">{banner.discountTag || 'Promo Banner'}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/banners/edit/${banner._id}`} className="p-3 bg-gray-50 text-gray-500 rounded-md hover:bg-dark-100 hover:text-white transition-all"><Edit size={18}/></Link>
                  <button onClick={() => handleDelete(banner._id)} className="p-3 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBanners;