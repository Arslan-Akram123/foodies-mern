import { Plus, Star, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get current cart items and auth status from Redux
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // 2. Check if this specific food item is already in the cart
  // Note: Backend stores the product ID in the 'food' field
  const existingItem = items.find((cartItem) => cartItem.food === item._id);

  const handleAddToCart = (e) => {
    // Prevent navigation to detail page if user clicks the button
    e.stopPropagation();

    if (!user) {
      alert("Please login to start ordering!");
      navigate('/auth/login');
      return;
    }

    // 3. Logic: If item exists, increment current qty, else start with 1
    const newQty = existingItem ? existingItem.qty + 1 : 1;

    dispatch(cartActions.addToCart({
      food: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      qty: newQty // Sends the absolute new quantity to the DB
    }));
  };

  return (
    <div className="bg-white rounded-[0.7rem] p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group relative">
      
      {/* Category Badge */}
      <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary border border-orange-100 shadow-sm">
        {item.category}
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden rounded-[0.5rem] mb-5">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full  object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-3 right-3 bg-dark-100/80 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold">
          <Star className="text-brand-secondary fill-brand-secondary" size={14}/> 
          {item.rating || '4.5'}
        </div>
      </div>

      {/* Content */}
      <div className="px-1">
        <h3 className="font-black text-xl text-dark-100 tracking-tight truncate uppercase italic">{item.name}</h3>
        <p className="text-gray-400 text-xs mt-1 font-medium line-clamp-2 leading-relaxed h-9">
          {item.description}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Price</span>
            <span className="text-2xl font-black text-brand-primary tracking-tighter">Rs {item.price.toFixed(2)}</span>
          </div>
          
          {/* 4. DYNAMIC BUTTON: Shows quantity if already in cart */}
          <button 
            onClick={handleAddToCart}
            className={`relative p-3 rounded-md transition-all cursor-pointer shadow-lg active:scale-90 flex items-center justify-center
              ${existingItem 
                ? 'bg-brand-primary text-white shadow-orange-200' 
                : 'bg-dark-100 text-white shadow-gray-200 hover:bg-brand-primary'
              }`}
          >
            {existingItem ? (
              <div className="flex items-center gap-2">
                <Plus size={16} strokeWidth={3} />
                <span className="font-black text-sm">{existingItem.qty}</span>
              </div>
            ) : (
              <Plus size={16} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;