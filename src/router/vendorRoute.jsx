import Login from "@/pages/vendor/Login";
import VendorLayout from "@/layout/VendorLayout";
import Home from "@/pages/vendor/Home";
import ProtectedRoutes from "@/ProtectedRoutes";
import Billing from "@/pages/vendor/Billing";
import Invoice from "@/pages/vendor/Invoice";
import ManageOutlet from "@/pages/vendor/ManageOutlet";
import Profile from "@/pages/vendor/Profile";
import Requests from "@/pages/admin/Requests";
const vendorRoute = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={["vendor"]} />,
    children: [
      {
        path: "/",
        element: <VendorLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/billing",
            element: <Billing />,
          },
          {
            path: "/invoice",
            element: <Invoice />,
          },
          {
            path: "/manage-outlet",
            element: <ManageOutlet />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/request",
            element: <Requests />,
          },
        ],
      },
    ],
  },
];
export default vendorRoute;
