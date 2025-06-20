import React from "react";
import {
  WindowsOutlined,
  PullRequestOutlined,
  ShoppingCartOutlined,
  DropboxOutlined,
  UserSwitchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import {
  MdOutlineSupervisedUserCircle,
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import { PiInvoice } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
const items = [
  {
    key: "shopname",
    label: "EMart Grocerry Shop",
    icon: <MdOutlineShoppingCart />,
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    type: "divider",
  },
  {
    key: "request",
    label: "Requests",
    icon: <PullRequestOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: <MdOutlineInventory2 />,
  },
  {
    type: "divider",
  },

  {
    key: "user",
    label: "User Management",
    icon: <MdOutlineSupervisedUserCircle />,
    children: [
      { key: "warehouse", label: "Warehouse", icon: <PlusOutlined /> },
      { key: "user-outlet", label: "Outlet", icon: <PlusOutlined /> },
      { key: "user-suplier", label: "Supplier", icon: <PlusOutlined /> },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: <PiInvoice />,
    children: [
      { key: "invoice-outlet", label: "Outlet", icon: <PlusOutlined /> },
      { key: "invoice-suplier", label: "Supplier", icon: <PlusOutlined /> },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "profile",
    label: "My Profile",
    icon: <FaUserCircle />,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <MdLogout />,
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    console.log("click ", key);
    const routeMap = {
      dashboard: "/admin",
      request: "/admin/request",
      outlet: "/admin/outlet",
      billing: "/admin/billing",
      invoice: "/admin/invoice",
      profile: "/admin/profile",
    };

    if (key === "logout") {
      console.log("Logout");
    } else if (routeMap[key]) {
      navigate(routeMap[key]);
    }
  };

  return (
    <Menu
      className="custom-sidebar"
      onClick={onClick}
      style={{ width: 256, height: "100vh", position: "fixed" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};
export default AdminSidebar;
