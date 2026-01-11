import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Clock, Truck, Loader2, PackageCheck, Utensils, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useState } from 'react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Orders from Backend
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders'); // Admin route
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 2. Handle Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}`, { status: newStatus });
      // Refresh local state to show updated status
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Cooking': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            Customer <span className="text-brand-primary">Orders</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Manage incoming requests and delivery status
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-md shadow-sm border border-gray-100">
           <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest mr-3">Total Orders</span>
           <span className="text-xl font-black text-brand-primary">{orders.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
           <Loader2 className="text-brand-primary animate-spin mb-4" size={40}/>
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading incoming orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 md:p-8 rounded-[0.5rem] shadow-sm border border-gray-50 flex flex-col xl:flex-row items-center justify-between gap-8 hover:border-brand-primary transition-all group relative overflow-hidden">
              
              {/* Top accent line for "New" orders */}
              {order.status === 'Pending' && <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>}

              {/* Order Identity */}
              <div className="flex items-center gap-6 w-full xl:w-auto">
                <div className={`w-16 h-16 rounded-md flex items-center justify-center transition-colors ${order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-brand-primary'}`}>
                  {order.status === 'Cooking' ? <Utensils size={28}/> : order.status === 'Delivered' ? <PackageCheck size={28}/> : <Clock size={28}/>}
                </div>
                <div>
                  <h4 className="font-black text-xl text-dark-100 tracking-tighter">#{order._id.slice(-6).toUpperCase()}</h4>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{order.user?.name || 'Guest User'}</p>
                </div>
              </div>

              {/* Items & Address Summary */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-2">
                    <Utensils size={14} className="text-brand-primary mt-1 shrink-0"/>
                    <p className="text-sm font-medium text-gray-600 line-clamp-2">
                      {order.orderItems.map(item => `${item.qty}x ${item.name}`).join(', ')}
                    </p>
                 </div>
                 <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-brand-primary mt-1 shrink-0"/>
                    <p className="text-sm font-medium text-gray-400 line-clamp-1 italic">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                 </div>
              </div>

              {/* Price & Status Logic */}
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto justify-between border-t xl:border-t-0 pt-6 xl:pt-0">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Total Bill</p>
                  <p className="text-xl font-black text-dark-100">Rs {order.totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className={`px-4 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all ${getStatusStyle(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  
                  {/* View Details Link */}
                  <Link 
                    to={`/admin/orders/${order._id}`} 
                    title="View Full Order" 
                    className="p-3 bg-dark-100 text-white rounded-md hover:bg-brand-primary transition-all shadow-lg shadow-orange-900/10 active:scale-90"
                  >
                    <Eye size={20}/>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[0.5rem] border border-dashed border-gray-200">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={30} className="text-gray-300" />
           </div>
           <h3 className="text-xl font-black text-dark-100 uppercase tracking-tighter">No Active Orders</h3>
           <p className="text-gray-400 text-sm mt-2">Sit back and relax, new orders will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;