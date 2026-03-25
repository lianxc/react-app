import { useLocation, Navigate, Outlet } from 'react-router-dom';

const checkToken = () => !!localStorage.getItem('userToken');

const ProtectedRoute = () => {
  const isAuthenticated = checkToken();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;