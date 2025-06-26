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
  <div className="flex flex-col px-4 sm:px-6 md:px-8 py-6">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Products</h1>

    {/* Top control section */}
    <div className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center justify-between pb-10">
      <input
        type="text"
        className="input w-full sm:w-[30%]"
        placeholder="Enter product name here"
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="w-full sm:w-[30%]">
        <DropDown
          url="/admin/supplier"
          method="GET"
          setter={setSupplierId}
          globalState={suppliers}
          setGlobalState={setSuppliers}
        />
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-[#8a0000] text-white rounded-md"
      >
        <PlusOutlined />
        Add new product
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
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Currency"
          name="currency"
          value={productFormData.currency}
          onChange={handleChange}
          required
        />

        <label htmlFor="manufacture_date">Manufacture date</label>
        <input
          type="date"
          className="p-2 border-2 border-gray-200 rounded-md"
          name="manufacture_date"
          value={productFormData.manufacture_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="expiration_date">Expiration date</label>
        <input
          type="date"
          className="p-2 border-2 border-gray-200 rounded-md"
          name="expiration_date"
          value={productFormData.expiration_date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Image URL"
          name="image"
          value={productFormData.image}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Product Name"
          name="name"
          value={productFormData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.01"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Price"
          name="price"
          value={productFormData.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Category"
          name="category"
          value={productFormData.category}
          onChange={handleChange}
        />

        <textarea
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Description"
          name="description"
          value={productFormData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          className="p-2 border-2 border-gray-200 rounded-md"
          placeholder="Threshold"
          name="threshold"
          value={productFormData.threshold}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.01"
          className="p-2 border-2 border-gray-200 rounded-md"
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
