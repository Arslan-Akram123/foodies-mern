import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFoods } from '../../features/foodSlice';
import { getAllReviews } from '../../features/reviewSlice'; // Import reviews thunk
import HeroSlider from '../../components/user/HeroSlider';
import CategorySection from '../../components/user/CategorySection';
import FoodCard from '../../components/common/FoodCard';
import ReviewList from '../../components/user/ReviewList'; // Import Review Component
import { Loader2, MessageSquareHeart } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { foods, isLoading: foodsLoading } = useSelector((state) => state.foods);
  const { reviews, isLoading: reviewsLoading } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getFoods());
    dispatch(getAllReviews()); // Fetch reviews on mount
  }, [dispatch]);

  return (
    <>
    
      
        <HeroSlider />
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 space-y-24">
      <CategorySection />
      
      {/* 1. Popular Products Section */}
      <section>
        <div className="flex justify-between items-center mb-10 px-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-dark-100">
            Popular <span className="text-brand-primary">Dishes</span>
          </h2>
          {/* <button className="text-brand-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
            View All
          </button> */}
        </div>

        {foodsLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {foods.slice(0, 8).map(food => (
              <FoodCard key={food._id} item={food} />
            ))}
          </div>
        )}
      </section>

      {/* 2. CUSTOMER REVIEWS SECTION (NEW) */}
      {reviews.length > 0 && (
        <section className="pb-0">
          <div className="text-center space-y-4 mb-6">
             <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                <MessageSquareHeart size={14}/> Love from customers
             </div>
             <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
               What They <span className="text-brand-primary">Say About Us</span>
             </h2>
             <p className="text-gray-400 font-medium max-w-lg mx-auto">
               Don't just take our word for it. Here is what our community of foodies thinks.
             </p>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-primary" /></div>
          ) : (
            <ReviewList reviews={reviews.slice(0, 6)} />
          )}
        </section>
      )}
    </div>
    </>
  );
};

export default Home;