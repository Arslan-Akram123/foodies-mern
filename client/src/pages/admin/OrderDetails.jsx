import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Phone, User, Package, 
  Printer, Loader2, CheckCircle2, Clock, Mail, 
  CreditCard, Hash, Calendar, ExternalLink 
} from 'lucide-react';
import API from '../../api/axios';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Live Data from MongoDB
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // 2. Handle Order Lifecycle Status Update
  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      // Toast/Alert notification
    } catch (err) {
      alert("Failed to update system status.");
    } finally {
      setUpdating(false);
    }
  };

  // 3. Google Maps Integration Logic
  const openInMaps = () => {
    const address = `${order.shippingAddress.address}, ${order.shippingAddress.city}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={50} />
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Secure Transaction...</p>
      </div>
    );
  }

  if (!order) return (
    <div className="text-center py-20">
      <h3 className="font-black text-dark-100 uppercase italic">Order Record Not Found</h3>
      <button onClick={() => navigate('/admin/orders')} className="text-brand-primary font-bold mt-4">Return to Logs</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 print:p-0 print:bg-white">
      
      {/* --- ADMINISTRATIVE HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 print:hidden">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/admin/orders')} 
            className="flex items-center gap-2 text-gray-400 hover:text-brand-primary font-black text-[10px] uppercase tracking-widest transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Central Logs
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter text-dark-100 uppercase italic leading-none">
              Invoice <span className="text-brand-primary">#{order._id.slice(-8).toUpperCase()}</span>
            </h2>
            <span className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-md font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-dark-100 hover:text-white transition-all shadow-sm"
          >
            <Printer size={18}/> Export Invoice
          </button>
          
          <div className="relative flex-1 lg:flex-none">
            {updating && <div className="absolute -left-8 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin text-brand-primary" size={20}/></div>}
            <select 
              disabled={updating}
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full bg-brand-primary text-white px-8 py-4 rounded-md font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:scale-[1.02] active:scale-95 transition-all appearance-none shadow-xl shadow-orange-900/10"
            >
               <option value="Pending">Pending Approval</option>
               <option value="Cooking">In Kitchen</option>
               <option value="Out for Delivery">Courier Assigned</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- LEFT: ITEMS & BILLING SUMMARY --- */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3">
                <Package size={18} className="text-brand-primary"/> Items Manifest
              </h3>
              <div className="flex gap-2">
                 <span className="bg-white px-3 py-1 rounded-md border border-gray-100 text-[10px] font-black uppercase tracking-tighter shadow-inner">{order.orderItems.length} Products</span>
                 <span className="bg-orange-50 text-brand-primary px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="p-10 space-y-10">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between group gap-6">
                  <div className="flex items-center gap-8 w-full sm:w-auto">
                    <div className="w-24 h-24 bg-gray-50 rounded-[0.5rem] overflow-hidden border-4 border-white shadow-inner shrink-0">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                    </div>
                    <div>
                      <p className="font-black text-xl text-dark-100 uppercase tracking-tight italic">{item.name}</p>
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mt-1 bg-orange-50 w-fit px-2 py-0.5 rounded">
                        Unit: Rs {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Qty</p>
                       <p className="text-xl font-black text-dark-100">×{item.qty}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Subtotal</p>
                       <p className="text-xl font-black text-dark-100">Rs {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FINANCIAL FOOTER */}
            <div className="p-12 bg-dark-100 text-white flex flex-col sm:flex-row justify-between items-center gap-10">
               <div className="space-y-3 text-center sm:text-left w-full sm:w-auto">
                  <div className="flex justify-between sm:gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Menu Subtotal:</span> <span>Rs {(order.totalPrice - order.shippingPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between sm:gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Delivery Fee:</span> <span className="text-green-400">Rs {order.shippingPrice.toFixed(2)}</span>
                  </div>
               </div>
               <div className="text-center sm:text-right">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-1">Total Bill Paid</p>
                  <h2 className="text-6xl font-black text-white tracking-tighter leading-none">Rs {order.totalPrice.toFixed(2)}</h2>
               </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-8 rounded-[0.5rem] border border-orange-100 flex items-start gap-5 print:hidden">
             <div className="p-3 bg-white rounded-md shadow-sm text-brand-primary"><Clock size={20}/></div>
             <p className="text-sm font-bold text-dark-100 italic leading-relaxed">
               System Log: Order record established on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}. <br/>
               Processing authorized via <span className="uppercase text-brand-primary">{order.paymentMethod}</span> gateway.
             </p>
          </div>
        </div>

        {/* --- RIGHT: CUSTOMER PROFILE & LOGISTICS --- */}
        <div className="space-y-8">
          
          {/* USER IDENTITY CARD */}
          <div className="bg-white p-10 rounded-[0.5rem] shadow-sm border border-gray-100 space-y-8">
             <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-300 border-b border-gray-50 pb-4">Customer Profile</h3>
             <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-orange-100 rounded-[0.5rem] flex items-center justify-center text-brand-primary shadow-inner border-2 border-white">
                 <User size={28}/>
               </div>
               <div>
                 <p className="font-black text-xl text-dark-100 uppercase tracking-tighter">{order.user?.name}</p>
                 <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <Mail size={12}/>
                    <p className="text-[10px] font-bold truncate">{order.user?.email}</p>
                 </div>
               </div>
             </div>
             
             <div className="bg-gray-50 p-6 rounded-[0.5rem] flex items-center gap-6 group hover:bg-orange-50 transition-colors">
               <div className="bg-white p-3 rounded-md text-brand-primary shadow-md group-hover:scale-110 transition-transform"><Phone size={20}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Verified Contact</p>
                  <a href={`tel:${order.shippingAddress.phone}`} className="font-black text-xl text-dark-100 hover:text-brand-primary transition-colors">
                    {order.shippingAddress.phone}
                  </a>
               </div>
             </div>
          </div>

          {/* LOGISTICS CARD */}
          <div className="bg-white p-10 rounded-[0.5rem] shadow-sm border border-gray-100 space-y-8">
             <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-300">Delivery Logistics</h3>
                <MapPin size={20} className="text-brand-primary"/>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-dark-100 font-black text-xs uppercase tracking-widest">Target City</p>
                  <p className="text-brand-primary font-black text-2xl uppercase italic tracking-tighter">{order.shippingAddress.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-dark-100 font-black text-xs uppercase tracking-widest">Full Street Address</p>
                  <p className="text-gray-500 font-bold leading-relaxed">
                    {order.shippingAddress.address}
                  </p>
                </div>
             </div>
             <button 
               onClick={openInMaps}
               className="w-full py-5 bg-dark-100 rounded-[0.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-900/10 active:scale-95"
             >
                <ExternalLink size={16}/> GPS Navigation
             </button>
          </div>
          
          {/* VERIFICATION BADGE */}
          <div className="p-8 bg-green-50 rounded-[0.5rem] border-2 border-dashed border-green-100 flex items-center gap-5 print:hidden">
             <div className="p-3 bg-white rounded-md shadow-md text-green-500"><CheckCircle2 size={24} strokeWidth={3}/></div>
             <div>
                <p className="font-black text-green-800 text-xs uppercase tracking-widest">Payment Success</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">{order.paymentMethod}</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;