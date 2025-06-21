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
          { path: "inventory", element: <Inventory /> },
          { path: "request", element: <Requests /> },
          { path: "user/outlet", element: <div>Outlet Page</div> },
          { path: "user/supplier", element: <div>Supplier Page</div> },
          { path: "user/warehouse", element: <div>Warehouse Page</div> },
          { path: "invoice/outlet", element: <div>Invoice Outlet Page</div> },
          { path: "invoice/supplier", element: <div>Invoice Supplier Page</div> },
          { path: "profile", element: <div>Profile Page</div> },
        ],
      },
    ],
  },
];

export default adminRoute;