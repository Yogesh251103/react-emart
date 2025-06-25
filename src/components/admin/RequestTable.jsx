import { useEffect, useState } from "react";
import { Table } from "antd";
import useAxios from "@/hooks/useAxios/useAxios";

const RequestTable = ({ url, warehouseId, filterByWarehouseId }) => {
  const { fetchData } = useAxios();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log(url, warehouseId)
    if (!warehouseId && url.includes("{warehouseId}")) {
      console.log("hi");
      return
    };

    const loadData = async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetchData({
        url,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      if (response) {
        const filtered = filterByWarehouseId
          ? response.filter((req) => req.warehouseId === warehouseId)
          : response;
        setRequests(filtered);
      }
    };

    loadData();
  }, [url, warehouseId]);

  const columns = [
    { title: "Request ID", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "outlet_id", dataIndex: "outletId", key: "outletId" },
    { title: "product_id", dataIndex: "productId", key: "productId" },
    { title: "warehouse_id", dataIndex: "warehouseId", key: "warehouseId" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
  ];

  return <Table columns={columns} dataSource={requests} rowKey="id" />;
};

export default RequestTable;
