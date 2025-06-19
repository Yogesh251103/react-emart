import { Link } from "react-router-dom";

export default function VendorSidebar() {
  return (
    <aside className="w-[30%] bg-amber-200 h-screen">
      <h3>Vendor Panel</h3>
      <ul>
        <li><Link to="/vendor/dashboard">Dashboard</Link></li>
        <li><Link to="/vendor/orders">Orders</Link></li>
      </ul>
    </aside>
  );
}
 