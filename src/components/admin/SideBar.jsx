import { PullRequestOutlined, PlusOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
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
import useAxios from "../../hooks/useAxios/useAxios";
import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import { useSnackbar } from "../../contexts/SnackbarContexts";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar
  const { fetchData, error } = useAxios();
  const [auth, setAuth] = useRecoilState(authAtom);
  const handleLogout = async () => {
    try {
      const response = await fetchData({
        url: "/auth/logout",
        method: "POST",
        data: {
          accessToken: auth.tokenAdmin,
        },
      }); 
      console.log(localStorage.getItem("adminToken"))

      console.log("Logout response:", response);

      if (response === "Logged out user successfully") {
        setAuth((prev) => ({
          ...prev,
          userName: "",
          password: "",
          isLoggedIn: false,
          tokenAdmin: "",
        }));
        navigate("admin/login");
      }
      localStorage.removeItem("adminToken");
      showSnackBar("You were logged out",'success');
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.",'error');
    }
  };

const routeMap = {
  dashboard: "/admin",
  inventory: "/admin/inventory",
  request: "/admin/request",
  "user-outlet": "/admin/user-management/outlet",
  "user-suplier": "/admin/user-management/supplier",
  warehouse: "/admin/user-management/warehouse",
  "invoice-outlet": "/admin/invoice/outlet",
  "invoice-suplier": "/admin/invoice/supplier",
  profile: "/admin/profile",
};


  const onClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (routeMap[key]) {
      navigate(routeMap[key]);
    }
  };

  const items = [
    {
      key: "shopname",
      label: "EMart Grocerry Shop",
      icon: <MdOutlineShoppingCart />,
      disabled: true,
    },
    { type: "divider" },
    { key: "dashboard", label: "Dashboard", icon: <MdOutlineDashboard /> },
    { type: "divider" },
    { key: "request", label: "Requests", icon: <PullRequestOutlined /> },
    { type: "divider" },
    { key: "inventory", label: "Inventory", icon: <MdOutlineInventory2 /> },
    { type: "divider" },
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
    { type: "divider" },
    {
      key: "invoice",
      label: "Invoice",
      icon: <PiInvoice />,
      children: [
        { key: "invoice-outlet", label: "Outlet", icon: <PlusOutlined /> },
        { key: "invoice-suplier", label: "Supplier", icon: <PlusOutlined /> },
      ],
    },
    { type: "divider" },
    { key: "profile", label: "My Profile", icon: <FaUserCircle /> },
    { type: "divider" },
    { key: "logout", label: "Logout", icon: <MdLogout /> },
  ];

  return (
    <Menu
      className="custom-sidebar"
      onClick={onClick}
      style={{ width: 256, height: "100vh" }}
      defaultSelectedKeys={["shopname"]}
      mode="inline"
      items={items}
    />
  );
};

export default AdminSidebar;
