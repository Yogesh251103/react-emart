import React from 'react';
import { WindowsOutlined,PullRequestOutlined, ShoppingCartOutlined, DropboxOutlined, UserSwitchOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { MdOutlineSupervisedUserCircle,MdOutlineDashboard, MdOutlineInventory2, MdOutlineShoppingCart } from 'react-icons/md';
import { PiInvoice } from 'react-icons/pi';
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
    key: 'inventory',
    label: 'Inventory',
    icon: <MdOutlineInventory2 />,
  },
  {
      type: 'divider',
  },

  {
    key: 'user',
    label: 'User Management',
    icon: <MdOutlineSupervisedUserCircle />,
    children: [
      { key: 'warehouse', label: 'Warehouse', icon: <PlusOutlined /> },
      { key: 'outlet', label: 'Outlet', icon: <PlusOutlined /> },
      { key: 'suplier', label: 'Supplier', icon: <PlusOutlined /> },
      
    ],
  },
  {
      type: 'divider',
  },
{
    key: 'invoice',
    label: 'Invoice',
    icon: <PiInvoice />
,
    children: [

      { key: 'outlet', label: 'Outlet', icon: <PlusOutlined /> },
      { key: 'suplier', label: 'Supplier', icon: <PlusOutlined /> },
      
    ],
  },
  {
    type: 'divider',
  },
];
const AdminSidebar = () => {
  const onClick = e => {
    console.log('click ', e);
  };
  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default AdminSidebar;