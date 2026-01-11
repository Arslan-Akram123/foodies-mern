import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../features/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // You can replace this alert with a Toast notification later
      alert(message);
    }

    if (isSuccess || user) {
      console.log(user.role);
      // Role-based redirection logic
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-black text-dark-100 uppercase tracking-tighter">Login</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          {/* <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Email Address
          </label> */}
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder=" Email Address"
            className="w-full px-5 py-3 rounded-md border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none transition-all font-medium"
            required
          />
        </div>
        
        <div>
          {/* <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Password
          </label> */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="w-full px-5 py-3 rounded-md border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none transition-all font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-brand-primary text-white py-3 rounded-md font-black text-lg shadow-xl shadow-orange-100 transition-all active:scale-95 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'SIGN IN'
          )}
        </button>
      </form>

      <div className="pt-4">
        <p className="text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-brand-primary font-black hover:underline underline-offset-4">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;