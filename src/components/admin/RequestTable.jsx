import { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import useAxios from "@/hooks/useAxios/useAxios";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  approvedRequestList,
  rejectedRequestList,
  replacementRequestList,
  restockingRequestList,
} from "@/atoms/sampleAtom";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import dayjs from "dayjs";

const RequestTable = ({ tabKey, warehouseId }) => {
  const { fetchData } = useAxios();
  const snackbar = useSnackbar();

  const atomMap = {
    restocking: restockingRequestList,
    replacement: replacementRequestList,
    approved: approvedRequestList,
    rejected: rejectedRequestList,
  };

  const endpointMap = {
    restocking: "/admin/warehouse/request",
    replacement: "/admin/warehouse/request/replace",
    approved: "/admin/outlet/request/approved",
    rejected: "/admin/outlet/request/rejected",
  };

  const atom = atomMap[tabKey];
  const url = endpointMap[tabKey];

  const [requests, setRequests] = useRecoilState(atom);
  const setApprovedList = useSetRecoilState(approvedRequestList);
  const setRejectedList = useSetRecoilState(rejectedRequestList);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!warehouseId?.trim()) return;
    if (requests.length > 0) return;

    loadData();
  }, [tabKey, warehouseId]);

  const loadData = async () => {
    console.log(requests)
    console.log("hi")
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetchData({
        url,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        console.log(response)
        const filtered = response.filter(
          (req) => req.warehouseId === warehouseId
        );
        setRequests(filtered);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    setRejectModalOpen(false);
    setSelectedRecord(null);
    setReason("");
  };

  const handleReasonSubmit = () => {
    if (!reason.trim()) {
      snackbar("Fill in the reason for rejection before submission", "error");
      return;
    }
    handleRequestAction("REJECT");
  };

  const handleRequestAction = async (action) => {
    if (!selectedRecord) return;

    const token = localStorage.getItem("adminToken");
    const approveRequest = action === "APPROVE";

    try {
      const urlPath = approveRequest
        ? `/admin/outlet/request/${selectedRecord.id}`
        : `/admin/outlet/request/${selectedRecord.id}?reason=${reason}`;

      const response = await fetchData({
        url: urlPath,
        method: approveRequest ? "PUT" : "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...(!approveRequest ? { data: { reason } } : {}),
      });

      if (!response) {
        snackbar("No stocks available in warehouse", "error");
        approveRequest ? setApproveModalOpen(false) : setRejectModalOpen(false);
        return;
      }

      // Clear UI state
      setSelectedRecord(null);
      setReason("");
      approveRequest ? setApproveModalOpen(false) : setRejectModalOpen(false);

      snackbar(
        `Request ${approveRequest ? "approved" : "rejected"} successfully`,
        "success"
      );

      // Refresh appropriate recoil atom
      const updatedListUrl = approveRequest
        ? "/admin/outlet/request/approved"
        : "/admin/outlet/request/rejected";
      const setListFn = approveRequest ? setApprovedList : setRejectedList;

      const updatedList = await fetchData({
        url: updatedListUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListFn(updatedList || []);

      // Remove from current requests list
      setRequests((prev) => prev.filter((r) => r.id !== selectedRecord.id));
    } catch (error) {
      console.error(error);
      snackbar("An error occurred while updating the request", "error");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm A"),
    },
    {
      title: "Outlet name",
      dataIndex: ["outletDTO", "name"],
      key: "outlet_name",
    },
    {
      title: "Product name",
      dataIndex: ["productDTO", "name"],
      key: "product_name",
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },

    ...(tabKey === "restocking" || tabKey === "replacement"
      ? [{ title: "Reason", key: "reason", dataIndex: "reason" }]
      : []),

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },

    ...(tabKey === "approved" || tabKey === "rejected"
      ? [{ title: "Type", key: "type", dataIndex: "type" }]
      : []),

    ...(tabKey === "rejected"
      ? [{ title: "Reason", key: "reason", dataIndex: "reason" }]
      : []),

    ...(tabKey !== "approved" && tabKey !== "rejected"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Modal
                  centered
                  open={approveModalOpen}
                  onOk={() => handleRequestAction("APPROVE")}
                  onCancel={() => {
                    setApproveModalOpen(false);
                    setSelectedRecord(null);
                  }}
                  closable={false}
                  okButtonProps={{ style: { backgroundColor: "green" } }}
                >
                  <h2 className="text-xl my-6">
                    Are you sure to approve the request?
                  </h2>
                </Modal>

                <Modal
                  title="Reason for rejection"
                  centered
                  open={rejectModalOpen}
                  onOk={handleReasonSubmit}
                  onCancel={handleModalCancel}
                  okButtonProps={{
                    style: { backgroundColor: "#FC4C4B" },
                  }}
                >
                  <textarea
                    className="w-full border-2 p-2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Modal>

                <button
                  className="cursor-pointer bg-green-100 text-green-800 p-3 rounded"
                  onClick={() => {
                    setSelectedRecord(record);
                    setApproveModalOpen(true);
                  }}
                >
                  Approve
                </button>

                <button
                  className="cursor-pointer bg-red-100 text-red-800 p-3 rounded"
                  onClick={() => {
                    setSelectedRecord(record);
                    setRejectModalOpen(true);
                  }}
                >
                  Reject
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

 return (
  <div className="w-full overflow-x-auto mt-6 rounded-lg border border-gray-300 shadow-md">
    <Table
      columns={columns}
      dataSource={requests}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      scroll={{ x: 'max-content' }}
      className="min-w-[600px] sm:min-w-full"
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
                whiteSpace: "nowrap", // ensures header text doesn't wrap weirdly
              }}
            />
          ),
        },
      }}
    />
  </div>
);


};

export default RequestTable;
