import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveDeals } from '../../features/dealSlice';
import FoodCard from '../../components/common/FoodCard';
import { Loader2 } from 'lucide-react';

const Deals = () => {
  const dispatch = useDispatch();
  const { deals, isLoading } = useSelector(state => state.deals);

  useEffect(() => {
    dispatch(getActiveDeals());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
       <h1 className="text-4xl font-black italic mb-10">BEST <span className="text-brand-primary">DEALS</span></h1>
       {isLoading ? (
         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>
       ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
           {deals.map(deal => (
             <div key={deal._id} className="relative group">
                <div className="absolute top-5 left-5 z-20 bg-red-500 text-white px-4 py-1 rounded-xl font-black text-[10px] uppercase animate-pulse shadow-lg">HOT DEAL</div>
                {/* Note: Reuse FoodCard or make a specific DealCard */}
                <FoodCard item={{ ...deal, price: deal.dealPrice, description: deal.items }} />
             </div>
           ))}
         </div>
       )}
    </div>
  );
};
export default Deals;