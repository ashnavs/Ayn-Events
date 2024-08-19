import Login from "../../pages/vendor/Login"
import { Route, Routes } from 'react-router'
import VendorSignup from "../../pages/vendor/VendorSignup"
import VendorOtp from "../../pages/vendor/VendorOtp"
import License from "../../pages/vendor/License"
import VendorPrivateRoutes from "./VendorPrivateRoutes"
import VendorHome from "../../pages/vendor/VendorHome"
import SuccessPage from "../../components/SuccessPage"
import BookingDetails from "../../pages/vendor/BookingDetails"
import BookingDetailView from "../../components/BookingDetailView"
import VendorChat from "../../pages/vendor/VendorChat"

const VendorRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<VendorSignup />} />
                <Route path='/otp-verification' element={<VendorOtp />} />
                <Route path='/uploadlicense' element={<License />} />
                <Route path='/success' element={<SuccessPage />} />

                <Route path="" element={<VendorPrivateRoutes/>}>
                       <Route path='/profile' element={<VendorHome />} />
                       <Route path='/bookings/:vendorId' element={<BookingDetails/>} />
                       <Route path='/bookingdetails/:bookingId' element={<BookingDetailView isUserSide={false}/>} />
                       <Route path='/chat' element={<VendorChat />} />
                </Route>

                
            </Routes>
        </>
    )
}

export default VendorRoutes