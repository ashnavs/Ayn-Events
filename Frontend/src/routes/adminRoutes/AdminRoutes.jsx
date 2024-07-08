
// import AdminLogin from '../../pages/admin/AdminLogin';
import AddService from '../../pages/admin/AddService';
import AdminLogin from '../../pages/admin/AdminLogin';
import Dashboard from '../../pages/admin/Dashboard'
import UserList from '../../pages/admin/UserList'
import VendorDetail from '../../pages/admin/VendorDetail';
import VendorList from '../../pages/admin/VendorList';
import VendorVerify from '../../pages/admin/VendorVerify';
import AdminPrivateRoutes from './AdminPrivateRoutes';
import { Route, Routes } from 'react-router'





const AdminRoutes = () => {
    return (
        <>
            <Routes>

                <Route path='/login' element={<AdminLogin />} />

                <Route path='' element={<AdminPrivateRoutes />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/userlist' element={<UserList />} />
                    <Route path='/vendorlist' element={<VendorList />} />
                    <Route path='/vendorverify' element={<VendorVerify />} />
                    <Route path='/addservice' element={<AddService />} />
                    <Route path='/vendor/:vendorId' element={<VendorDetail />} />


                </Route>
            </Routes>
        </>
    )
}


export default AdminRoutes