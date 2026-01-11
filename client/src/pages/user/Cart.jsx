import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../features/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, totalAmount, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // --- HANDLERS ---

  const handleIncrease = (item) => {
    // Send the full object with incremented quantity
    dispatch(cartActions.addToCart({
      food: item.food, // This is the Product ID from DB
      name: item.name,
      image: item.image,
      price: item.price,
      qty: item.qty + 1 // Tell backend the new total quantity
    }));
  };

  const handleDecrease = (item) => {
    if (item.qty > 1) {
      dispatch(cartActions.addToCart({
        food: item.food,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty - 1
      }));
    } else {
      handleDelete(item.food);
    }
  };

  const handleDelete = (foodId) => {
    if (window.confirm("Remove this item from cart?")) {
      dispatch(cartActions.removeFromCart(foodId));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={60} className="text-gray-200" />
        </div>
        <h2 className="text-3xl font-black text-dark-100 uppercase tracking-tight italic">Your cart is empty</h2>
        <p className="text-gray-400 mt-2 font-medium">Looks like you haven't added anything yet!</p>
        <Link to="/menu" className="mt-8 bg-brand-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:scale-105 transition-all uppercase text-xs tracking-widest">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Shopping <span className="text-brand-primary">Cart</span></h1>
        <div className="h-1 flex-1 bg-gray-100 hidden md:block"></div>
        <span className="bg-orange-50 text-brand-primary px-4 py-1 rounded-full font-black text-xs uppercase">{items.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.food} className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-[0.5rem] shadow-sm border border-gray-100 hover:border-brand-primary transition-all relative overflow-hidden">
              
              <img src={item.image} alt={item.name} className="w-16 h-16 md:w-24 md:h-24 rounded-[0.5rem] object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
              
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="font-black text-xl text-dark-100 uppercase tracking-tighter">{item.name}</h3>
                <p className="text-brand-primary font-black text-lg">Rs {item.price.toFixed(2)}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-0 bg-gray-50 p-2 px-4 rounded-md border border-gray-100">
                <button 
                  onClick={() => handleDecrease(item)}
                  // disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-brand-primary disabled:opacity-50 transition-colors"
                >
                  <Minus size={20} strokeWidth={3}/>
                </button>
                <span className="font-black text-lg w-6 text-center text-dark-100">{item.qty}</span>
                <button 
                  onClick={() => handleIncrease(item)}
                  // disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-brand-primary disabled:opacity-50 transition-colors"
                >
                  <Plus size={20} strokeWidth={3}/>
                </button>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Subtotal</p>
                   <p className="font-black text-dark-100">Rs {(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.food)}
                  // disabled={isLoading}
                  className="p-3 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Trash2 size={20}/>
                </button>
              </div>

              {/* Loading Spinner for individual items */}
              {/* {isLoading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                   <Loader2 className="animate-spin text-brand-primary" />
                </div>
              )} */}
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-100 p-10 rounded-[0.5rem] text-white shadow-2xl sticky top-24">
            <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Order <span className="text-brand-primary">Summary</span></h3>
            
            <div className="space-y-5 border-b border-gray-800 pb-8 mb-8">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-black uppercase tracking-widest">Bag Subtotal</span>
                <span className="font-bold text-white text-lg">Rs {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-black uppercase tracking-widest">Delivery Fee</span>
                <span className="text-orange-400 font-bold ">Calc at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <span className="text-sm font-black uppercase tracking-[0.1em] text-gray-400">Total Payable</span>
              <span className="text-lg font-black text-brand-primary tracking-tighter">Rs {totalAmount.toFixed(2)}</span>
            </div>

            <Link 
              to="/checkout" 
              className="group flex items-center justify-center gap-3 w-full bg-brand-primary text-white py-4 rounded-md font-black text-sm uppercase tracking-[0.1em] hover:scale-[1.02] transition-all shadow-xl shadow-orange-900/20 active:scale-95"
            >
              Go To Checkout
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-[10px] text-gray-500 font-bold uppercase text-center mt-6 tracking-widest">
              Secure Checkout • Fast Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;