import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, User, Package, Printer, Loader2, CheckCircle2, Clock, Mail } from 'lucide-react';
import API from '../../api/axios';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Order Data from Backend
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        // navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // 2. Handle Status Update
  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await API.put(`/orders/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // 3. Print Functionality
  const handlePrint = () => {
    window.print();
  };

  // 4. Google Maps Link Generator
  const openInMaps = () => {
    const address = `${order.shippingAddress.address}, ${order.shippingAddress.city}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Transaction...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0">
      
      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <button 
            onClick={() => navigate('/admin/orders')} 
            className="flex items-center gap-2 text-gray-400 hover:text-brand-primary font-bold mb-2 transition-colors"
          >
            <ChevronLeft size={20}/> Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black tracking-tight text-dark-100 uppercase italic">
              Order <span className="text-brand-primary">#{order._id.slice(-8).toUpperCase()}</span>
            </h2>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-orange-100 text-orange-600 border-orange-200'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-md font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer size={18}/> Print Invoice
          </button>
          
          <div className="relative flex-1 md:flex-none">
            {updating && <Loader2 className="absolute right-3 top-3 animate-spin text-white" size={16}/>}
            <select 
              disabled={updating}
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full bg-dark-100 text-white px-8 py-3.5 rounded-md font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:bg-brand-primary transition-all appearance-none shadow-xl shadow-orange-900/10"
            >
               <option value="Pending">Pending</option>
               <option value="Cooking">Cooking</option>
               <option value="Out for Delivery">Out for Delivery</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: ORDER ITEMS --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Package size={20} className="text-brand-primary"/> Items Summary
              </h3>
              <span className="text-[10px] font-black bg-white px-3 py-1 rounded-md border border-gray-100">{order.orderItems.length} Products</span>
            </div>

            <div className="p-8 space-y-8">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-[0.5rem] overflow-hidden border border-gray-100 shadow-inner">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-dark-100 uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-1">
                        Price: Rs {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quantity</p>
                    <p className="text-xl font-black text-dark-100">x{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="p-10 bg-dark-100 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
               <div className="space-y-1 text-center sm:text-left">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Subtotal: Rs {(order.totalPrice - order.shippingPrice).toFixed(2)}</p>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Delivery: Rs {order.shippingPrice.toFixed(2)}</p>
               </div>
               <div className="text-center sm:text-right">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-1">Grand Total</p>
                  <h2 className="text-5xl font-black text-white tracking-tighter">Rs {order.totalPrice.toFixed(2)}</h2>
               </div>
            </div>
          </div>
          
          {/* Internal Log / Note */}
          <div className="bg-orange-50 p-6 rounded-[0.5rem] border border-orange-100 flex items-center gap-4 print:hidden">
             <Clock className="text-brand-primary" />
             <p className="text-xs font-bold text-dark-100 italic">
               Order was placed on {new Date(order.createdAt).toLocaleString()} via {order.paymentMethod}.
             </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: CUSTOMER & SHIPPING --- */}
        <div className="space-y-8">
          
          {/* Customer Card */}
          <div className="bg-white p-8 rounded-[0.5rem] shadow-sm border border-gray-100 space-y-6">
             <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 border-b pb-4">Customer Details</h3>
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-orange-100 rounded-md flex items-center justify-center text-brand-primary shadow-inner">
                 <User size={24}/>
               </div>
               <div>
                 <p className="font-black text-lg text-dark-100 uppercase tracking-tighter">{order.user?.name}</p>
                 <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                    <Mail size={12}/>
                    <p className="text-[10px] font-bold">{order.user?.email}</p>
                 </div>
               </div>
             </div>
             
             <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-md">
               <div className="bg-white p-2 rounded-md text-brand-primary shadow-sm"><Phone size={18}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Direct Call</p>
                  <a href={`tel:${order.shippingAddress.phone}`} className="font-black text-dark-100 hover:text-brand-primary transition-colors">
                    {order.shippingAddress.phone}
                  </a>
               </div>
             </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white p-8 rounded-[0.5rem] shadow-sm border border-gray-100 space-y-6">
             <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Shipping Address</h3>
                <MapPin size={18} className="text-brand-primary"/>
             </div>
             <div className="space-y-2">
                <p className="text-dark-100 font-bold text-lg uppercase tracking-tighter">{order.shippingAddress.city}</p>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {order.shippingAddress.address}
                </p>
             </div>
             <button 
               onClick={openInMaps}
               className="w-full py-4 bg-gray-50 rounded-[0.5rem] font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-orange-50 hover:text-brand-primary transition-all border border-transparent hover:border-orange-100 shadow-sm"
             >
                Navigate with Google Maps
             </button>
          </div>
          
          {/* Security / Verification Badge */}
          <div className="p-8 bg-green-50 rounded-[0.5rem] border border-green-100 flex items-center gap-4 print:hidden">
             <CheckCircle2 className="text-green-500" size={30}/>
             <div>
                <p className="font-black text-green-700 text-xs uppercase tracking-tighter">Verified Transaction</p>
                <p className="text-[10px] text-green-600 font-medium">Payment Method: {order.paymentMethod}</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;