import { PullRequestOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "@/hooks/useAxios/useAxios";
import { authAtom } from "@/atoms/sampleAtom";
import { useRecoilState } from "recoil";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import { PiInvoice } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { LuScrollText } from "react-icons/lu";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import MenuIcon from "@/components/MenuIcon";

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
    key: "outlet",
    label: "Manage Outlet",
    icon: (
      <MenuIcon>
        <MdOutlineInventory2 />
      </MenuIcon>
    ),
  },
  { type: "divider" },
  {
    key: "billing",
    label: "Billing",
    icon: (
      <MenuIcon>
        <LuScrollText />
      </MenuIcon>
    ),
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

const routeMap = {
  dashboard: "/",
  request: "/request",
  outlet: "/manage-outlet",
  billing: "/billing",
  invoice: "/invoice",
  profile: "/profile",
};

const VendorSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showSnackBar = useSnackbar();
  const { fetchData } = useAxios();
  const [auth, setAuth] = useRecoilState(authAtom);

  const handleLogout = async () => {
    try {
      const response = await fetchData({
        url: "/auth/logout",
        method: "POST",
        data: {
          accessToken: auth.tokenVendor,
        },
      });

      if (response === "Logged out user successfully") {
        setAuth({
          userName: "",
          password: "",
          isLoggedIn: false,
          tokenVendor: "",
        });
        localStorage.removeItem("vendorToken");
        navigate("/login");
        showSnackBar("You were logged out", "success");
      }
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.", "error");
    }
  };

  const onClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (routeMap[key]) {
      navigate(routeMap[key]);
    }
  };

  const selectedKey = Object.keys(routeMap).find(
    (key) => routeMap[key] === pathname
  );

  return (
    <Menu
      className="custom-sidebar"
      onClick={onClick}
      style={{ width: 256, height: "100vh" }}
      selectedKeys={[selectedKey]} 
      mode="inline"
      items={items}
    />
  );
};

export default VendorSidebar;
