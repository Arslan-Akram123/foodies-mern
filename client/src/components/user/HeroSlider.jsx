import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { getActiveBanners } from '../../features/bannerSlice';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { banners, isLoading } = useSelector((state) => state.banners);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch(getActiveBanners());
  }, [dispatch]);

  // Auto-play logic
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (isLoading) return <div className="h-[400px] md:h-[600px] w-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>;
  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden  shadow-2xl bg-dark-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
             <img src={b.image} alt="" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-r from-dark-100 via-dark-100/40 to-transparent"></div>
          </div>

          <div className="relative z-10 px-10 md:px-20 w-full max-w-4xl space-y-6">
            <motion.span 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="inline-block bg-brand-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.3em]"
            >
              {b.discountTag || "Limited Offer"}
            </motion.span>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-black text-white leading-none italic uppercase"
            >
              {b.title}
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-gray-300 font-medium"
            >
              {b.subtitle}
            </motion.p>

            <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
               className="flex items-center gap-6 pt-4"
            >
               <button 
                onClick={() => navigate('/menu')}
                className="bg-white text-dark-100 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl"
               >
                 Order Now
               </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Controls */}
      <div className="absolute bottom-10 right-10 flex gap-3 z-20">
        <button onClick={() => setCurrent(current === 0 ? banners.length - 1 : current - 1)} className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-brand-primary transition-all"><ChevronLeft/></button>
        <button onClick={() => setCurrent(current === banners.length - 1 ? 0 : current + 1)} className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-brand-primary transition-all"><ChevronRight/></button>
      </div>
    </div>
  );
};

export default HeroSlider;