import { useEffect, useState } from 'react';
import { ShieldCheck, User as UserIcon, Trash2, UserPlus, UserMinus, Loader2, Search, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import API from '../../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FIX 1: ROLE UPDATE LOGIC ---
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user to ${newRole.toUpperCase()}?`)) {
      try {
        // Points to the new /role endpoint
        await API.put(`/users/${userId}/role`, { role: newRole });
        
        // Update local state immediately
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        
        setActionSuccess("Role updated!");
        setTimeout(() => setActionSuccess(""), 3000);
      } catch (err) {
        alert("Error updating role. Ensure you have admin permissions.");
      }
    }
  };

  // --- FIX 2: DELETE LOGIC ---
  const handleDelete = async (userId) => {
    if (userId === currentUser?._id) return alert("Security Alert: You cannot delete yourself.");
    
    if (window.confirm("WARNING: This will permanently delete this account. Continue?")) {
      try {
        await API.delete(`/users/${userId}`);
        
        // Remove from state immediately
        setUsers(users.filter(u => u._id !== userId));
        
        setActionSuccess("User deleted successfully");
        setTimeout(() => setActionSuccess(""), 3000);
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            User <span className="text-brand-primary">Database</span>
          </h2>
          {actionSuccess && (
            <p className="text-green-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <CheckCircle2 size={12}/> {actionSuccess}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-[0.5rem] shadow-sm border border-gray-100">
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Registered Accounts</p>
             <p className="text-3xl font-black text-brand-primary leading-tight">{users.length}</p>
           </div>
           <div className="w-14 h-14 bg-orange-50 rounded-md flex items-center justify-center text-brand-primary">
              <UserIcon size={28}/>
           </div>
        </div>
      </div>

      <div className="relative group max-w-lg">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={22} />
        <input 
          type="text" 
          placeholder="Search identity or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white rounded-[0.5rem] border border-gray-100 outline-none focus:ring-8 focus:ring-orange-50 transition-all font-bold text-dark-100 placeholder:text-gray-200 uppercase tracking-tight"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <Loader2 className="animate-spin text-brand-primary mb-4" size={48}/>
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Fetching User Data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[0.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  <th className="p-10">User Identity</th>
                  <th className="p-10 text-center">Status</th>
                  <th className="p-10">Joined Date</th>
                  <th className="p-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="p-10 flex items-center gap-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-[0.5rem] flex items-center justify-center text-gray-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner overflow-hidden border-4 border-white">
                        {user.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <UserIcon size={28}/>
                        )}
                      </div>
                      <div>
                        <p className="text-dark-100 font-black text-xl tracking-tighter uppercase italic">{user.name}</p>
                        <p className="text-gray-400 text-xs font-bold">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                          user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-600 border-purple-200' 
                          : 'bg-blue-100 text-blue-600 border-blue-200'
                        }`}>
                          {user.role === 'admin' && <ShieldCheck size={14} strokeWidth={3}/>} 
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-10 text-gray-400 font-black text-xs uppercase tracking-widest">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-10 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleToggleRole(user._id, user.role)}
                          title="Change Access Level"
                          className="p-4 bg-gray-100 text-gray-400 hover:bg-dark-100 hover:text-white rounded-md transition-all shadow-sm active:scale-90"
                        >
                          {user.role === 'admin' ? <UserMinus size={20}/> : <UserPlus size={20}/>}
                        </button>
                        
                        <button 
                          disabled={user._id === currentUser?._id}
                          onClick={() => handleDelete(user._id)}
                          className={`p-4 rounded-md transition-all shadow-sm active:scale-90 ${
                            user._id === currentUser?._id 
                            ? 'bg-gray-50 text-gray-200 cursor-not-allowed' 
                            : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Trash2 size={20}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;