import { Select } from "antd";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios/useAxios";

const DropDown = ({
  url,
  method,
  setter,
  globalState,
  setGlobalState,
  selectedValue,
}) => {
  const { fetchData } = useAxios();
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(selectedValue);

  useEffect(() => {
    console.log(selectedValue)
    const fetchDropDownData = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        let result =
          globalState.length === 0
            ? await fetchData({
                url,
                method,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            : globalState;

        if (globalState.length === 0) {
          console.log(url.split("/").pop(), result);
          setGlobalState(result);
        }

        const activeItems = result
          .filter((item) => item.active)
          .map((item) => ({
            label: item.name,
            value: item.id,
          }));
        console.log(url.split("/").pop(), activeItems);

        setOptions(activeItems);

        if (activeItems.length > 0) {
          if (selectedValue) {
            setSelected(selectedValue);
          }
          else {
            setSelected(activeItems[0].value);
            setter(activeItems[0].value);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDropDownData();
  }, []);

  const handleChange = (value) => {
    setSelected(value);
    setter(value);
  };

  return (
    <div>
      <label className="block mb-1 font-semibold">
        Select {url.split("/").pop()}
      </label>
      <Select
        placeholder="Select option"
        value={selected}
        onChange={handleChange}
        className="w-full"
        options={options}
      />
    </div>
  );
};

export default DropDown;
