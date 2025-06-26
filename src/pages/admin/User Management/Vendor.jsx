import { outletList } from "@/atoms/sampleAtom";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import useAxios from "@/hooks/useAxios/useAxios";
import { Table, Modal, Select, Upload, Button } from "antd";
import React, { useEffect, useState } from "react";
import { MdOutlineAdd, MdOutlineEdit } from "react-icons/md";
import { useRecoilState } from "recoil";
import DropDown from "@/components/admin/DropDown";
import uploadImage from "@/utils/uploadImage";
const { Option } = Select;
import { UploadOutlined } from "@ant-design/icons";

function Vendor() {
  const { fetchData, loading } = useAxios();
  const token = localStorage.getItem("adminToken");
  const showSnackBar = useSnackbar();
  const [outletId, setOutletId] = useState("");

  const [outletsList, setOutletsList] = useRecoilState(outletList);
  const [vendorList, setVendorList] = useState([]);
  const [vendorData, setVendorData] = useState({
    id: "",
    username: "",
    password: "",
    image: "",
    name: "",
    email: "",
    phone: "",
    outletId: "",
    active: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getVendors();
  }, []);

  const getVendors = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "admin/outlet/vendor",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        const formatted = response.map((vendor) => ({
          ...vendor,
          status: vendor.active ? "Active" : "Inactive",
          image: vendor.image || vendor.logo || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
        }));
        setVendorList(formatted);
      }
    } catch (error) {
      showSnackBar(error.message, "error");
    }
  };

  const resetForm = () => {
    setVendorData({
      id: "",
      username: "",
      password: "",
      image: "",
      name: "",
      email: "",
      phone: "",
      outletId: "",
      active: true,
    });
    setIsEditing(false);
    setModalOpen(false);
    setOutletId("");
  };

  const addOrEditVendor = async () => {
    const { image, name, email, phone, username, password, active, outletId } =
      vendorData;

    if (
      !image ||
      !name ||
      !email ||
      !phone ||
      !username ||
      (!isEditing && !password) ||
      !outletId
    ) {
      showSnackBar("Please fill in all fields", "error");
      return;
    }

    const reqData = {
      image: image,
      name,
      username,
      email,
      phone,
      outletId,
      ...(isEditing ? { id: vendorData.id, active } : { password }),
    };
    console.log(reqData);
    try {
      const response = await fetchData({
        method: isEditing ? "PUT" : "POST",
        url: "admin/outlet/vendor",
        data: reqData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        showSnackBar(
          isEditing
            ? "Vendor updated successfully"
            : "Vendor added successfully",
          "success"
        );
        getVendors();
        resetForm();
      }
    } catch (error) {
      showSnackBar(error.message || "Operation failed", "error");
    }
  };
  const filteredVendors = vendorList.filter((vendors) =>
    `${vendors.name} ${vendors.username} ${vendors.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "Logo",
      key: "image",
      render: (_, record) => (
        <img
          src={record.image || "https://via.placeholder.com/50"}
          alt="Vendor Logo"
          className="w-12 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Outlet Name",
      key: "outletName",
      dataIndex: "outletName",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
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
            setVendorData({
              id: record.id || "",
              username: record.username || "",
              password: "",
              image: record.logo || record.image || "",
              name: record.name || "",
              email: record.email || "",
              phone: record.phone || "",
              outletId: record.outletId || "",
              active: record.active ?? true,
            });
            setOutletId(record.outletId || "");
            setIsEditing(true);
            setModalOpen(true);
          }}
        >
          <MdOutlineEdit />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="text-2xl p-5 font-bold">
        <h1>VENDORS</h1>
      </div>
      <div className="flex justify-between p-5">
        <input
          type="search"
          placeholder="Search"
          className="p-2 border-2 border-gray-200 rounded-md w-[30vw]"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="flex flex-row justify-center items-center p-2 bg-[#800] rounded-md text-white cursor-pointer"
        >
          Add New Vendor <MdOutlineAdd />
        </button>
      </div>

      <Modal
        title={isEditing ? "Edit Vendor" : "Add New Vendor"}
        centered
        open={modalOpen}
        onOk={addOrEditVendor}
        onCancel={resetForm}
        okButtonProps={{ style: { backgroundColor: "#fc4c4b" } }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium">Vendor Logo:</label>
            <div className="flex items-center gap-4">
              <img
                src={vendorData.image || "/default-avatar.png"}
                alt="Vendor Logo Preview"
                className="w-20 h-20 object-cover rounded-md border"
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const url = await uploadImage("vendorImages", file);
                    setVendorData((prev) => ({ ...prev, image: url }));
                    onSuccess(null, file);
                  } catch (err) {
                    console.error("Upload failed", err);
                    onError(err);
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
          </div>

          {[
            ["Username", "username", "text"],
            ["Name", "name", "text"],
            ["Phone", "phone", "number"],
            ["Email", "email", "email"],
          ].map(([label, field, type]) => (
            <div className="flex flex-col" key={field}>
              <label className="mb-1 font-medium">{label}:</label>
              <input
                type={type}
                placeholder={label}
                value={vendorData[field] || ""}
                onChange={(e) =>
                  setVendorData((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                className="p-2 border-2 border-gray-200 rounded-md"
              />
            </div>
          ))}

          {/* Outlet Dropdown - added separately */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Outlet:</label>
            <DropDown
              url="/admin/outlet"
              method="GET"
              setter={(value) => {
                setOutletId(value);
                setVendorData((prev) => ({
                  ...prev,
                  outletId: value,
                }));
              }}
              globalState={outletsList}
              setGlobalState={setOutletsList}
              value={vendorData.outletId} // Optional: pass current value to show selected
            />
          </div>

          {!isEditing && (
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Password:</label>
              <input
                type="password"
                placeholder="Password"
                value={vendorData.password || ""}
                onChange={(e) =>
                  setVendorData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="p-2 border-2 border-gray-200 rounded-md"
              />
            </div>
          )}
          {isEditing && (
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Status:</label>
              <Select
                value={vendorData.active ? "Active" : "Inactive"}
                onChange={(value) =>
                  setVendorData((prev) => ({
                    ...prev,
                    active: value === "Active",
                  }))
                }
                className="w-full"
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          )}
        </div>
      </Modal>

      <div>
        <Table
          dataSource={filteredVendors}
          loading={loading}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default Vendor;
