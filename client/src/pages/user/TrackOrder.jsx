import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, MapPin, Phone, Clock, User, Loader2, ChevronLeft } from 'lucide-react';
import API from '../../api/axios';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real-time Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order tracking failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Professional touch: Refresh status every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Connecting to Kitchen...</p>
      </div>
    );
  }

  if (!order) return <div className="text-center py-20">Order not found.</div>;

  // 2. Map Backend Status to Stepper Logic
  const statusSteps = [
    { name: 'Order Placed', status: 'Pending' },
    { name: 'Cooking', status: 'Cooking' },
    { name: 'Out for Delivery', status: 'Out for Delivery' },
    { name: 'Delivered', status: 'Delivered' },
  ];

  // Helper to check if a step is completed
  const currentStatusIndex = statusSteps.findIndex(s => s.status === order.status);
  
  const getStepStatus = (index) => {
    if (index <= currentStatusIndex) return 'done';
    if (index === currentStatusIndex + 1) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-brand-primary transition-colors">
              <ChevronLeft size={16}/> Back to History
           </button>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">
             Live Tracking <span className="text-brand-primary">#{order?._id?.slice(-6)?.toUpperCase()}</span>
           </h1>
           <p className="text-gray-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
             <Clock size={14} className="text-brand-primary"/> 
             Status: <span className="text-dark-100">{order.status}</span>
           </p>
        </div>

        {/* Dynamic Action Button */}
        {order.status === 'Out for Delivery' && (
          <button className="flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-[0.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-green-200 animate-bounce">
            <Phone size={18}/> Contact Rider
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: DYNAMIC PROGRESS STEPPER */}
        <div className="lg:col-span-1 bg-white p-10 md:p-14 rounded-[0.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="absolute left-[3.4rem] md:left-[4.4rem] top-24 bottom-24 w-1 bg-gray-100"></div> {/* Connecting Line */}
           
           <div className="space-y-14 relative z-10">
              {statusSteps.map((step, index) => {
                const state = getStepStatus(index);
                return (
                  <div key={index} className="flex items-center gap-8">
                    <div className={`w-12 h-12 rounded-md flex items-center justify-center transition-all duration-500 border-4 border-white shadow-lg ${
                      state === 'done' ? 'bg-brand-primary text-white' : 
                      state === 'active' ? 'bg-orange-100 text-brand-primary animate-pulse' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {state === 'done' ? <Check size={24} strokeWidth={4}/> : <div className={`w-2 h-2 rounded-full ${state === 'active' ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>}
                    </div>
                    <div>
                      <p className={`font-black text-sm uppercase tracking-widest ${state === 'pending' ? 'text-gray-400' : 'text-dark-100'}`}>
                        {step.name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                        {state === 'done' ? 'Completed' : state === 'active' ? 'In Progress' : 'Waiting...'}
                      </p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* RIGHT: LIVE MAP & RIDER INFO */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Visual Map Area */}
           <div className="h-[450px] bg-gray-100 rounded-[0.5rem] overflow-hidden relative border-8 border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200" 
                className="w-full h-full object-cover opacity-50 grayscale" 
                alt="delivery map" 
              />
              
              {/* Dynamic Map Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <div className="relative">
                    <div className="w-16 h-16 bg-brand-primary rounded-full animate-ping absolute opacity-30"></div>
                    <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white relative z-10 border-4 border-white shadow-xl">
                       <MapPin size={30} fill="currentColor"/>
                    </div>
                    <div className="mt-4 bg-dark-100 text-white px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg">
                       Courier is here
                    </div>
                 </div>
              </div>
           </div>

           {/* Courier Details Card */}
           {/* <div className="bg-dark-100 p-8 md:p-10 rounded-[0.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-900/20">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 shadow-inner">
                    <User size={40} className="text-gray-500"/>
                 </div>
                 <div className="text-center sm:text-left">
                    <h4 className="font-black text-xl tracking-tight uppercase">Courier Assigned</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Delivery in progress</p>
                 </div>
              </div>
              
              <div className="flex gap-10 border-t sm:border-t-0 sm:border-l border-gray-800 pt-8 sm:pt-0 sm:pl-10 w-full sm:w-auto justify-around">
                 <div className="text-center sm:text-left">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Time Left</p>
                    <p className="font-black text-brand-primary text-lg tracking-tighter">~ 15 MINS</p>
                 </div>
                 <div className="text-center sm:text-left">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Method</p>
                    <p className="font-black text-white text-lg tracking-tighter uppercase">{order?.paymentMethod?.split(' ')[0]}</p>
                 </div>
              </div>
           </div> */}
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;