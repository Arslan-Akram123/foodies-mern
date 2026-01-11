import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, itemName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 md:p-12 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase tracking-tight italic">Rate <span className="text-brand-primary">Food</span></h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">How was your</p>
            <h4 className="text-xl font-bold text-dark-100">{itemName || 'Meal'}?</h4>
          </div>

          {/* Star Rating Logic */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125"
              >
                <Star 
                  size={40} 
                  className={`${(hover || rating) >= star ? 'text-brand-secondary fill-brand-secondary' : 'text-gray-200'}`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share your experience</label>
            <textarea 
              rows="4" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="The taste was amazing! High quality ingredients..."
              className="w-full p-6 bg-gray-50 rounded-[2rem] border-none focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            ></textarea>
          </div>

          <button 
            onClick={() => { alert("Review Submitted!"); onClose(); }}
            className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-orange-100 hover:scale-[1.02] transition-transform"
          >
            <Send size={20}/> SUBMIT REVIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;