import { useEffect, useMemo } from "react";
import { Table } from "antd";
import { useRecoilState } from "recoil";
import { warehouseStockList } from "@/atoms/sampleAtom";
import useAxios from "@/hooks/useAxios/useAxios";

const WarehouseStockTable = ({ warehouseId, productName }) => {
  const [stockDataMap, setStockDataMap] = useRecoilState(warehouseStockList);
  const { fetchData } = useAxios();

  const stockData = stockDataMap[warehouseId] || [];

  useEffect(() => {
    console.log(warehouseId, Object.keys(stockDataMap).length);
    if (!warehouseId || stockData.length > 0) return;

    const token = localStorage.getItem("adminToken");

    const fetchStock = async () => {
      try {
        const response = await fetchData({
          url: `/admin/warehouse/${warehouseId}/stock`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response) {
          setStockDataMap((prev) => ({
            ...prev,
            [warehouseId]: response,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    fetchStock();
  }, [warehouseId, stockDataMap]);

  const filteredData = useMemo(() => {
    if (!productName.trim()) return stockData;
    return stockData.filter((item) =>
      item.productDTO.name
        ?.toLowerCase()
        .includes(productName.trim().toLowerCase())
    );
  }, [stockData, productName]);

  const columns = [
    {
      title: "Product name",
      key: "product_name",
      dataIndex: ["productDTO", "name"],
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={{ pageSize: 6 }}
      dataSource={filteredData}
      rowKey="product_id"
    />
  );
};

export default WarehouseStockTable;
