import { Dropdown, Space } from "antd";
import { useEffect } from "react";
import useAxios from "../../hooks/useAxios/useAxios";

const DropDown = ({ url, method, setter, globalState, setGlobalState }) => {
  const { fetchData } = useAxios();
  const splittedURL = url.split("/");
  const filterName = splittedURL[splittedURL.length - 1];

  useEffect(() => {
    const fetchDropDownData = async () => {
      if (globalState.length > 0) return;
      const token = localStorage.getItem("adminToken");
      try {
        const result = await fetchData({
          url,
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const items = result
          .filter((item) => item.active)
          .map((item) => ({
            key: item.id,
            label: item.name,
          }));
        setGlobalState(items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDropDownData();
  }, []);

  const handleItemClick = (e) => {
    setter((prev) => (prev === e.key ? "" : e.key));
  };

  return (
    <Dropdown
      menu={{ items: globalState, onClick: handleItemClick }}
      arrow
      className="border rounded p-3"
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>{filterName}</Space>
      </a>
    </Dropdown>
  );
};

export default DropDown;
