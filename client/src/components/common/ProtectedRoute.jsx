import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not logged in -> Redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not an admin -> Redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;