import { PullRequestOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios/useAxios";
import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import { PiInvoice } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { LuScrollText } from "react-icons/lu";
import { useSnackbar } from "../../contexts/SnackbarContexts";
import MenuIcon from "../MenuIcon";

const items = [
  {
    key: "shopname",
    label: "EMart Grocerry Shop",
    icon: (
      <MenuIcon>
        <MdOutlineShoppingCart />
      </MenuIcon>
    ),
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <MenuIcon>
        <MdOutlineDashboard />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "request",
    label: "Requests",
    icon: (
      <MenuIcon>
        <PullRequestOutlined />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "outlet",
    label: "Manage Outlet",
    icon: (
      <MenuIcon>
        <MdOutlineInventory2 />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "billing",
    label: "Billing",
    icon: (
      <MenuIcon>
        <LuScrollText />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: (
      <MenuIcon>
        <PiInvoice />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "profile",
    label: "My Profile",
    icon: (
      <MenuIcon>
        <FaUserCircle />
      </MenuIcon>
    ),
  },
  {
    type: "divider",
  },
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

const VendorSidebar = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const { fetchData, error } = useAxios();
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

      console.log("Logout response:", response);

      if (response === "Logged out user successfully") {
        setAuth((prev) => ({
          ...prev,
          userName: "",
          password: "",
          isLoggedIn: false,
          tokenVendor: "",
        }));
        navigate("/login");
      }
      localStorage.removeItem("vendorToken");
      showSnackBar("You were logged out", "success");
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.", "error");
    }
  };

  const routeMap = {
    dashboard: "/",
    request: "/request",
    outlet: "/manage-outlet",
    billing: "/billing",
    invoice: "/invoice",
    profile: "/profile",
  };

  const onClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (routeMap[key]) {
      navigate(routeMap[key]);
    }
  };

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
export default VendorSidebar;
