import Login from "../../pages/vendor/Login"
import { Route, Routes } from 'react-router'
import VendorSignup from "../../pages/vendor/VendorSignup"
import VendorOtp from "../../pages/vendor/VendorOtp"
import License from "../../pages/vendor/License"
import VendorPrivateRoutes from "./VendorPrivateRoutes"
import VendorHome from "../../pages/vendor/VendorHome"

const VendorRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<VendorSignup />} />
                <Route path='/otp-verification' element={<VendorOtp />} />
                <Route path='/license' element={<License />} />
                <Route path='/profile' element={<VendorHome />} />
                <Route path="" element={<VendorPrivateRoutes/>}>
                       
                </Route>

                
            </Routes>
        </>
    )
}

export default VendorRoutes