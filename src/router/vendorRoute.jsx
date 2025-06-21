import Login from "../pages/admin/Login";
import VendorLayout from "../layout/VendorLayout";
import Home from "../pages/vendor/Home";

const vendorRoute = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <VendorLayout />,
    children: [{ path: "", element: <Home /> }],
  },
];
export default vendorRoute;
