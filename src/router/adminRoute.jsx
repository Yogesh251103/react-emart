import Login from "@/pages/admin/Login";
import AdminLayout from "@/layout/AdminLayout";
import ProtectedRoutes from "@/ProtectedRoutes";
import Dashboard from "@/pages/admin/Dashboard";
import Inventory from "@/pages/admin/Inventory";
import Requests from "@/pages/admin/Requests";
import Product from "@/pages/admin/User Management/Product";
import Warehouse from "@/pages/admin/Warehouse";
import Supplier from "@/pages/admin/User Management/Supplier";
import InvOutlet from "@/pages/admin/Invoice/InvOutlet";
import InvSupplier from "@/pages/admin/Invoice/InvSupplier";
import Profile from "@/pages/admin/Profile";

const adminRoute = [
  { path: "admin/login", element: <Login /> },
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
          { path: "warehouse", element: <Warehouse /> },
          { path: "user-management/outlet", element: <div>Outlet Page</div> },
          { path: "user-management/supplier", element: <Supplier /> },
          {
            path: "user-management/warehouse",
            element: <div>Warehouse Page</div>,
          },
          { path: "user-management/product", element: <Product /> },
          { path: "invoice/outlet", element: <InvOutlet /> },
          {
            path: "invoice/supplier",
            element: <InvSupplier />,
          },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
];

export default adminRoute;
