import { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare, Loader2, Utensils, User, Calendar } from 'lucide-react';
import API from '../../api/axios';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all reviews from Backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reviews'); // Admin protected route
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Handle Delete logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this customer review?")) {
      try {
        await API.delete(`/reviews/${id}`);
        // Filter out the deleted review from UI immediately
        setReviews(reviews.filter(rev => rev._id !== id));
      } catch (err) {
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            Customer <span className="text-brand-primary">Feedback</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Moderate user reviews and ratings for your dishes
          </p>
        </div>
        <div className="bg-white px-6 py-4 rounded-[0.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Feedback</p>
             <p className="text-2xl font-black text-brand-primary leading-tight">{reviews.length}</p>
           </div>
           <div className="w-12 h-12 bg-orange-50 rounded-[0.5rem] flex items-center justify-center text-brand-primary">
              <MessageSquare size={24}/>
           </div>
        </div>
      </div>

      {/* Reviews List Handling */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
           <Loader2 className="animate-spin text-brand-primary mb-4" size={40}/>
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Feedback...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white p-6 md:p-8 rounded-md border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-brand-primary transition-all relative overflow-hidden">
              
              {/* Review Content & Identity */}
              <div className="flex items-start gap-6 flex-1 w-full">
                <div className="w-16 h-16 bg-gray-50 rounded-md shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-brand-primary transition-all shadow-inner">
                  <User size={28}/>
                </div>
                
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-lg text-dark-100 uppercase tracking-tight">{rev.userName}</span>
                    <span className="text-gray-200 hidden md:block">|</span>
                    <div className="flex items-center gap-1.5 text-brand-primary bg-orange-50 px-3 py-1 rounded-md">
                       <Utensils size={14}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">{rev.foodName}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 font-medium italic leading-relaxed text-sm md:text-base pr-4">
                    "{rev.comment}"
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14}/>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating & Actions */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
                <div className="flex items-center gap-1 text-brand-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < rev.rating ? "currentColor" : "none"} 
                      className={i < rev.rating ? 'text-brand-secondary' : 'text-gray-100'}
                    />
                  ))}
                </div>

                <button 
                  onClick={() => handleDelete(rev._id)}
                  title="Remove Review"
                  className="p-4 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Trash2 size={20}/>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-md border-2 border-dashed border-gray-100 px-10">
           <div className="w-24 h-24 bg-gray-50 rounded-md flex items-center justify-center mx-auto mb-8 text-gray-200">
              <MessageSquare size={40} />
           </div>
           <h3 className="text-2xl font-black text-dark-100 uppercase tracking-tighter">No Feedback Yet</h3>
           <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto font-medium leading-relaxed">
             Customer reviews will appear here once users start rating your delicious meals.
           </p>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;