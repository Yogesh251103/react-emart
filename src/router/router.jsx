import { createBrowserRouter } from "react-router-dom";
import adminRoute from "./adminRoute";
import vendorRoute from "./vendorRoute";

const router = createBrowserRouter([
  ...adminRoute,
  ...vendorRoute
]);

export default router;