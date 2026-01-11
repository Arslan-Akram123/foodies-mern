import { Outlet } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16"> {/* pt-16 to account for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;