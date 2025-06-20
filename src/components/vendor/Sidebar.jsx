import React from 'react';
import { PullRequestOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import {  MdOutlineDashboard, MdOutlineInventory2, MdOutlineShoppingCart, MdLogout } from 'react-icons/md';
import { PiInvoice } from 'react-icons/pi';
import { FaUserCircle } from 'react-icons/fa';
import { LuScrollText } from 'react-icons/lu';
import './Sidebar.css';
const items = [
  {
    key: 'shopname',
    label: 'EMart Grocerry Shop',
    icon: <MdOutlineShoppingCart />,
    
  },
  {
    type: 'divider',
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <MdOutlineDashboard />,
      },
  {
      type: 'divider',
  },
  {
    key: 'request',
    label: 'Requests',
    icon: <PullRequestOutlined />,
  },
  {
      type: 'divider',
  },
  {
    key: 'outlet',
    label: 'Manage Outlet',
    icon: <MdOutlineInventory2 />,
  },
  {
      type: 'divider',
  },

  {
    key: 'billing',
    label: 'Billing',
    icon: <LuScrollText />
   
  },
  {
      type: 'divider',
  },
{
    key: 'invoice',
    label: 'Invoice',
    icon: <PiInvoice />
,
   
  },
  {
    type: 'divider',
  },
  {
    key: 'profile',
    label: 'My Profile',
    icon: <FaUserCircle />
    
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <MdLogout/>,
  }
];
const AdminSidebar = () => {
  
  const onClick = e => {
    console.log('click ', e);
  };
  return (
    <Menu
      className='custom-sidebar'
      onClick={onClick}
      style={{ width: 256, height: '100vh', position: 'fixed' }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default AdminSidebar;