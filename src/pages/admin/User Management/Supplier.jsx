import { Modal, Table, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MdOutlineAdd, MdOutlineEdit } from "react-icons/md";
import { useRecoilState } from "recoil";
import { supplierList } from "../../../atoms/sampleAtom";
import useAxios from "../../../hooks/useAxios/useAxios";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../../contexts/SnackbarContexts";
import uploadImage from "@/utils/uploadImage";

const { Option } = Select;

function Supplier() {
  const [suppliersList, setSuppliersList] = useRecoilState(supplierList);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supplierData, setSupplierData] = useState(getInitialFormState());
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { fetchData } = useAxios();
  const showSnackBar = useSnackbar();
  const token = localStorage.getItem("adminToken");

  function getInitialFormState() {
    return {
      id: "",
      logo: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      taxNumber: "",
      active: true,
    };
  }

  const resetForm = () => {
    setSupplierData(getInitialFormState());
    setIsEditing(false);
    setModalOpen(false);
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "/default-avatar.png"}
          alt="Supplier Logo"
          className="w-12 h-12 object-cover rounded-md"
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Tax Number", dataIndex: "taxNumber", key: "taxNumber" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <button
          className="p-2 text-lg text-[#fc4c4b] hover:text-red-800 cursor-pointer"
          onClick={() => {
            setSupplierData({
              id: record.id || "",
              logo: record.logo || "",
              name: record.name || "",
              email: record.email || "",
              phone: record.phone || "",
              address: record.address || "",
              taxNumber: record.taxNumber || "",
              active: record.active ?? true,
            });
            setIsEditing(true);
            setModalOpen(true);
          }}
        >
          <MdOutlineEdit />
        </button>
      ),
    },
  ];

  const getSuppliers = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "/admin/supplier",
        headers: { Authorization: `Bearer ${token}` },
        params: { timestamp: Date.now() },
      });

      if (response) {
        const formatted = response.map((supplier) => ({
          ...supplier,
          status: supplier.active ? "Active" : "Inactive",
        }));
        setSuppliersList(formatted);
      }
    } catch (error) {
      showSnackBar(error.message || "Failed to fetch suppliers", "error");
    }
  };

  const addOrEditSupplier = async () => {
    if (loading) {
      showSnackBar("Please wait for the logo to finish uploading", "error");
      return;
    }

    const { id, name, email, phone, address, taxNumber, active } = supplierData;

    try {
      setLoading(true);

      let logoUrl = supplierData.logo;

      if (imageFile) {
        logoUrl = await uploadImage("Supplier",imageFile);
      }

      const response = await fetchData({
        method: isEditing ? "PUT" : "POST",
        url: "/admin/supplier",
        data: {
          id,
          logo: logoUrl,
          name,
          email,
          phone,
          address,
          taxNumber,
          active: isEditing ? active : true,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response) {
        showSnackBar(
          isEditing
            ? "Supplier updated successfully"
            : "Supplier added successfully",
          "success"
        );
        getSuppliers();
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackBar(error.message || "Operation failed", "error");
    } finally {
      setLoading(false);
      setImageFile(null); // clear after upload
    }
  };

  const filteredSuppliers = suppliersList.filter((supplier) =>
    `${supplier.name} ${supplier.email} ${supplier.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <div>
      <h1 className="p-2 text-2xl font-bold">Suppliers</h1>

      <div className="flex justify-between gap-2 p-5">
        <input
          type="search"
          className="p-2 border-2 w-[30vw] border-gray-200 rounded-md"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search"
        />
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FC4C4B] text-white rounded-md"
        >
          Add New Supplier <MdOutlineAdd />
        </button>
      </div>

      <Modal
        title={isEditing ? "Edit Supplier" : "Add New Supplier"}
        centered
        open={modalOpen}
        onOk={addOrEditSupplier}
        onCancel={resetForm}
        okButtonProps={{
          style: { backgroundColor: "#fc4c4b" },
          loading,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium">Supplier Logo:</label>
            <div className="flex items-center gap-4">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                supplierData.logo && (
                  <img
                    src={supplierData.logo}
                    alt="Current"
                    className="w-32 h-32 object-cover rounded"
                  />
                )
              )}
              <Upload
                beforeUpload={(file) => {
                  setImageFile(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
          </div>

          {[
            ["Name", "name", "text"],
            ["Email", "email", "email"],
            ["Phone", "phone", "number"],
            ["Address", "address", "text"],
            ["Tax Number", "taxNumber", "text"],
          ].map(([label, field, type]) => (
            <div className="flex flex-col" key={field}>
              <label className="mb-1 font-medium">{label}:</label>
              <input
                type={type}
                placeholder={label}
                value={supplierData[field]}
                onChange={(e) =>
                  setSupplierData((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                className="p-2 border-2 border-gray-200 rounded-md"
              />
            </div>
          ))}

          {isEditing && (
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Status:</label>
              <Select
                value={supplierData.active ? "Active" : "Inactive"}
                onChange={(value) =>
                  setSupplierData((prev) => ({
                    ...prev,
                    active: value === "Active",
                  }))
                }
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          )}
        </div>
      </Modal>

      <div className="overflow-x-scroll mt-4">
        <Table
          dataSource={filteredSuppliers}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Supplier;
