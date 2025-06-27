import { useState } from "react";
import DropDown from "../../../components/admin/DropDown";
import { PlusOutlined } from "@ant-design/icons";
import ProductTable from "../../../components/admin/ProductTable";
import { Modal } from "antd";
import { productList, supplierList } from "../../../atoms/sampleAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import useAxios from "../../../hooks/useAxios/useAxios";
import { useSnackbar } from "../../../contexts/SnackbarContexts";

const Product = () => {
  const [input, setInput] = useState("");
  const [productId, setProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    currency: "",
    manufacture_date: "",
    expiration_date: "",
    name: "",
    image: "",
    price: "",
    supplier_id: "",
    category: "",
    description: "",
    threshold: "",
    wholesale_price: "",
  });

  const [suppliers, setSuppliers] = useRecoilState(supplierList);
  const setProductList = useSetRecoilState(productList);
  const [supplierId, setSupplierId] = useState("");
  const [formSupplierId, setFormSupplierId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { error, fetchData } = useAxios();
  const showSnackBar = useSnackbar();

  console.log(formSupplierId);

  const handleChange = (e) => {
    setProductFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setProductFormData({
      currency: "",
      manufacture_date: "",
      expiration_date: "",
      name: "",
      image: "",
      price: "",
      supplier_id: "",
      category: "",
      description: "",
      threshold: "",
      wholesale_price: "",
    });
    setFormSupplierId("");
  };

  const handleSaveProduct = async () => {
    const {
      currency,
      manufacture_date,
      expiration_date,
      name,
      price,
      threshold,
      image,
    } = productFormData;

    if (
      (isEditMode && !productId.trim()) ||
      !currency.trim() ||
      !manufacture_date || // need to send manufacture and expiration date from backend
      !expiration_date ||
      !name.trim() ||
      !price ||
      !threshold ||
      !image.trim() ||
      !formSupplierId
    ) {
      console.log(
        currency,
        manufacture_date,
        expiration_date,
        name,
        price,
        threshold,
        image,
        formSupplierId
      );
      showSnackBar("Please fill all required fields", "error");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const payload = {
      ...productFormData,
      supplierId: formSupplierId,
      ...(isEditMode && { id: productId }),
    };

    const method = isEditMode ? "PUT" : "POST";
    const url = "/admin/product";

    const response = await fetchData({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });

    if (response) {
      setProductList((prev) => {
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
          ? "Product updated successfully"
          : "Product added successfully",
        "success"
      );
    }

    if (error) {
      showSnackBar(
        isEditMode ? "Product update failed" : "Product upload failed",
        "error"
      );
      return;
    }

    handleModalCancel();
  };

return (
  <div className="p-4">
    {/* Title */}
    <h1 className="text-lg sm:text-2xl font-bold text-[#8a0000] mb-6">Products</h1>

    {/* Controls */}
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center sm:gap-4 gap-3 pb-6">
      <input
        type="text"
        className="input flex-1"
        placeholder="Enter product name here"
        onChange={(e) => setInput(e.target.value)}
      />

      <DropDown
        url="/admin/supplier"
        method="GET"
        setter={setSupplierId}
        globalState={suppliers}
        setGlobalState={setSuppliers}
      />

      <button
        onClick={() => setModalOpen(true)}
        className="add-button flex items-center justify-center gap-2"
      >
        <PlusOutlined />
        <span className="hidden sm:inline">Add new product</span>
      </button>
    </div>

    {/* Modal */}
    <Modal
      title={isEditMode ? "Edit Product" : "Add New Product"}
      centered
      open={modalOpen}
      onOk={handleSaveProduct}
      onCancel={handleModalCancel}
      okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="input"
          placeholder="Currency"
          name="currency"
          value={productFormData.currency}
          onChange={handleChange}
        />

        <label htmlFor="manufacture_date">Manufacture date</label>
        <input
          type="date"
          id="manufacture_date"
          className="input"
          name="manufacture_date"
          value={productFormData.manufacture_date}
          onChange={handleChange}
        />

        <label htmlFor="expiration_date">Expiration date</label>
        <input
          type="date"
          id="expiration_date"
          className="input"
          name="expiration_date"
          value={productFormData.expiration_date}
          onChange={handleChange}
        />

        <input
          type="text"
          className="input"
          placeholder="Image URL"
          name="image"
          value={productFormData.image}
          onChange={handleChange}
        />

        <input
          type="text"
          className="input"
          placeholder="Product Name"
          name="name"
          value={productFormData.name}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          className="input"
          placeholder="Price"
          name="price"
          value={productFormData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          className="input"
          placeholder="Category"
          name="category"
          value={productFormData.category}
          onChange={handleChange}
        />

        <textarea
          className="input"
          placeholder="Description"
          name="description"
          value={productFormData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          className="input"
          placeholder="Threshold"
          name="threshold"
          value={productFormData.threshold}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          className="input"
          placeholder="Wholesale Price"
          name="wholesale_price"
          value={productFormData.wholesale_price}
          onChange={handleChange}
        />

        <DropDown
          url="/admin/supplier"
          method="GET"
          setter={setFormSupplierId}
          globalState={suppliers}
          setGlobalState={setSuppliers}
          selectedValue={formSupplierId}
        />
      </div>
    </Modal>

    {/* Product Table */}
    <ProductTable
      supplierId={supplierId}
      productName={input}
      onEdit={(product) => {
        setProductFormData(product);
        setFormSupplierId(product.supplierId);
        setProductId(product.id);
        setModalOpen(true);
        setIsEditMode(true);
      }}
    />
  </div>
);

};

export default Product;