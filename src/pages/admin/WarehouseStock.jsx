import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { InputNumber, Modal } from "antd";
import { productList, supplierList, warehouseAtom } from "@/atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import WarehouseStockTable from "@/components/admin/WarehouseStockTable";
import DropDown from "@/components/admin/DropDown";

const WarehouseStock = () => {
  const [input, setInput] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [warehouseGlobal, setWarehouseGlobal] = useRecoilState(warehouseAtom);
  const [productGlobal, setProductGlobal] = useRecoilState(productList);
  const [supplierGlobal, setSupplierGlobal] = useRecoilState(supplierList);

  const [formWarehouseId, setFormWarehouseId] = useState("");
  const [formProductId, setFormProductId] = useState("");
  const [formSupplierId, setFormSupplierId] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [manufactureDate, setManufactureDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const { fetchData, error } = useAxios();
  const showSnackBar = useSnackbar();

  const handleModalCancel = () => {
    setModalOpen(false);
    setFormWarehouseId("");
    setFormProductId("");
    setFormSupplierId("");
    setStockQuantity(0);
    setManufactureDate("");
    setExpirationDate("");
  };

  const handleSaveStock = async () => {
    if (
      !formProductId ||
      !formSupplierId ||
      !formWarehouseId ||
      !stockQuantity ||
      !manufactureDate ||
      !expirationDate
    ) {
      console.log(payload);
      showSnackBar("Please fill all required fields", "error");
      return;
    }

    const token = localStorage.getItem("adminToken");

    const payload = {
      productDTO: { id: formProductId },
      supplierDTO: { id: formSupplierId },
      warehouseDTO: { id: formWarehouseId },
      date: dayjs().toISOString(), // current timestamp with offset
      manufactureDate: dayjs(manufactureDate).toISOString(),
      expiryDate: dayjs(expirationDate).toISOString(),
      quantity: stockQuantity,
    };
    const response = await fetchData({
      url: "/admin/warehouse/stock",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });

    if (response) {
      showSnackBar("Supply added successfully", "success");
      handleModalCancel();
    } else if (error) {
      showSnackBar("Failed to add supply", "error");
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="h1">Warehouse Stocks</h1>
      <div className="w-full flex flex-wrap gap-4 items-center justify-between pb-10">
        <input
          type="text"
          className="input"
          placeholder="Enter product name here"
          onChange={(e) => setInput(e.target.value)}
        />
        <DropDown
          url="/admin/warehouse"
          method="GET"
          setter={setWarehouseId}
          globalState={warehouseGlobal}
          setGlobalState={setWarehouseGlobal}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="add-button cursor-pointer"
        >
          <PlusOutlined />
          Add Stock Entry
        </button>
        <Modal
          title="Add Stock Entry"
          centered
          open={modalOpen}
          onOk={handleSaveStock}
          onCancel={handleModalCancel}
          okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
        >
          <div className="flex flex-col gap-2">
            <DropDown
              url="/admin/product"
              method="GET"
              setter={setFormProductId}
              globalState={productGlobal}
              setGlobalState={setProductGlobal}
            />
            <DropDown
              url="/admin/supplier"
              method="GET"
              setter={setFormSupplierId}
              globalState={supplierGlobal}
              setGlobalState={setSupplierGlobal}
            />
            <DropDown
              url="/admin/warehouse"
              method="GET"
              setter={setFormWarehouseId}
              globalState={warehouseGlobal}
              setGlobalState={setWarehouseGlobal}
            />

            <InputNumber
              min={1}
              placeholder="Quantity"
              value={stockQuantity}
              onChange={setStockQuantity}
              className="w-full"
            />

            <label htmlFor="manufacture_date">Manufacture Date</label>
            <input
              type="date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
              required
            />

            <label htmlFor="expiration_date">Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </div>
        </Modal>
      </div>

      <WarehouseStockTable warehouseId={warehouseId} productName={input} />
    </div>
  );
};

export default WarehouseStock;
