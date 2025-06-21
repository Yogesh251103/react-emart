import Login from "../pages/admin/Login";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoutes from "../ProtectedRoutes";
import Dashboard from "../pages/admin/Dashboard";
import Inventory from "../pages/admin/Inventory";
import Requests from "../pages/admin/Requests";
const adminRoute = [
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { path: "", element: <Dashboard /> },
          {
            path: "/admin/inventory",
            element: <Inventory />,
          },
          {
            path: "/admin/request",
            element: <Requests/>
          }
        ],
      },
    ],
  },
];
export default adminRoute;
