
import LandingPage from '../pages/user/LandingPage';
import Signup from '../pages/user/Signup';
import UserOtp from '../pages/user/UserOtp';
import LoginPage from '../pages/user/LoginPage';
import UserHomePage from '../pages/user/UserHomePage';
import UserPrivateRoutes from '../authComponents/UserPrivateRoutes';
import { Route, Routes } from 'react-router'





const UserRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/otp-verification' element={<UserOtp />} />
                <Route path='' element={<UserPrivateRoutes />}>
                    <Route path='/home' element={<UserHomePage />} />
                </Route>
            </Routes>
        </>
    )
}


export default UserRoutes