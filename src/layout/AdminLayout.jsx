import AdminSidebar from "../components/admin/SideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="w-screen flex overflow-x-hidden min-h-screen">
      <AdminSidebar />
      <main className="w-full h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
