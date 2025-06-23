import { useState } from "react";
import DropDown from "../../../components/admin/DropDown";
import { PlusOutlined } from "@ant-design/icons";
import CustomTable from "../../../components/admin/Table";
import { Modal } from "antd";
import { productList, supplierList } from "../../../atoms/sampleAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import useAxios from "../../../hooks/useAxios/useAxios";
import { useSnackbar } from "../../../contexts/SnackbarContexts";

const Product = () => {
  const [input, setInput] = useState("");
  const [productFormData, setProductFormData] = useState({
    currency: "",
    manufacture_date: "",
    expiration_date: "",
    name: "",
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
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleSaveProduct = async () => {
    const token = localStorage.getItem("adminToken");
    const payload = {
      ...productFormData,
      supplierId: formSupplierId,
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

    setModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
    setProductFormData({
      currency: "",
      manufacture_date: "",
      expiration_date: "",
      name: "",
      price: "",
      supplier_id: "",
      category: "",
      description: "",
      threshold: "",
      wholesale_price: "",
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="h1">Products</h1>
      <div className="w-full flex items-center justify-around pb-10">
        <input
          type="text"
          className="input"
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
          className="add-button cursor-pointer"
        >
          <PlusOutlined />
          Add new product
        </button>
        <Modal
          title="Add New Product"
          centered
          open={modalOpen}
          onOk={handleSaveProduct}
          onCancel={() => setModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="p-2 border-2 border-gray-200 rounded-md"
              placeholder="Currency"
              name="currency"
              value={productFormData.currency}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              className="p-2 border-2 border-gray-200 rounded-md"
              placeholder="Expiration Date"
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
              type="date"
              className="p-2 border-2 border-gray-200 rounded-md"
              placeholder="Manufacture Date"
              name="manufacture_date"
              value={productFormData.manufacture_date}
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
      </div>
      <CustomTable
        supplierId={supplierId}
        productName={input}
        onEdit={(product) => {
          setEditingProduct(product);
          setProductFormData(product);
          setFormSupplierId(product.supplierId);
          setModalOpen(true);
          setIsEditMode(true);
        }}
      />
    </div>
  );
};

export default Product;
