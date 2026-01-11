import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Printer, MapPin, Package, CreditCard, 
  Star, X, Send, CheckCircle2, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Order Data from Backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        // navigate('/my-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseReview = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setRating(0);
    setComment("");
  };

  // 2. Submit Real Review to Backend
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a star rating");
    
    setSubmitting(true);
    try {
      await API.post('/reviews', {
        food: selectedItem.food, // The ID of the food item from orderItems
        foodName: selectedItem.name,
        rating,
        comment
      });
      alert(`Feedback submitted for ${selectedItem.name}!`);
      handleCloseReview();
    } catch (err) {
      alert("Failed to submit review. You might have already reviewed this item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Generating Receipt...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/my-orders')} 
          className="flex items-center gap-2 text-gray-400 hover:text-brand-primary font-bold transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-orange-50 transition-colors">
            <ChevronLeft size={20}/>
          </div>
          Back to My Orders
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 text-brand-primary font-bold hover:underline decoration-2 underline-offset-4"
        >
          <Printer size={18}/> Print Receipt
        </button>
      </div>

      <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden print:border-0 print:shadow-none">
        
        {/* Top Section */}
        <div className="p-8 md:p-12 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-6 border-b">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Transaction</p>
              <h1 className="text-3xl font-black text-dark-100 tracking-tighter">#{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-gray-500 font-bold mt-1 text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
           </div>
           <div className="text-left md:text-right flex flex-col md:items-end justify-center">
              <span className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {order.status === 'Delivered' && <CheckCircle2 size={14}/>}
                {order.status}
              </span>
           </div>
        </div>

        {/* Items List */}
        <div className="p-8 md:p-12 space-y-8">
           <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter italic">
             <Package className="text-brand-primary" size={24}/> Order <span className="text-brand-primary">Summary</span>
           </h3>
           
           <div className="space-y-6">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row justify-between items-center py-6 border-b border-gray-300 last:border-0 gap-6">
                   <div className="flex items-center gap-5 w-full sm:w-auto">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-gray-100 shadow-sm" />
                      <div>
                        <p className="font-black text-dark-100">{item.name}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty: {item.qty} × Rs {item.price.toFixed(2)}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {order.status === 'Delivered' && (
                        <button 
                          onClick={() => handleOpenReview(item)}
                          className="flex items-center gap-2 bg-orange-50 text-brand-primary px-5 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest border border-orange-100 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                        >
                          <Star size={14} fill="currentColor"/> Rate Food
                        </button>
                      )}
                      <p className="font-black text-dark-100 text-lg">Rs {(item.price * item.qty).toFixed(2)}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Address & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 bg-gray-50/30">
           <div className="space-y-4">
              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={14} className="text-brand-primary"/> Delivery Address
              </h4>
              <p className="font-bold text-dark-100 leading-relaxed text-sm">
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </p>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <CreditCard size={14} className="text-brand-primary"/> Payment Method
              </h4>
              <p className="font-bold text-dark-100 text-sm">{order.paymentMethod}</p>
           </div>
        </div>

        {/* Summary Footer */}
        <div className="p-8 md:p-12 bg-dark-100 text-white flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-2 text-center md:text-left">
              <div className="flex justify-between md:justify-start md:gap-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <span>Subtotal</span><span>Rs {(order.totalPrice - order.shippingPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between md:justify-start md:gap-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <span>Delivery</span>
                <span className={order.shippingPrice === 0 ? "text-green-400" : ""}>
                  {order.shippingPrice === 0 ? "FREE" : `Rs ${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
           </div>
           <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-1">Total Amount Paid</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">Rs {order.totalPrice.toFixed(2)}</h2>
           </div>
        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseReview}
              className="absolute inset-0 bg-dark-100/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[0.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
            >
              <button onClick={handleCloseReview} className="absolute top-8 right-8 p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>

              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black italic">RATE THIS <span className="text-brand-primary">MEAL</span></h3>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Reviewing: {selectedItem?.name}</p>
                </div>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star size={42} className={`transition-all duration-300 Rs{(hover || rating) >= star ? 'text-brand-secondary fill-brand-secondary' : 'text-gray-100'}`} />
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <textarea 
                    required rows="4" value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the taste? Was it fresh?..."
                    className="w-full p-6 bg-gray-50 rounded-[0.5rem] border-none focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
                  ></textarea>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-primary text-white py-5 rounded-md font-black flex items-center justify-center gap-3 shadow-xl shadow-orange-100 hover:scale-[1.02] transition-transform text-lg disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin"/> : <Send size={20}/>} 
                    {submitting ? 'SENDING...' : 'SUBMIT FEEDBACK'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetail;