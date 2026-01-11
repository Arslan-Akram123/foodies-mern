import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children, title, viewAllLink }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const totalItems = React.Children.count(children);

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(6); // lg
      else if (window.innerWidth >= 768) setItemsPerView(4); // md
      else setItemsPerView(2); // sm
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    // If at the end, loop back to start
    if (currentIndex >= totalItems - itemsPerView) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    // If at start, loop to the end
    if (currentIndex === 0) {
      setCurrentIndex(totalItems - itemsPerView);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="my-12 relative group/carousel max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {title && (
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-dark-100 italic">
            {title.split(' ')[0]} <span className="text-brand-primary">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
        )}
        {viewAllLink && (
          <button className="text-brand-primary font-bold text-xs uppercase tracking-widest hover:underline underline-offset-8">
            View All
          </button>
        )}
      </div>

      <div className="relative overflow-hidden">
        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-3 rounded-full shadow-xl hover:bg-brand-primary hover:text-white transition-all border border-gray-100 -ml-2 md:-ml-5"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-3 rounded-full shadow-xl hover:bg-brand-primary hover:text-white transition-all border border-gray-100 -mr-2 md:-mr-5"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>

        {/* The Slider Track */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` 
          }}
        >
          {React.Children.map(children, (child) => (
            <div 
              style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              className="px-2" // Space between items
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;