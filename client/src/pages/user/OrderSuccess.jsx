import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center"
        >
          <CheckCircle size={50} />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-dark-100">ORDER PLACED!</h1>
          <p className="text-gray-500 font-medium">Your delicious meal is being prepared. Order ID: <span className="text-brand-primary font-bold">#ORD-9921</span></p>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
          <div className="flex justify-between text-sm font-bold text-gray-400"><span>Estimated Delivery</span><span className="text-dark-100">25-30 Mins</span></div>
          <div className="flex justify-between text-sm font-bold text-gray-400"><span>Payment Method</span><span className="text-dark-100">Cash on Delivery</span></div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/track-order/ORD-9921" className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            Track Your Order <ArrowRight size={20}/>
          </Link>
          <Link to="/menu" className="w-full text-gray-400 font-bold hover:text-dark-100 flex items-center justify-center gap-2 py-2">
            <ShoppingBag size={18}/> Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;