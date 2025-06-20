import Login from "../pages/admin/Login";
import AdminLayout from "../layout/AdminLayout";
import Dasboard from "../pages/admin/Dashboard";

const adminRoute = [
  { path: "/admin/login", element: <Login /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ path: "", element: <Dasboard /> }],
  },
];
export default adminRoute;
