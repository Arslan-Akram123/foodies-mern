import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../features/blogSlice';
import { Calendar, User, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector(state => state.blogs);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBlogs());
    // Scroll to top when visiting the blog
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Utility to truncate long content for the grid view
  const getExcerpt = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">

      {/* --- HEADER SECTION --- */}
      <div className="text-center mb-4 space-y-2">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-2">
          <BookOpen size={14} /> Foodie Stories
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
          Our <span className="text-brand-primary">Journal</span>
        </h1>
        <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Discover recipes, kitchen secrets, and the latest food trends from our expert chefs.
        </p>
      </div>

      {/* --- LOADING STATE --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-brand-primary mb-4" size={48} />
          <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px]">Opening the archives...</p>
        </div>
      ) : blogs.length > 0 ? (
        /* --- BLOG GRID --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {blogs.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-[1rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all duration-500 group flex flex-col h-full"
            >
              {/* Featured Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-brand-primary px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {post.category || 'Food Trends'}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-primary" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <User size={14} className="text-brand-primary" />
                      {post.author || 'Chef Admin'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-dark-100 mb-4 group-hover:text-brand-primary transition-colors tracking-tight leading-snug uppercase italic">
                    {post.title}
                  </h2>

                  <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                    {getExcerpt(post.content)}
                  </p>
                </div>

                {/* Read More Link */}
                <button
                  onClick={() => navigate(`/blog/${post._id}`)} // Use the ID from backend
                  className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] group/btn w-fit cursor-pointer"
                >
                  Read Full Article
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 px-10">
          <div className="w-28 h-28 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform rotate-12">
            <BookOpen size={44} className="text-gray-200" />
          </div>
          <h3 className="text-3xl font-black text-dark-100 uppercase tracking-tighter italic">No Articles Yet</h3>
          <p className="text-gray-400 text-sm mt-4 max-w-sm mx-auto font-medium leading-relaxed">
            Our kitchen is busy cooking up some great stories. Check back soon for recipes and news!
          </p>
          <Link
            to="/"
            className="mt-10 inline-block bg-brand-primary text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-orange-200 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Blog;