import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../features/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) alert(message);
    if (isSuccess || user) navigate('/');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Account</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" value={name} onChange={onChange} placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded-md outline-none  focus:ring-1 focus:ring-brand-primary" required />
        <input name="email" value={email} onChange={onChange} placeholder="Email" className="w-full p-3 bg-gray-50 rounded-md outline-none  focus:ring-1 focus:ring-brand-primary" required />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={onChange}
            placeholder="Password"
            className="w-full p-3 bg-gray-50 rounded-md outline-none focus:ring-1 focus:ring-brand-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button disabled={isLoading} className="w-full bg-brand-primary text-white py-3 rounded-md font-bold">
          {isLoading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;