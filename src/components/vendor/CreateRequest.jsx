import { productsList } from "@/atoms/vendor-profile";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import useAxios from "@/hooks/useAxios/useAxios";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Modal, Button, Select, Input, InputNumber, Tag, Table } from "antd";
import dayjs from "dayjs";

function CreateRequest({ title, url, atom }) {
  const [requests, setRequests] = useRecoilState(atom);
  const { fetchData, loading } = useAxios();
  const showSnackBar = useSnackbar();
  const token = localStorage.getItem("vendorToken");

  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateRequest = async ({
    selectedProduct,
    reason,
    quantity,
    reset,
  }) => {
    try {
      const res = await fetchData({
        url: `${url}`,
        method: "POST",
        data: {
          productDTO: { id: selectedProduct },
          date: new Date().toISOString(),
          reason,
          quantity,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res) {
        showSnackBar("Request created successfully", "success");
        reset();
        setRequests({
          loaded: false,
          data: [],
        });
      }
    } catch (err) {
      console.error(err);
      showSnackBar("Failed to create request", "error");
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetchData({
        url: `${url}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setRequests({
        loaded: true,
        data: response,
      });
    } catch (err) {
      console.error(err);
      showSnackBar("An error has occured", "error");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: ["date"],
      key: "date",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm A"),
    },
    {
      title: "Product",
      dataIndex: ["productDTO", "name"],
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "",
          bg = "";
        if (status === "PENDING") {
          color = "#8a6d00";
          bg = "#fffbe6";
        } else if (status === "REJECTED") {
          color = "#8a0000";
          bg = "#fff0f0";
        } else {
          color = "#0f7513";
          bg = "#f6ffed";
        }

        return (
          <Tag
            style={{
              backgroundColor: bg,
              color,
              borderRadius: "8px",
              padding: "4px 12px",
              fontWeight: "500",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    if (!requests.loaded) {
      fetchRequests();
    }
  }, [requests]);

  return (
    <div className="p-4 min-h-[70vh">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#8a0000]">{title}</h1>
        <Button
          type="primary"
          style={{ backgroundColor: "#8a0000", borderColor: "#8a0000" }}
          onClick={() => setModalOpen(true)}
        >
          + Create Request
        </Button>
      </div>
      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRequest}
        loading={loading}
      />
      <Table
        columns={columns}
        dataSource={requests.data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="mt-6 border border-grey shadow-md rounded-lg"
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
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
      />
    </div>
  );
}

function RequestModal({ open, onClose, onCreate, loading }) {
  const products = useRecoilValue(productsList);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState(1);

  const reset = () => {
    setSelectedProduct(null);
    setReason("");
    setQuantity(1);
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedProduct || !reason || !quantity) return;
    onCreate({ selectedProduct, reason, quantity, reset });
  };

  return (
    <Modal
      open={open}
      title="Create Request"
      onCancel={reset}
      footer={[
        <Button key="cancel" onClick={reset}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          loading={loading}
          style={{ backgroundColor: "#8a0000", borderColor: "#8a0000" }}
          onClick={handleSubmit}
        >
          Create
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-semibold">Product</label>
          <Select
            placeholder="Select product"
            value={selectedProduct}
            onChange={setSelectedProduct}
            className="w-full"
          >
            {products.data.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Reason</label>
          <Input.TextArea
            rows={3}
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Quantity</label>
          <InputNumber
            min={1}
            value={quantity}
            onChange={setQuantity}
            className="w-full"
          />
        </div>
      </div>
    </Modal>
  );
}

export default CreateRequest;
