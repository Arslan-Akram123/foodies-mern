import { Star, Quote, User } from 'lucide-react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div key={rev._id} className="bg-white p-4 rounded-[0.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            <Quote className="absolute -right-4 -top-4 text-orange-50 group-hover:text-orange-100 transition-colors" size={120} />
            
            <div className="relative z-10 space-y-6">
              {/* Stars */}
              <div className="flex gap-1 text-brand-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < rev.rating ? "currentColor" : "none"} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 font-medium italic leading-relaxed line-clamp-3">
                "{rev.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-primary font-black">
                  {rev.userName?.slice(0, 1).toUpperCase() || <User size={20}/>}
                </div>
                <div>
                  <h4 className="font-black text-dark-100 uppercase text-xs tracking-widest">{rev.userName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;