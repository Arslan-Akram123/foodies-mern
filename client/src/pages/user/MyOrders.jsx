import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ChevronRight, Loader2, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../features/orderSlice';

const MyOrders = () => {
  const dispatch = useDispatch();
  
  // 1. Get real data from Redux Store
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // Dynamic Status Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'Cooking': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-orange-100 text-orange-600 border-orange-200'; // Pending
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">
          My <span className="text-brand-primary">Orders</span>
        </h1>
        <p className="text-gray-400 mt-2 font-bold text-xs uppercase tracking-[0.1em]">
          Review your delicious history and track live deliveries
        </p>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <Loader2 className="animate-spin text-brand-primary mb-4" size={40}/>
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Retrieving your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 md:p-6 rounded-[0.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-brand-primary transition-all relative overflow-hidden">
              
              {/* Left Section: Icon & ID */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-md flex items-center justify-center transition-colors ${order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-brand-primary'}`}>
                  {order.status === 'Delivered' ? <CheckCircle2 size={28}/> : <Package size={28} />}
                </div>
                <div>
                  <h3 className="font-black text-xl text-dark-100 tracking-tighter uppercase">
                    #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Middle Section: Items Summary & Price */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-500 text-sm font-medium mb-1 line-clamp-1 italic">
                  {order.orderItems.map(item => `${item.qty}x ${item.name}`).join(', ')}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Paid</span>
                   <p className="text-2xl font-black text-brand-primary tracking-tighter">Rs {order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Right Section: Status & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                <span className={`px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
                
                {/* VERTICAL ACTION BUTTONS */}
                <div className="flex flex-col gap-2 w-full sm:w-44">
                  <Link 
                    to={`/order-detail/${order._id}`} 
                    className="bg-gray-50 text-dark-100 px-6 py-3 rounded-md font-black text-[10px] uppercase tracking-widest text-center hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/track-order/${order._id}`} 
                    className="bg-dark-100 text-white px-6 py-3 rounded-md font-black text-[10px] uppercase tracking-widest text-center hover:bg-brand-primary transition-all shadow-xl shadow-orange-900/10"
                  >
                    Track Order
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-40 bg-white rounded-[0.5rem] border-2 border-dashed border-gray-100 px-10">
           <div className="w-28 h-28 bg-gray-50 rounded-[0.5rem] flex items-center justify-center mx-auto mb-8 text-gray-200">
              <ShoppingBag size={48} />
           </div>
           <h3 className="text-2xl font-black text-dark-100 uppercase tracking-tighter italic">No Orders Yet</h3>
           <p className="text-gray-400 text-sm mt-4 max-w-sm mx-auto font-medium leading-relaxed">
             Looks like you haven't discovered your favorite meal yet. Let's change that!
           </p>
           <Link 
            to="/menu"
            className="mt-10 inline-block bg-brand-primary text-white px-12 py-5 rounded-[0.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-orange-200 active:scale-95"
           >
             Start Exploring Menu
           </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;