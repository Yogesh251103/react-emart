import { PullRequestOutlined, PlusOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdOutlineSupervisedUserCircle,
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdLogout,
  MdOutlineWarehouse,
  MdMenu,
  MdClose,                 // NEW: close (X) icon
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoice, FaShop } from "react-icons/fa6";
import { BsPersonVcardFill } from "react-icons/bs";
import { useRecoilState } from "recoil";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import { authAtom } from "@/atoms/sampleAtom";
import MenuIcon from "@/components/MenuIcon";
import { useEffect, useState } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showSnackBar = useSnackbar();
  const { fetchData } = useAxios();
  const [auth, setAuth] = useRecoilState(authAtom);

  /* ------------ state ------------ */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [showUserSubmenu, setShowUserSubmenu] = useState(false);
  const [showInvoiceSubmenu, setShowInvoiceSubmenu] = useState(false);

  /* ------------ handle window resize ------------ */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);        // always collapsed on phones
      } else {
        setCollapsed(false);       // auto-expand on ≥768 px
        setShowUserSubmenu(false);
        setShowInvoiceSubmenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => setCollapsed(prev => !prev);

  /* ------------ routing ------------ */
  const routeMap = {
    dashboard: "/admin",
    inventory: "/admin/inventory",
    request: "/admin/request",
    warehouse: "/admin/warehouse",
    "user-outlet": "/admin/user-management/outlet",
    "user-suplier": "/admin/user-management/supplier",
    "user-vendor": "/admin/user-management/vendor",
    product: "/admin/user-management/product",
    "invoice-outlet": "/admin/invoice/outlet",
    "invoice-suplier": "/admin/invoice/supplier",
    profile: "/admin/profile",
  };
  const activeKey =
    Object.keys(routeMap).find(key => routeMap[key] === pathname) ?? "dashboard";

  /* ------------ logout ------------ */
  const handleLogout = async () => {
    try {
      await fetchData({
        url: "/auth/logout",
        method: "POST",
        data: { accessToken: auth.tokenAdmin },
      });

      setAuth({
        userName: "",
        password: "",
        isLoggedIn: false,
        tokenAdmin: "",
      });
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      showSnackBar("You were logged out", "success");
    } catch (err) {
      console.error("Logout error:", err);
      showSnackBar("Something went wrong during logout.", "error");
    }
  };

  /* ------------ menu click handler ------------ */
  const onClick = ({ key }) => {
    if (key === "logout") return handleLogout();

    // phone-view pop-up sub-menus
    if (isMobile && collapsed) {
      if (key === "user") {
        setShowUserSubmenu(prev => !prev);
        setShowInvoiceSubmenu(false);
        return;
      }
      if (key === "invoice") {
        setShowInvoiceSubmenu(prev => !prev);
        setShowUserSubmenu(false);
        return;
      }
    }

    // navigate
    if (routeMap[key]) {
      setShowUserSubmenu(false);
      setShowInvoiceSubmenu(false);
      navigate(routeMap[key]);
    }
  };

  /* ------------ antd menu items ------------ */
  const items = [
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
      children: !collapsed
        ? [
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
              key: "user-vendor",
              label: "Vendor",
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
          ]
        : undefined,
    },
    { type: "divider" },
    {
      key: "invoice",
      label: "Invoice",
      icon: (
        <MenuIcon>
          <FaFileInvoice />
        </MenuIcon>
      ),
      children: !collapsed
        ? [
            {
              key: "invoice-outlet",
              label: "Outlet",
              icon: (
                <MenuIcon>
                  <FaShop />
                </MenuIcon>
              ),
            },
            {
              key: "invoice-suplier",
              label: "Supplier",
              icon: (
                <MenuIcon>
                  <BsPersonVcardFill />
                </MenuIcon>
              ),
            },
          ]
        : undefined,
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

  /* ------------ render ------------ */
  return (
    <div className="h-screen flex flex-col bg-white relative z-10">
      {/* Header */}
      <div
        className={`flex items-center justify-between sm:justify-center px-4 py-3
        text-white bg-[#7b0000] transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}
      >
        {/* Brand text only when expanded */}
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
        items={items}
      />

      {/* Pop-up sub-menus: phone view + collapsed */}
      {isMobile && collapsed && showUserSubmenu && (
        <div className="absolute top-[280px] left-[80px] w-48 bg-white border shadow-xl rounded-md z-50">
          {["user-outlet", "user-vendor", "user-suplier"].map((key, i) => (
            <div
              key={key}
              onClick={() => onClick({ key })}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <PlusOutlined className="mr-2" />
              {["Outlet", "Vendor", "Supplier"][i]}
            </div>
          ))}
        </div>
      )}

      {isMobile && collapsed && showInvoiceSubmenu && (
        <div className="absolute top-[360px] left-[80px] w-48 bg-white border shadow-xl rounded-md z-50">
          <div
            onClick={() => onClick({ key: "invoice-outlet" })}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <FaShop className="mr-2" /> Outlet
          </div>
          <div
            onClick={() => onClick({ key: "invoice-suplier" })}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <BsPersonVcardFill className="mr-2" /> Supplier
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
