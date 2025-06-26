import { PullRequestOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdLogout,
  MdMenu,
  MdClose,          // ← NEW: X-mark icon
} from "react-icons/md";
import { PiInvoice } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { LuScrollText } from "react-icons/lu";
import { authAtom } from "@/atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import MenuIcon from "@/components/MenuIcon";
import { useEffect, useState } from "react";

/* ------------ menu items ------------ */
const itemsBase = [
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

/* ------------ component ------------ */
const VendorSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { fetchData } = useAxios();
  const showSnackBar = useSnackbar();
  const [auth, setAuth] = useRecoilState(authAtom);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  /* --- watch width changes --- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile ? true : false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  /* --- logout --- */
  const handleLogout = async () => {
    try {
      const response = await fetchData({
        url: "/auth/logout",
        method: "POST",
        data: { accessToken: auth.tokenVendor },
      });

      if (response === "Logged out user successfully") {
        setAuth({ userName: "", password: "", isLoggedIn: false, tokenVendor: "" });
        localStorage.removeItem("vendorToken");
        navigate("/login");
        showSnackBar("You were logged out", "success");
      }
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.", "error");
    }
  };

  /* --- menu click --- */
  const onClick = ({ key }) => {
    if (key === "logout") return handleLogout();
    if (routeMap[key]) navigate(routeMap[key]);
  };

  const activeKey =
    Object.keys(routeMap).find((key) => routeMap[key] === pathname) ?? "dashboard";

  return (
    <div className="h-screen flex flex-col bg-white relative z-10">
      {/* Header */}
      <div
        className={`flex items-center justify-between sm:justify-center px-4 py-3
        text-white bg-[#7b0000] transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}
      >
        {/* Brand shows only when expanded */}
        {!collapsed && (
          <span className="text-sm font-semibold whitespace-nowrap">
            E-Mart Grocery Shop
          </span>
        )}

        {/* Toggle icon: X when collapsed, hamburger when expanded */}
        {collapsed ? (
          <MdMenu
            onClick={toggleCollapse}
            className="text-xl cursor-pointer sm:mx-auto md:hidden"
          />
          
        ) : (
          <MdClose
            onClick={toggleCollapse}
            className="text-xl cursor-pointer sm:mx-auto md:hidden"
          />
          
        )}
      </div>

      {/* Sidebar menu */}
      <Menu
        className="custom-sidebar"
        onClick={onClick}
        mode="inline"
        selectedKeys={[activeKey]}
        style={{
          width: collapsed ? 80 : 250,
          flex: 1,
          overflow: "auto",
        }}
        inlineCollapsed={!isMobile && collapsed}
        items={itemsBase}
      />
    </div>
  );
};

export default VendorSidebar;
