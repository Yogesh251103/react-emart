import { PullRequestOutlined, PlusOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineSupervisedUserCircle,
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdLogout,
  MdOutlineWarehouse,
} from "react-icons/md";
import { PiInvoice } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios/useAxios";
import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import { useSnackbar } from "../../contexts/SnackbarContexts";
import MenuIcon from "../MenuIcon";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar;
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
      console.log(localStorage.getItem("adminToken"));

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
      showSnackBar("You were logged out", "success");
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.", "error");
    }
  };

  const routeMap = {
    dashboard: "/admin",
    inventory: "/admin/inventory",
    request: "/admin/request",
    warehouse: "/admin/warehouse",
    "user-outlet": "/admin/user-management/outlet",
    "user-suplier": "/admin/user-management/supplier",
    "user-warehouse": "/admin/user-management/warehouse",
    product: "/admin/user-management/product",
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
      label: "E-Mart Grocery Shop",
      icon: (
        <MenuIcon>
          <MdOutlineShoppingCart />
        </MenuIcon>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: (
        <MenuIcon>
          <MdOutlineDashboard />
        </MenuIcon>
      ),
    },
    { type: "divider" },
    {
      key: "request",
      label: "Requests",
      icon: (
        <MenuIcon>
          <PullRequestOutlined />
        </MenuIcon>
      ),
    },
    { type: "divider" },
    {
      key: "inventory",
      label: "Inventory",
      icon: (
        <MenuIcon>
          <MdOutlineInventory2 />
        </MenuIcon>
      ),
    },
    { type: "divider" },
    {
      key: "warehouse",
      label: "Warehouse",
      icon: (
        <MenuIcon>
          <MdOutlineWarehouse />
        </MenuIcon>
      ),
    },
    { type: "divider" },
    {
      key: "user",
      label: "User Management",
      icon: (
        <MenuIcon>
          <MdOutlineSupervisedUserCircle />
        </MenuIcon>
      ),
      children: [
        {
          key: "user-warehouse",
          label: "Warehouse",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
        {
          key: "user-outlet",
          label: "Outlet",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
        {
          key: "user-suplier",
          label: "Supplier",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
        {
          key: "product",
          label: "Product",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
      ],
    },
    { type: "divider" },
    {
      key: "invoice",
      label: "Invoice",
      icon: (
        <MenuIcon>
          <PiInvoice />
        </MenuIcon>
      ),
      children: [
        {
          key: "invoice-outlet",
          label: "Outlet",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
        {
          key: "invoice-suplier",
          label: "Supplier",
          icon: (
            <MenuIcon>
              <PlusOutlined />
            </MenuIcon>
          ),
        },
      ],
    },
    { type: "divider" },
    {
      key: "profile",
      label: "My Profile",
      icon: (
        <MenuIcon>
          <FaUserCircle />
        </MenuIcon>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: (
        <MenuIcon>
          <MdLogout />
        </MenuIcon>
      ),
    },
  ];

  return (
    <Menu
      className="custom-sidebar"
      onClick={onClick}
      style={{ width: 256, height: "100vh" }}
      defaultSelectedKeys={["dashboard"]}
      mode="inline"
      items={items}
    />
  );
};

export default AdminSidebar;
