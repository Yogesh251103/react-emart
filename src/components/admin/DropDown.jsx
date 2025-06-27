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

  const resourceType = url.split("/").pop();

  useEffect(() => {
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

        const formattedData = result.map((item) => ({
          label: item.name,
          value: item.id,
          active: item?.id,
        }));

        const activeItems = formattedData.filter((item) => item.active);
        setOptions(resourceType === "product" ? formattedData : activeItems);

        // if (resourceType === "product" && formattedData.length > 0) {
        //   if (selectedValue) {
        //     setSelected(selectedValue);
        //   } else {
        //     setSelected(formattedData[0].value);
        //     setter(formattedData[0].value);
        //   }
        //   return;
        // }

        if (activeItems.length > 0) {
          if (selectedValue) {
            setSelected(selectedValue);
          } else {
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
        Select {resourceType}
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
