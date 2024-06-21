// adminRoutes.js
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import UserList from '../pages/admin/UserList';
import PublicRoute from '../authComponents/PublicRoute';
import PrivateRoute from '../authComponents/UserPrivateRoutes';


const adminRoutes = [
  { path: '/admin/login', element: <PublicRoute element={<AdminLogin />} /> },
  { path: '/admin/dashboard', element: <PrivateRoute element={<Dashboard />} /> },
  { path: '/admin/userlist', element: <PrivateRoute element={<UserList />} /> },
];

export default adminRoutes;
