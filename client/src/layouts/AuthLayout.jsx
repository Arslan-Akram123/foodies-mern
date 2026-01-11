import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-200 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row h-full md:h-[500px]">
        {/* Left Side: Image/Branding */}
        <div className="hidden md:flex md:w-1/2 bg-brand-primary items-center justify-center p-12 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-black mb-4 tracking-tighter">WELCOME BACK!</h1>
            <p className="text-lg opacity-80 font-medium">Delicious food is just a few clicks away. Sign in to your account.</p>
          </div>
        </div>
        
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;