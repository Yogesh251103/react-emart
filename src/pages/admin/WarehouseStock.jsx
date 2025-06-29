import { useState } from "react";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import { InputNumber, Modal } from "antd";
import {
  productList,
  supplierInvoice,
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

  const setSupplierInvoiceList = useSetRecoilState(supplierInvoice);

  const [formWarehouseId, setFormWarehouseId] = useState(null);
  const [formProductId, setFormProductId] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { fetchData } = useAxios();
  const showSnackBar = useSnackbar();

  const handleModalCancel = () => {
    setModalOpen(false);
    setFormWarehouseId("");
    setFormProductId("");
    setStockQuantity(0);
    setManufactureDate("");
    setExpirationDate("");
  };

  const handleSaveStock = async () => {
    if (
      !formProductId ||
      !warehouseId ||
      stockQuantity <= 0 ||
      !manufactureDate ||
      !expirationDate
    ) {
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
        setFormWarehouseId(null);
        setStockQuantity(0);
        setManufactureDate("");
        setExpirationDate("");
        setWarehouseStockGlobal({});
        setSupplierInvoiceList((prev) => ({ ...prev, loaded: false }));

        setInput("")
      }
    } catch (error) {
      console.error(error);
      showSnackBar("Failed to save stock entry", "error");
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      showSnackBar("Select a CSV file to be uploaded", "error");
      return;
    }
    const isCSV = csvFile.type === "text/csv" || csvFile.name.endsWith(".csv");
    if (!isCSV) {
      showSnackBar("You can only upload CSV files!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    setUploading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetchData({
        url: "admin/warehouse/stock/upload-csv",
        method: "PUT",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      showSnackBar("Stocks updated successfully!", "success");
      setCsvModalOpen(false);
      setCsvFile(null);
    } catch (error) {
      console.error("Upload failed", error);
      showSnackBar("Stocks update failed!", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCSVUploadModalCancel = () => {
    setCsvFile(null);
    setCsvModalOpen(false);
    setUploading(false);
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
        <button
          onClick={() => setCsvModalOpen(true)}
          className="csv-add-button cursor-pointer"
        >
          <FileExcelOutlined />
          Upload CSV
        </button>
        <Modal
          title="Upload supplies as CSV file"
          centered
          open={csvModalOpen}
          onCancel={handleCSVUploadModalCancel}
          onOk={handleCSVUpload}
          confirmLoading={uploading}
          okText="Upload"
          destroyOnHidden
          okButtonProps={{ style: { backgroundColor: "#008236" } }}
        >
          <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} className="input"/>
        </Modal>
        <Modal
          title="Add Stock Entry"
          centered
          open={modalOpen}
          onOk={handleSaveStock}
          onCancel={handleModalCancel}
          destroyOnHidden
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

      <WarehouseStockTable warehouseId={warehouseId} productName={input}/>
    </div>
  );
};

export default WarehouseStock;
