import { Dropdown, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios/useAxios";

const DropDown = ({ url, method, setter, globalState, setGlobalState }) => {
  const { fetchData } = useAxios();
  const [menuItems, setMenuItems] = useState([]);
  const [filterName, setFilterName] = useState(url.split("/").pop());
  const [selectedKey, setSelectedKey] = useState(null);

  const setDropDownItems = (items) => {
    console.log(items)
    const filteredItems = items.filter((item) => item.active)
      .map((item) => ({
        key: item.id,
        label: item.name,
      }));
      console.log(filteredItems)
    setMenuItems(filteredItems);
  };

  useEffect(() => {
    const fetchDropDownData = async () => {
      if (globalState.length === 0) {
        const token = localStorage.getItem("adminToken");
        try {
          const result = await fetchData({
            url,
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(result)
          setDropDownItems(result);
          setGlobalState(result);
        } catch (error) {
          console.error(error);
        }
        return;
      }
      setDropDownItems(globalState);
    };
    fetchDropDownData();
  }, []);

  const handleItemClick = ({ key }) => {
    if (key === selectedKey) {
      setSelectedKey(null);
      setter("");
      setFilterName(url.split("/").pop());
    } else {
      setSelectedKey(key);
      setter(key);
      const selectedItem = globalState.find((item) => item.id === key);
      setFilterName(selectedItem?.name || url.split("/").pop());
    }
  };

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleItemClick,
        selectable: true,
        selectedKeys: selectedKey ? [selectedKey] : [],
      }}
      arrow
      className="border rounded p-3 cursor-pointer"
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>{filterName}</Space>
      </a>
    </Dropdown>
  );
};

export default DropDown;
