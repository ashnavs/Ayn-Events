import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const UserPrivateRoutes = () => {
    const { userInfo } = useSelector((state) => state.userAuth)
    return(
        userInfo ? <Outlet /> : <Navigate to={'/login'}/>
    )
}

export default UserPrivateRoutes