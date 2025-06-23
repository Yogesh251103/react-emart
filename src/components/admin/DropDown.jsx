import { Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios/useAxios";

const DropDown = ({ url, method, setter }) => {
  console.log("URL:", url, "Method:", method);
  const [menuItems, setMenuItems] = useState([]);
  const { response, error, loading, fetchData } = useAxios();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchDropDownData = async () => {
      const result = await fetchData({
        url: url,
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredResponse = response
        .filter((item) => item.active)
        .map((item) => ({
          key: item.id,
          label: item.name,
        }));
      setMenuItems(filteredResponse);
    };
    fetchDropDownData();
  }, []);

  const handleItemClick = (e) => {
      setter(e.key);
  }

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleItemClick }} arrow>
      <a onClick={(e) => e.preventDefault()}>
        <Space>{menuItems.length > 0 ? menuItems[0].label : ""}</Space>
      </a>
    </Dropdown>
  );
};

export default DropDown;
