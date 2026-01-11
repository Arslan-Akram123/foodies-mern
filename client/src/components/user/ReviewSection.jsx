import { Star, User } from 'lucide-react';

const ReviewSection = ({ reviews }) => {
  return (
    <div className="py-10 space-y-8">
      <h3 className="text-2xl font-black italic uppercase">Customer <span className="text-brand-primary">Reviews</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews?.map((review, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={20}/></div>
                <div>
                  <p className="font-bold text-sm">{review.user}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{review.date}</p>
                </div>
              </div>
              <div className="flex text-brand-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;