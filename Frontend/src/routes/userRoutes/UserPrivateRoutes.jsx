
import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const UserPrivateRoutes = () => {
    const token = Cookies.get('token')
    console.log(token);
    return(
        token ? <Outlet /> : <Navigate to={'/login'}/>
    )
}

export default UserPrivateRoutes