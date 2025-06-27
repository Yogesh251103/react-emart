import { MdOutlineAdd, MdOutlineEdit, MdOutlineUpdate } from "react-icons/md";
import { Table } from "antd";
import useAxios from "../../hooks/useAxios/useAxios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { warehouseAtom } from "../../atoms/sampleAtom";
import { useSnackbar } from "../../contexts/SnackbarContexts";
import { Modal } from "antd";

function Warehouse() {
  const { loading, fetchData } = useAxios();
  const [warehouse, setWarehouse] = useRecoilState(warehouseAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [warehouseData, setWarehouseData] = useState({
    name: "",
    address: "",
  });
  const showSnackBar = useSnackbar();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    getWarehouse();
  }, []);

  const getWarehouse = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "/admin/warehouse",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setWarehouse(response);
      }
    } catch (err) {
      showSnackBar("Error Fetching Data", "error");
    }
  };

  const filteredWarehouse = warehouse.filter((w) => {
    return `${w.name} ${w.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const addWarehouse = async () => {
    if (!warehouseData.name || !warehouseData.address) {
      showSnackBar("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await fetchData({
        method: "POST",
        url: "/admin/warehouse",
        data: {
          name: warehouseData.name,
          address: warehouseData.address,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        console.log(response);
        showSnackBar("New Warehouse Created", "success");
        setModalOpen(false);
        setWarehouseData({ name: "", address: "" }); // reset after submit
        getWarehouse();
      }
    } catch (err) {
      showSnackBar(err.message || "Something went wrong", "error");
    }
  };
  const handleEdit = (record) => {
    console.log(record)
    setEditingWarehouse({
      id: record.id,
      name: record.name,
      address: record.address,
      active: record.active,
    });
    setEditModalOpen(true);
  };
  const updateWarehouse = async () => {
    if (!editingWarehouse.name && !editingWarehouse.address) {
      showSnackBar("Please Fill all fields", "error");
      return;
    }
    try {
      const response = await fetchData({
        method: "PUT",
        url: "/admin/warehouse",
        data: {
          id: editingWarehouse.id,
          name: editingWarehouse.name,
          address: editingWarehouse.address,
          active: editingWarehouse.active,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        showSnackBar("Warehouse Details Updated", "success");
        setEditModalOpen(false);
        setEditingWarehouse(false);
        getWarehouse();
      }
    } catch (err) {
      showSnackBar(err.message || "Error Updating Data", "error");
    }
  };
  const columns = [
    {
      title: "Warehouse Name",
      dataIndex: "name",
      key: "warehouse_name",
    },
    {
      title: "Warehouse ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (status) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleEdit(record)}
          className="p-2 cursor-pointer "
        >
          <MdOutlineEdit size={20} color="#FC4C4B" />
        </button>
      ),
    },
  ];

return (
  <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
      Warehouse Listing
    </h1>

    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
      <input
        type="search"
        className="border border-gray-300 rounded-md p-2 w-full sm:w-[30vw]"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="w-full sm:w-auto flex justify-center gap-2 items-center px-4 py-2 bg-[#8a0000] rounded-md text-white"
        onClick={() => setModalOpen(true)}
      >
        Add New Warehouse <MdOutlineAdd />
      </button>
    </div>

    {/* Add Modal */}
    <Modal
      title="Add New Warehouse"
      centered
      open={modalOpen}
      onOk={addWarehouse}
      onCancel={() => {
        setModalOpen(false);
        setWarehouseData({ name: "", address: "" });
      }}
      okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Name"
          autoFocus
          onChange={(e) =>
            setWarehouseData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          value={warehouseData.name}
          required
        />
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Address"
          onChange={(e) =>
            setWarehouseData((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          value={warehouseData.address}
          required
        />
      </div>
    </Modal>

    {/* Edit Modal */}
    <Modal
      title="Edit Warehouse"
      centered
      open={editModalOpen}
      onOk={updateWarehouse}
      onCancel={() => {
        setEditModalOpen(false);
        setEditingWarehouse(false);
      }}
      okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={editingWarehouse?.name || ""}
          onChange={(e) =>
            setEditingWarehouse((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="Address"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={editingWarehouse?.address || ""}
          onChange={(e) =>
            setEditingWarehouse((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        />
        <select
          className="p-2 border border-gray-300 rounded-md w-full"
          value={editingWarehouse?.active ? "active" : "inactive"}
          onChange={(e) =>
            setEditingWarehouse((prev) => ({
              ...prev,
              active: e.target.value === "active",
            }))
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </Modal>

    {/* Table Section */}
    <div className="overflow-x-auto">
      <Table
        className="min-w-full border border-gray-200 shadow-sm rounded-lg"
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                className="bg-red-100 text-black"
                style={{
                  ...props.style,
                  backgroundColor: "#8a0000",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
            ),
          },
        }}
        scroll={{ x: "max-content" }} // important for horizontal scroll
        loading={loading}
        dataSource={filteredWarehouse}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  </div>
);

}

export default Warehouse;
