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
        setWarehouse(
          response.map((w, index) => ({
            key: index + 1,
            warehouse_name: w.name,
            id: w.id,
            location: w.address,
            status: w.active ? "Active" : "Inactive",
          }))
        );
      }
    } catch (err) {
      showSnackBar("Error Fetching Data", "error");
    }
  };
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
    setEditingWarehouse({
      id: record.id,
      name: record.warehouse_name,
      address: record.location,
      active: record.status === "Active",
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
      dataIndex: "warehouse_name",
      key: "warehouse_name",
    },
    {
      title: "Warehouse ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    <div>
      <h1 className="md:text-2xl md:pl-5 font-bold">Warehouse Listing</h1>
      <div className="flex justify-between p-5">
        <div>
          <input
            type="search"
            className="border-2 border-gray-200 rounded-md p-2 w-[30vw]"
            placeholder="Search"
          />
        </div>
        <div>
          <button
            className="flex justify-center gap-2 items-center md:p-2 bg-[#FC4B4B] rounded-md text-white cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            Add New Warehouse <MdOutlineAdd />
          </button>
          <Modal
            title="Add New Warehouse"
            centered
            open={modalOpen}
            onOk={addWarehouse}
            onCancel={() => {
              setModalOpen(false);
              setWarehouseData({ name: "", address: "" }); // reset form on cancel
            }}
            okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
            // confirmLoading={loading} // optional: show loading on submit
          >
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
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
                className="p-2 border-2 border-gray-200 rounded-md"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                value={warehouseData.address}
                placeholder="Address"
                required
              />
            </div>
          </Modal>
        </div>
      </div>
      {/* EDIT WAREHOUSE MODAL */}
      <div>
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
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border-2 border-gray-200 rounded-md"
              value={editingWarehouse?.name || "Name"}
              onChange={(e) =>
                setEditingWarehouse((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <input
              type="text"
              placeholder="Name"
              className="p-2 border-2 border-gray-200 rounded-md"
              value={editingWarehouse?.address || "Name"}
              onChange={(e) =>
                setEditingWarehouse((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
            <select
              className="p-2 border-2 border-gray-200 rounded-md"
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
      </div>
      <div>
        <Table
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  className="bg-red-100 text-black"
                  style={{
                    ...props.style,
                    backgroundColor: "#FC4C4B", 
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              ),
            },
          }}
          loading={loading}
          dataSource={warehouse}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default Warehouse;
