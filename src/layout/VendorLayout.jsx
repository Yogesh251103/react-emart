// layouts/VendorLayout.jsx
import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/Sidebar";

export default function VendorLayout() {
  return (
    <div className="w-screen flex overflow-x-hidden">
      <VendorSidebar />
      <main className="w-[70%] p-4">
        <Outlet />
      </main>
    </div>
  );
}
