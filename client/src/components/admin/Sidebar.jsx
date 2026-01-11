import { LayoutDashboard, Utensils, Truck,MessageSquare, ListTree, Users, ShoppingBag, Image as ImageIcon, User,BookOpen, TicketPercent, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/admin' },
    { name: 'Manage Foods', icon: <Utensils size={20}/>, path: '/admin/foods' },
    { name: 'Categories', icon: <ListTree size={20}/>, path: '/admin/categories' },
    { name: 'Home Banners', icon: <ImageIcon size={20}/>, path: '/admin/banners' },
    { name: 'Manage Deals', icon: <TicketPercent size={20}/>, path: '/admin/deals' },
    { name: 'Orders', icon: <ShoppingBag size={20}/>, path: '/admin/orders' },
    { name: 'Users', icon: <Users size={20}/>, path: '/admin/users' },
     { name: 'Shipping Settings', icon: <Truck size={20}/>, path: '/admin/shipping' },
    { name: 'Customer Reviews', icon: <MessageSquare size={20}/>, path: '/admin/reviews' },
    { name: 'Manage Blogs', icon: <BookOpen size={20}/>, path: '/admin/blogs' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-dark-100 text-white flex flex-col h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-brand-primary tracking-widest leading-none">FOODIE<span className="text-white">S</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
              }
            >
              {item.icon}
              <span className="font-bold text-xs uppercase tracking-wider">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Footer Removed - Logout moved to Topbar */}
      </aside>
    </>
  );
};

export default Sidebar;