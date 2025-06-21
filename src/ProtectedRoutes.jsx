import { Navigate,Outlet,useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAtom } from "./atoms/sampleAtom"
function ProtectedRoutes({allowedRoles}) {
    const auth = useRecoilValue(authAtom)
    const location = useLocation()
    const isAdmin = auth.tokenAdmin && allowedRoles.includes("admin");
    const isVendor = auth.tokenVendor && allowedRoles.includes("vendor");
    if (isAdmin || isVendor){
        return <Outlet/>;
    }
    return <Navigate to={"/login"} state={{from: location}} replace/>
}

export default ProtectedRoutes
