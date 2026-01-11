import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../features/orderSlice';
import { clearCartLocal } from '../../features/cartSlice';
import { getShippingConfig } from '../../features/shippingSlice';
import { MapPin, Phone, Truck, ShieldCheck, CreditCard } from 'lucide-react';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { config } = useSelector((state) => state.shipping);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    dispatch(getShippingConfig());
  }, [dispatch]);

  // --- DYNAMIC SHIPPING CALCULATION LOGIC ---
  const calculateShipping = () => {
    if (!config) return 0;

    // 1. Check Threshold (e.g. Free if above $2000)
    if (config.thresholdEnabled && totalAmount >= config.thresholdAmount) {
      return 0;
    }

    // 2. Check Delivery Mode
    if (config.type === 'free') return 0;
    if (config.type === 'standard') return config.standardPrice; // usually 250
    if (config.type === 'custom') return config.customPrice;

    return 0;
  };

  const deliveryFee = calculateShipping();
  const finalTotal = totalAmount + deliveryFee;

  const handlePlaceOrder = () => {
    if (!address || !city || !phone) return alert("Please fill all delivery details");

    const orderData = {
      orderItems: items.map(i => ({ name: i.name, qty: i.qty, image: i.image, price: i.price, food: i.food })),
      shippingAddress: { address, city, phone },
      shippingPrice: deliveryFee,
      totalPrice: finalTotal,
      paymentMethod: "Cash on Delivery"
    };

    dispatch(createOrder(orderData)).then((res) => {
      if (!res.error) {
        dispatch(clearCartLocal());
        navigate('/order-success');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8 lg:col-span-2 ">
        <h2 className="text-3xl font-black uppercase tracking-tight italic">Checkout <span className="text-brand-primary">Details</span></h2>
        
        <div className="space-y-4">
           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Location</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House # / Street" className="w-full p-4 bg-white border border-gray-100 rounded-md outline-none focus:ring-2 focus:ring-brand-primary" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full p-4 bg-white border border-gray-100 rounded-md outline-none focus:ring-2 focus:ring-brand-primary" />
           </div>
           <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full p-4 bg-white border border-gray-100 rounded-md outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>

        <div className="p-6 bg-orange-50 rounded-md border border-orange-100 flex items-center gap-4">
           <Truck className="text-brand-primary" />
           <p className="text-sm font-bold text-dark-100">
             {deliveryFee === 0 ? `Free delivery applied. because your order is above Rs ${config?.thresholdAmount}.` : `Standard delivery charges of Rs ${deliveryFee} applied.`}
           </p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-dark-100 p-10 rounded-md text-white h-fit sticky top-24 shadow-2xl">
         <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><ShieldCheck className="text-brand-primary"/> Order Summary</h3>
         <div className="space-y-4 border-b border-gray-800 pb-8 mb-8">
            <div className="flex justify-between text-gray-400 font-bold uppercase text-xs tracking-widest">
               <span>Subtotal</span><span>Rs {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-bold uppercase text-xs tracking-widest">
               <span>Delivery Fee</span>
               <span className={deliveryFee === 0 ? 'text-green-400' : ''}>{deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee.toFixed(2)}`}</span>
            </div>
         </div>
         <div className="flex justify-between items-center mb-5">
            <span className="text-md font-bold">Total Amount</span>
            <span className="text-xl font-black text-brand-primary tracking-tighter">Rs {finalTotal.toFixed(2)}</span>
         </div>
         <button onClick={handlePlaceOrder} className="w-full bg-brand-primary text-white py-3 rounded-md font-black text-md hover:scale-[1.02] transition-transform shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 uppercase tracking-tighter">
            Confirm & Place Order
         </button>
      </div>
    </div>
  );
};

export default Checkout;