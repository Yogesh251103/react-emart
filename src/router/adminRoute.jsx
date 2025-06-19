import Login from "../pages/admin/Login";
import AdminLayout from "../layout/AdminLayout";
import Home from "../pages/admin/Home";

const adminRoute = [
  { path: "/admin/login", element: <Login /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ path: "", element: <Home /> }],
  },
];
export default adminRoute;
