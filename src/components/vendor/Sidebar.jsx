import {PullRequestOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios/useAxios';
import { authAtom } from '../../atoms/sampleAtom';
import { useRecoilState,useRecoilValue } from 'recoil';
import {MdOutlineDashboard, MdOutlineInventory2, MdOutlineShoppingCart, MdLogout } from 'react-icons/md';
import { PiInvoice } from 'react-icons/pi';
import { FaUserCircle } from 'react-icons/fa';
import { LuScrollText } from 'react-icons/lu';
import './Sidebar.css';
const items = [
  {
    key: "shopname",
    label: "EMart Grocerry Shop",
    icon: <MdOutlineShoppingCart />,
    disabled: true
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
    key: "outlet",
    label: "Manage Outlet",
    icon: <MdOutlineInventory2 />,
  },
  {
    type: "divider",
  },

  {
    key: "billing",
    label: "Billing",
    icon: <LuScrollText />,
  },
  {
    type: "divider",
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: <PiInvoice />,
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
const VendorSidebar = () => {
  const navigate = useNavigate();
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

      console.log("Logout response:", response);

      if(
        response === "Logged out user successfully"
      ){
        setAuth((prev)=>({
          ...prev,
          userName: "",
          password: "",
          isLoggedIn: false,
          tokenVendor: ""
        }))
        navigate("/login")
      }
      localStorage.removeItem("vendorToken");
      alert("You have been logged out")
      
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  };

  const routeMap = {
    dashboard: "/",
    request: "/request",
    outlet : "/manage-outlet",
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
      defaultSelectedKeys={["shopname"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};
export default VendorSidebar;
