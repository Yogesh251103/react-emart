import { Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios/useAxios";

const WarehouseDropDown = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { response, error, loading, fetchData } = useAxios();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchWarehouseData = async () => {
      const response = await fetchData({
        url: "/admin/warehouse",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    };
    fetchWarehouseData();
  }, []);

  return (
    <Dropdown menu={{ menuItems }} arrow>
      <a onClick={(e) => e.preventDefault()}>
        <Space>Hover me</Space>
      </a>
    </Dropdown>
  );
};

export default WarehouseDropDown;
