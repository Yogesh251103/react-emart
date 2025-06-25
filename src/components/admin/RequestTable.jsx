import { useEffect, useRef, useState } from "react";
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
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const setApprovedList = useSetRecoilState(approvedRequestList);
  const setRejectedList = useSetRecoilState(rejectedRequestList);

  const reasonRef = useRef(null);

  useEffect(() => {
    console.log(url, warehouseId);
    if (!warehouseId?.trim()) return;
    if (requests.length > 0) return;
    const loadData = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await fetchData({
          url,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response) {
          const filtered = response.filter(
            (req) => req.warehouseId === warehouseId
          );
          setRequests(filtered);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [tabKey, warehouseId]);

  const handleModalCancel = () => {
    setRejectModalOpen(false);
    setReason("");
  };

  const handleReasonSubmit = (record) => {
    console.log(reasonRef.current);
    if (!reasonRef.current.value?.trim()) {
      snackbar("Fill in the reason for rejection before submission", "error");
      return;
    }
    handleRequestAction(record, "REJECT");
  };

  const columns = [
    { title: "Request ID", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
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
      ? [{
          title: "Type",
          key: "type",
          dataIndex: "type",
        }]
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
                  title="Approve the request"
                  centered
                  open={approveModalOpen}
                  onOk={() => handleRequestAction(record, "APPROVE")}
                  onCancel={() => setApproveModalOpen(false)}
                  okButtonProps={{ style: { backgroundColor: "green" } }}
                >
                  <h2 className="font-bold text-center text-2xl">
                    Are you sure to approve the request?
                  </h2>
                </Modal>
                <button
                  className="cursor-pointer bg-green-100 text-green-800 p-3"
                  onClick={() => setApproveModalOpen(true)}
                >
                  Approve
                </button>
                <Modal
                  title="Reason for rejection"
                  centered
                  open={rejectModalOpen}
                  onOk={() => handleReasonSubmit(record)}
                  onCancel={handleModalCancel}
                  okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
                >
                  <textarea
                    className="w-full border-2 p-2"
                    ref={reasonRef}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Modal>
                <button
                  className="cursor-pointer bg-red-100 text-red-800 p-3"
                  onClick={() => setRejectModalOpen(true)}
                >
                  Reject
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleRequestAction = async (record, action) => {
    const token = localStorage.getItem("adminToken");
    const approveRequest = action === "APPROVE";
    try {
      const response = await fetchData({
        url: approveRequest
          ? `/admin/outlet/request/${record.id}`
          : `/admin/outlet/request/${record.id}?reason=${reasonRef.current.value}`,
        method: approveRequest ? "PUT" : "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...(!approveRequest ? { data: { reason: reason } } : {}),
      });

      if (reasonRef.current) reasonRef.current.value = "";

      if (approveRequest) {
        setApproveModalOpen(false);
        snackbar("Request approved successfully", "success");
        setApprovedList((prev) => [...prev, { ...record, status: "APPROVED" }]);
      } else {
        setRejectModalOpen(false);
        snackbar("Request rejected successfully", "success");
        setRejectedList((prev) => [
          ...prev,
          { ...record, status: "REJECTED", reason: reasonRef.current.value },
        ]);
      }

      setRequests((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      console.error(error);
    }
  };

  return <Table columns={columns} dataSource={requests} rowKey="id" />;
};

export default RequestTable;
