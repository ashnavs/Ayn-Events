
// import AdminLogin from '../../pages/admin/AdminLogin';
import AdminLogin from '../../pages/admin/AdminLogin';
import Dashboard from '../../pages/admin/Dashboard'
import UserList from '../../pages/admin/UserList'
import VendorList from '../../pages/admin/VendorList';
import AdminPrivateRoutes from './AdminPrivateRoutes';
import { Route, Routes } from 'react-router'





const AdminRoutes = () => {
    return (
        <>
            <Routes>
                
                <Route path='/login' element={<AdminLogin/>} />

                <Route path='' element={<AdminPrivateRoutes />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/userlist' element={<UserList/>    } />
                    <Route path='/vendorlist' element={<VendorList/>} />

                </Route>
            </Routes>
        </>
    )
}


export default AdminRoutes