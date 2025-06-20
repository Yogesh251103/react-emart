import AdminSidebar from "../components/admin/SideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="w-screen flex overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div> 
  );
}
