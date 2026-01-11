import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // 1. Added useLocation
import { getFoods, resetFood } from '../../features/foodSlice';
import { getCategories } from '../../features/categorySlice';
import FoodCard from '../../components/common/FoodCard';
import { Search, SlidersHorizontal, UtensilsCrossed, Loader2, X, Filter, ChevronRight } from 'lucide-react';

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // 2. Initialize location

  // Filter States
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(3000); 
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { foods, isLoading: foodsLoading } = useSelector((state) => state.foods);
  const { categories } = useSelector((state) => state.categories);

  // --- LOGIC: CATCH NAVIGATION STATE FROM HOME PAGE ---
  useEffect(() => {
    // If a user clicked a category on the Home page (CategorySection)
    if (location.state?.filterCategory) {
      setActiveCat(location.state.filterCategory);
      
      // Professional Touch: Clear the location state so it doesn't re-apply on refresh
      window.history.replaceState({}, document.title);
      
      // Scroll to top when arriving from another page
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Initial Load: Categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Fetch Foods (Category + Keyword happens at API level)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getFoods({ category: activeCat, keyword: searchQuery }));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCat, searchQuery, dispatch]);

  // Combined Filtering (Price filter happens at UI level for instant feedback)
  const finalFilteredFoods = foods.filter(food => food.price <= priceRange);

  const resetAllFilters = () => {
    setActiveCat("All");
    setSearchQuery("");
    setPriceRange(3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      
      {/* <div className="flex flex-col md:flex-row md:justify-center justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl text-center font-black italic tracking-tighter uppercase leading-none">
             Our <span className="text-brand-primary">Menu</span>
           </h1>
           
           <p className="text-gray-400 font-medium max-w-lg mx-auto text-center">
             Explore our diverse menu, crafted to satisfy every craving with fresh ingredients and bold flavors.
           </p>
        </div>
        
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 bg-dark-100 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
        >
          <Filter size={18}/> Refine Search
        </button>
      </div> */}

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* --- SIDEBAR FILTERS --- */}
        <aside className={`
          fixed lg:static inset-0 z-[60] lg:z-0 bg-white lg:bg-transparent lg:block w-full lg:w-80 space-y-4 shrink-0 p-8 lg:p-0 transition-transform duration-500 ease-in-out lg:transition-none
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:transform-none lg:translate-x-0'}
        `}>
          <div className="flex justify-between items-center lg:hidden mb-10">
            <h3 className="font-black text-xl italic uppercase">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-gray-100 rounded-full text-dark-100"><X size={24}/></button>
          </div>

          <div className="bg-white p-3 rounded-[1rem] shadow-md  space-y-8 sticky top-16">
            
            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="text-[14px] font-black mb-4 flex items-center gap-2 uppercase tracking-[0.1em] text-gray-400 border-b border-gray-300 pb-4">
                <SlidersHorizontal size={14} className="text-brand-primary"/> Select Category
              </h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
                <button 
                  onClick={() => {setActiveCat("All"); setShowMobileFilters(false);}}
                  className={`w-full px-4 py-4 rounded-lg text-left  font-black text-[12px] uppercase tracking-widest transition-all ${activeCat === "All" ? 'bg-brand-primary text-white0 translate-x-1' : 'text-gray-400 hover:bg-gray-200 hover:text-dark-100'}`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat._id}
                    onClick={() => {setActiveCat(cat.name); setShowMobileFilters(false);}}
                    className={`w-full px-4 py-4 rounded-lg text-left font-black text-[12px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeCat === cat.name ? 'bg-brand-primary text-white  translate-x-1' : 'text-gray-400 hover:bg-gray-200 hover:text-dark-100'}`}
                  >
                    <img src={cat.image} alt="" className={`w-5 h-5 object-contain ${activeCat === cat.name ? 'text-brand-primary' : ''}`} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 mb-4">
              <h3 className="text-[14px] font-black flex items-center gap-3 uppercase tracking-[0.1em] text-gray-400 border-b border-gray-300 pb-4">
                <UtensilsCrossed size={14} className="text-brand-primary"/> Price Limit
              </h3>
              <div className="px-2">
                <input 
                  type="range" min="0" max="3000" step="50"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between mt-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                   <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest mt-1">Budget:</span>
                   <span className="text-xl font-black text-brand-primary">Rs {priceRange}</span>
                </div>
              </div>
            </div>
                   {/* <div className="border-b border-gray-300 mb-0"></div> */}
            <button 
              onClick={resetAllFilters}
              className="w-full text-center text-[14px]   tracking-[0.1em] text-white bg-brand-primary  transition-colors py-4 px-3 border border-gray-200 rounded-lg hover:border-brand-primary"
            >
              Reset All Preferences
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 space-y-10">
          
          {/* SEARCH BAR */}
          <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center'>
            <h1 className="text-5xl text-center font-black italic tracking-tighter uppercase leading-none">
             Our <span className="text-brand-primary">Menu</span>
           </h1>
            <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors">
              <Search size={20} strokeWidth={3} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Craving something in ${activeCat === 'All' ? 'Menu' : activeCat}?`} 
              className="w-full pl-10 pr-10 py-3 rounded-[0.5rem] bg-white border border-gray-50 shadow-sm outline-none focus:ring-2 focus:ring-orange-50/50 focus:border-brand-primary transition-all  text-dark-100 placeholder:text-gray-200 text-md  tracking-tight" 
            />
          </div>
          </div>

          {/* GRID STATE HANDLING */}
          {foodsLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
               <div className="w-20 h-20 border-8 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
               <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px] mt-10 animate-pulse">Preparing the Menu...</p>
            </div>
          ) : finalFilteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {finalFilteredFoods.map(food => (
                <FoodCard key={food._id} item={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-[1rem] border-2 border-dashed border-gray-300 px-10">
               <div className="w-24 h-24 bg-gray-50 rounded-[1rem] flex items-center justify-center mx-auto mb-8 transform -rotate-12">
                  <Search size={44} className="text-gray-200" />
               </div>
               <h3 className="text-xl font-black text-dark-100 uppercase tracking-tighter italic">No Matches Found</h3>
               <p className="text-gray-400 text-sm mt-4 max-w-sm mx-auto font-medium leading-relaxed">
                 We couldn't find any items matching "{searchQuery}" in {activeCat} under Rs {priceRange}.
               </p>
               <button 
                onClick={resetAllFilters}
                className="mt-10 bg-brand-primary text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-orange-200"
               >
                 Show Complete Menu
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Menu;