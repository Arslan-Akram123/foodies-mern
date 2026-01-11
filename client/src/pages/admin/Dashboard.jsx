import { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, Utensils, Loader2, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/stats');
        console.log("Fetched Dashboard Stats:", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard stats failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Business Data...</p>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `Rs ${stats?.totalRevenue?.toFixed(2)}`, icon: <DollarSign size={24}/>, color: 'bg-green-100 text-green-600', trend: '+12% from last month' },
    { title: 'Total Orders', value: stats?.totalOrders, icon: <ShoppingBag size={24}/>, color: 'bg-blue-100 text-blue-600', trend: 'Live updates' },
    { title: 'Total Foods', value: stats?.totalFoods, icon: <Utensils size={24}/>, color: 'bg-orange-100 text-orange-600', trend: 'Active Menu Items' },
    { title: 'New Users', value: stats?.totalUsers, icon: <Users size={24}/>, color: 'bg-purple-100 text-purple-600', trend: 'Registered Customers' },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase text-dark-100">
             Live <span className="text-brand-primary">Analytics</span>
           </h1>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
             <Clock size={14}/> Last updated: {new Date().toLocaleTimeString()}
           </p>
        </div>
        <button className="bg-dark-100 text-white px-8 py-3 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl">
           Download Report
        </button>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-[0.5rem] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:border-brand-primary transition-all">
            <div className="flex justify-between items-start">
               <div className={`p-4 rounded-md ${stat.color} shadow-inner`}>
                  {stat.icon}
               </div>
               <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase tracking-tighter">
                  <TrendingUp size={14}/> {stat.trend.split(' ')[0]}
               </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{stat.title}</p>
              <h2 className="text-2xl font-black text-dark-100 tracking-tighter">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Recent Activity Table */}
      <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <h3 className="font-black text-xl italic uppercase tracking-tight">Recent <span className="text-brand-primary">Transactions</span></h3>
           <Link to="/admin/orders" className="text-brand-primary font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-8">View Full Log</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <tr>
                  <th className="p-8">Customer</th>
                  <th className="p-8">Order ID</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map(order => (
                <tr key={order._id} className="hover:bg-orange-50/20 transition-colors group">
                  <td className="p-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 font-black text-xs uppercase group-hover:bg-brand-primary group-hover:text-white transition-all">
                           {order.user?.name?.slice(0, 2).toUpperCase() || 'GU'}
                        </div>
                        <div>
                           <p className="font-black text-dark-100 uppercase text-sm">{order.user?.name || 'Guest'}</p>
                           <p className="text-[10px] text-gray-400 font-bold">{order.user?.email}</p>
                        </div>
                     </div>
                  </td>
                  <td className="p-8">
                     <span className="font-bold text-gray-400 text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="p-8">
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                     }`}>
                        {order.status}
                     </span>
                  </td>
                  <td className="p-8 text-right font-black text-brand-primary text-lg">
                     Rs {order?.totalPrice?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;