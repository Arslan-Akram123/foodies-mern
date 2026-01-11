import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../features/blogSlice';
import { 
  Calendar, User, ChevronLeft, Share2, 
  Clock, Facebook, Twitter, Instagram, Loader2 
} from 'lucide-react';
import API from '../../api/axios';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific blog
  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    getBlog();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={50} />
        <p className="mt-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Story...</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Cinematic Header Image */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-transparent"></div>
        
        {/* Floating Navigation */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate('/blog')}
            className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl hover:bg-brand-primary hover:text-white transition-all group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex gap-3">
             <button className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl hover:text-brand-primary transition-all"><Share2 size={20}/></button>
          </div>
        </div>
      </div>

      {/* Article Content Area */}
      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="bg-white p-8 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-50">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <span className="bg-orange-50 text-brand-primary px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-orange-100">
              {blog.category || 'Food Trends'}
            </span>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
              <Calendar size={16} className="text-brand-primary"/>
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs border-l pl-6">
              <Clock size={16} className="text-brand-primary"/>
              6 Min Read
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-dark-100 tracking-tighter uppercase italic leading-none mb-10">
            {blog.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center gap-4 mb-12 p-4 bg-gray-50 rounded-3xl w-fit">
             <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black">AD</div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-dark-100">{blog.author || 'Admin Chef'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Senior Food Specialist</p>
             </div>
          </div>

          {/* Main Body Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-md md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
              {blog.content}
            </p>
          </div>

          {/* Share & Tags Footer */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Share This</span>
                <div className="flex gap-2">
                   <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><Facebook size={18}/></button>
                   <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-sky-400 hover:text-white transition-all"><Twitter size={18}/></button>
                   <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all"><Instagram size={18}/></button>
                </div>
             </div>
             
             <Link to="/blog" className="flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
               Back to all stories
             </Link>
          </div>
        </div>
      </article>

      {/* Bottom Engagement Section */}
      <section className="bg-dark-100 py-24 px-6 text-center">
         <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Craving something <span className="text-brand-primary">Delicious?</span></h2>
            <p className="text-gray-400 font-medium">After reading about food, it's only natural to want some. Explore our full menu now.</p>
            <Link to="/menu" className="inline-block bg-brand-primary text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-900/40 hover:scale-105 transition-all">
               Order Your Feast Now
            </Link>
         </div>
      </section>
    </div>
  );
};

export default BlogDetail;