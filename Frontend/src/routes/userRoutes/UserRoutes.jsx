import LandingPage from '../../pages/user/landingpage/LandingPage'
import Signup from '../../pages/user/Signup'
import UserOtp from '../../pages/user/UserOtp'
import LoginPage from '../../pages/user/LoginPage'
import UserHomePage from '../../pages/user/UserHomePage'
import UserPrivateRoutes from './UserPrivateRoutes';
import { Route, Routes, useNavigate } from 'react-router'
import Vendor from '../../pages/user/Vendor'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react'
import { setupInterceptors } from '../../services/axiosInstanceUser'
import { toast } from 'sonner';
import { logoutUser } from '../../features/auth/authSlice'
import VendorDetails from '../../pages/user/VendorDetails'







const UserRoutes = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    useEffect(() => {
        setupInterceptors(navigate, dispatch, logoutUser, toast);
    }, [navigate, dispatch]);
    return (
        <>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/otp-verification' element={<UserOtp />} />
                <Route path='' element={<UserPrivateRoutes />}>
                    <Route path='/home' element={<UserHomePage />} />
                    <Route path='/vendors' element={<Vendor />} />
                    <Route path="/vendorDetails/:id" element={<VendorDetails />} />

                </Route>
            </Routes>
        </>
    )
}


export default UserRoutes



