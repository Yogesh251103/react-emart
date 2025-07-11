import { useRecoilState, useSetRecoilState } from "recoil";
import { outletList, warehouseAtom } from "../../../atoms/sampleAtom";
import OutletTable from "../../../components/admin/OutletTable";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios/useAxios";
import { useSnackbar } from "../../../contexts/SnackbarContexts";
import DropDown from "../../../components/admin/DropDown";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Select } from "antd";

const Outlet = () => {
  const [input, setInput] = useState("");
  const [outletId, setOutletId] = useState(null);
  const [outletFormData, setOutletFormData] = useState({
    name: "",
    address: "",
    active: true,
  });

  const [warehouseGlobal, setWarehouseGlobal] = useRecoilState(warehouseAtom);
  const setOutletList = useSetRecoilState(outletList);
  const [warehouseId, setWarehouseId] = useState(null);
  const [formWarehouseId, setFormWarehouseId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { error, fetchData } = useAxios();
  const showSnackBar = useSnackbar();

  const handleChange = (e) => {
    setOutletFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSaveOutlet = async () => {
    if (
      (isEditMode && (!outletFormData.id.trim() || !outletFormData.active)) ||
      !outletFormData.name.trim() ||
      !outletFormData.address.trim() ||
      !formWarehouseId
    ) {
      showSnackBar("Please fill in all required fields.", "error");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const payload = {
      ...outletFormData,
      warehouseId: formWarehouseId,
      ...(isEditMode && { id: outletId }),
    };

    const method = isEditMode ? "PUT" : "POST";
    const url = "/admin/outlet";

    const response = await fetchData({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });

    if (response) {
      setOutletList((prev) => {
        if (isEditMode) {
          return prev.map((item) =>
            item.id === response.id ? response : item
          );
        } else {
          return [...prev, response];
        }
      });

      showSnackBar(
        isEditMode
          ? "Outlet updated successfully"
          : "Outlet added successfully",
        "success"
      );
    }

    if (error) {
      showSnackBar(
        isEditMode ? "Outlet update failed" : "Outlet upload failed",
        "error"
      );
      return;
    }

    handleModalCancel();
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    if (isEditMode) {
      setIsEditMode(false);
      setOutletFormData({
        name: "",
        address: "",
        active: true,
      });
    }
  };

  return (
  <div className="flex flex-col p-4 sm:p-6 md:p-8">
    <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">Outlets</h1>

    {/* Top Input Row */}
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-10">
      <input
        type="text"
        className="input w-full sm:w-[30%]"
        placeholder="Enter outlet name here"
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="w-full sm:w-[30%]">
        <DropDown
          url="/admin/warehouse"
          method="GET"
          setter={setWarehouseId}
          globalState={warehouseGlobal}
          setGlobalState={setWarehouseGlobal}
        />
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full sm:w-auto add-button cursor-pointer flex items-center justify-center gap-2"
      >
        <PlusOutlined />
        Add new outlet
      </button>
    </div>

    {/* Modal */}
    <Modal
      title="Add New Outlet"
      centered
      open={modalOpen}
      onOk={handleSaveOutlet}
      onCancel={handleModalCancel}
      okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
    >
      <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto">
        <input
          type="text"
          className="p-2 border-2 border-gray-200 rounded-md w-full"
          placeholder="Outlet name"
          name="name"
          value={outletFormData.name}
          onChange={handleChange}
          required
        />

        <textarea
          className="p-2 border-2 border-gray-200 rounded-md w-full"
          placeholder="Outlet address"
          name="address"
          value={outletFormData.address}
          onChange={handleChange}
          required
        />

        <DropDown
          url="/admin/warehouse"
          method="GET"
          setter={setFormWarehouseId}
          globalState={warehouseGlobal}
          setGlobalState={setWarehouseGlobal}
          selectedValue={formWarehouseId}
        />

        {isEditMode && (
          <Select
            value={outletFormData.active ? "Active" : "Inactive"}
            onChange={(value) =>
              setOutletFormData((prev) => ({
                ...prev,
                active: value === "Active",
              }))
            }
            className="w-full"
          >
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        )}
      </div>
    </Modal>

    {/* Outlet Table */}
    <div className="overflow-x-auto">
      <OutletTable
        warehouseId={warehouseId}
        outletName={input}
        onEdit={(outlet) => {
          console.log(outlet);
          setOutletFormData(outlet);
          setFormWarehouseId(outlet.warehouseId);
          setModalOpen(true);
          setIsEditMode(true);
          setOutletId(outlet.id);
        }}
      />
    </div>
  </div>
);

};

export default Outlet;
