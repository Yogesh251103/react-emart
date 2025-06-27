import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { InputNumber, Modal } from "antd";
import {
  productList,
  supplierInvoice,
  supplierList,
  warehouseAtom,
  warehouseStockList,
} from "@/atoms/sampleAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import WarehouseStockTable from "@/components/admin/WarehouseStockTable";
import DropDown from "@/components/admin/DropDown";

const WarehouseStock = () => {
  const [input, setInput] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [warehouseGlobal, setWarehouseGlobal] = useRecoilState(warehouseAtom);
  const setWarehouseStockGlobal = useSetRecoilState(warehouseStockList);
  const [productGlobal, setProductGlobal] = useRecoilState(productList);
  const [supplierGlobal, setSupplierGlobal] = useRecoilState(supplierList);

  const [supplierInvoiceList, setSupplierInvoiceList] =
    useRecoilState(supplierInvoice);
  const [formWarehouseId, setFormWarehouseId] = useState(null);
  const [formProductId, setFormProductId] = useState(null);
  const [formSupplierId, setFormSupplierId] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");
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
    // Validate all fields
    if (
      !formProductId ||
      !formSupplierId ||
      !warehouseId ||
      stockQuantity <= 0 ||
      !manufactureDate ||
      !expirationDate
    ) {
      console.log(
        "product_id:" + formProductId,
        "supplier id:" + formSupplierId,
        "warehouse id:" + warehouseId,
        "quantity:" + stockQuantity,
        "manufactire :" + manufactureDate,
        "expiration :" + expirationDate
      );
      showSnackBar("All fields must be filled correctly", "error");
      return;
    }

    const mfg = new Date(manufactureDate);
    const exp = new Date(expirationDate);
    if (mfg >= exp) {
      showSnackBar("Expiry date must be after manufacture date", "error");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const now = new Date();

    const payload = {
      productDTO: { id: formProductId },
      supplierDTO: { id: formSupplierId },
      warehouseDTO: { id: warehouseId },
      quantity: stockQuantity,
      date: now.toISOString(),
      manufactureDate: new Date(manufactureDate).toISOString(),
      expiryDate: new Date(expirationDate).toISOString(),
    };

    try {
      const response = await fetchData({
        method: "PUT",
        url: "/admin/warehouse/stock",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      if (response) {
        showSnackBar("Stock entry added successfully", "success");
        setModalOpen(false);

        setFormProductId(null);
        setFormSupplierId(null);
        setWarehouseId(null);
        setStockQuantity(0);
        setManufactureDate("");
        setExpirationDate("");
        setWarehouseGlobal
        setWarehouseStockGlobal({})
        setSupplierInvoiceList((prev)=>({...prev,loaded:false}));
      }
    } catch (error) {
      console.error(error);
      showSnackBar("Failed to save stock entry", "error");
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
          destroyOnClose={true}
          okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
        >
          <div className="flex flex-col gap-2">
            <DropDown
              url="/admin/product"
              method="GET"
              setter={setFormProductId}
              globalState={productGlobal}
              setGlobalState={setProductGlobal}
              selectedValue={formProductId}
            />
            <DropDown
              url="/admin/supplier"
              method="GET"
              setter={setFormSupplierId}
              globalState={supplierGlobal}
              setGlobalState={setSupplierGlobal}
              selectedValue={formSupplierId}
            />
            <DropDown
              url="/admin/warehouse"
              method="GET"
              setter={setFormWarehouseId}
              globalState={warehouseGlobal}
              setGlobalState={setWarehouseGlobal}
              selectedValue={formWarehouseId}
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
