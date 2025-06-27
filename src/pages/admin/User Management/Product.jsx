import { useState } from "react";
import DropDown from "../../../components/admin/DropDown";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ProductTable from "../../../components/admin/ProductTable";
import { Modal, Select, Upload, Button } from "antd";
import { productList, supplierList } from "../../../atoms/sampleAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import useAxios from "../../../hooks/useAxios/useAxios";
import { useSnackbar } from "../../../contexts/SnackbarContexts";
import uploadImage from "@/utils/uploadImage";

const unitOptions = ["kg", "ltr", "pcs", "box", "g", "ml"];
const categoryOptions = [
  "Vegetables",
  "Fruits",
  "Dairy Products",
  "Bakery Items",
  "Beverages",
  "Snacks",
  "Grains",
  "Spices",
  "Personal Care",
  "Household Items",
];

const Product = () => {
  const [input, setInput] = useState("");
  const [productId, setProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    currency: "",
    unit: "",
    name: "",
    image: "",
    price: "",
    supplier_id: "",
    category: "",
    description: "",
    threshold: "",
    wholesalePrice: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useRecoilState(supplierList);
  const setProductList = useSetRecoilState(productList);
  const [supplierId, setSupplierId] = useState("");
  const [formSupplierId, setFormSupplierId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { error, fetchData } = useAxios();
  const showSnackBar = useSnackbar();

  const handleChange = (e) => {
    setProductFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setProductFormData({
      currency: "",
      name: "",
      image: "",
      price: "",
      unit: "",
      supplier_id: "",
      category: "",
      description: "",
      threshold: "",
      wholesalePrice: "",
    });
    setImageFile(null);
    setFormSupplierId("");
    setLoading(false);
  };

  const handleSaveProduct = async () => {
    const {
      currency,
      name,
      price,
      threshold,
      unit,
      category,
      description,
      wholesalePrice,
    } = productFormData;
    console.log(productFormData);
    if (
      (isEditMode && !productId?.trim()) ||
      !currency.trim() ||
      !name.trim() ||
      !price ||
      !threshold ||
      !unit ||
      !category.trim() ||
      !description.trim() ||
      !formSupplierId
    ) {
      showSnackBar("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    let finalImageUrl = productFormData.image;
    if (imageFile) {
      finalImageUrl = await uploadImage("product", imageFile);
    }

    const token = localStorage.getItem("adminToken");
    const payload = {
      ...productFormData,
      image: finalImageUrl,
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

    setLoading(false);

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
      <h1 className="text-lg sm:text-2xl font-bold text-[#8a0000] mb-6">
        Products
      </h1>

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

      <Modal
        title={isEditMode ? "Edit Product" : "Add New Product"}
        centered
        open={modalOpen}
        onOk={handleSaveProduct}
        onCancel={handleModalCancel}
        okButtonProps={{ style: { backgroundColor: "#FC4C4B" }, loading }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="flex flex-col gap-4">
          <Select
            className="p-4 border rounded-md"
            placeholder="Select Currency"
            value={productFormData.currency || undefined}
            onChange={(value) =>
              setProductFormData((prev) => ({ ...prev, currency: value }))
            }
            options={[{ label: "INR", value: "INR" }]}
          />

          <Select
            className="p-4 border rounded-md"
            placeholder="Select Unit"
            value={productFormData.unit || undefined}
            onChange={(value) =>
              setProductFormData((prev) => ({ ...prev, unit: value }))
            }
            options={unitOptions.map((u) => ({ label: u, value: u }))}
          />

          <Upload
            beforeUpload={(file) => {
              setImageFile(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>

          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          ) : (
            productFormData.image && (
              <img
                src={productFormData.image}
                alt="Current"
                className="w-32 h-32 object-cover rounded"
              />
            )
          )}

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

          <Select
            className="p-4 border rounded-md"
            placeholder="Select Category"
            value={productFormData.category || undefined}
            onChange={(value) =>
              setProductFormData((prev) => ({ ...prev, category: value }))
            }
            options={categoryOptions.map((c) => ({ label: c, value: c }))}
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
            name="wholesalePrice"
            value={productFormData.wholesalePrice}
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

      <ProductTable
        supplierId={supplierId}
        productName={input}
        onEdit={(product) => {
          setProductFormData({
            ...product,
            wholesalePrice: parseInt(product.wholesale_price),
          });
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
