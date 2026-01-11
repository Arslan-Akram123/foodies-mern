import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { getCategories } from '../../features/categorySlice';
import Carousel from '../common/Carousel';

const CategorySection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Initialize navigate
  const { categories, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // 3. Navigation handler
  const handleCategoryClick = (categoryName) => {
    navigate('/menu', { state: { filterCategory: categoryName } });
  };

  if (isLoading) return <div className="h-20 flex items-center justify-center font-bold text-gray-400">Loading Categories...</div>;

  return (
    <Carousel title="Explore Categories" viewAllLink={false}>
      {categories.map((cat) => (
        <div 
          key={cat._id} 
          onClick={() => handleCategoryClick(cat.name)} // 4. Attach click event
          className="shrink-0 flex flex-col items-center group cursor-pointer py-4"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-300  group-hover:shadow-xl  group-hover:-translate-y-1">
            <img src={cat.image} alt={cat.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-contain transition-all duration-300 " />
          </div>
          <span className="mt-4 font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-400 ">
            {cat.name}
          </span>
        </div>
      ))}
    </Carousel>
  );
};

export default CategorySection;