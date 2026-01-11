import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity, isLoading } = useSelector((state) => state.cart);

  const handleUpdateQty = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(cartActions.addToCart({ ...item, qty: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(cartActions.removeFromCart(id));
  };

  const goToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const goToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Sidebar Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-dark-100" />
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {totalQuantity} Item(s)
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.food} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-dark-100 leading-tight pr-4 uppercase text-sm">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => handleRemove(item.food)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-brand-primary font-black text-sm">Rs {item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-3 w-fit border border-gray-100 rounded-lg p-1">
                        <button 
                          onClick={() => handleUpdateQty(item, item.qty - 1)}
                          className="p-1 hover:text-brand-primary text-gray-400"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => handleUpdateQty(item, item.qty + 1)}
                          className="p-1 hover:text-brand-primary text-gray-400"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShoppingBag size={64} />
                  <p className="font-bold uppercase tracking-widest text-xs">Your bag is empty</p>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t bg-gray-50/50 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Excluding Shipping</span>
                <div className="flex justify-between items-end">
                  <span className="font-black text-dark-100 uppercase">Subtotal</span>
                  <span className="text-2xl font-black text-brand-primary">Rs {totalAmount}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  disabled={items.length === 0}
                  onClick={goToCheckout}
                  className="w-full bg-dark-100 text-white py-4 rounded-xl font-black uppercase tracking-[0.1em] hover:bg-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Checkout Now (Rs {totalAmount})
                </button>
                <button 
                  onClick={goToCart}
                  className="w-full bg-white border-2 border-dark-100 text-dark-100 py-4 rounded-xl font-black uppercase tracking-[0.1em] hover:bg-gray-50 transition-all"
                >
                  View Cart
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;