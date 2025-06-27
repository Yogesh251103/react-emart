import { useEffect, useMemo } from "react";
import { Table } from "antd";
import Barcode from "react-barcode";
import { useRecoilState } from "recoil";
import { warehouseStockList } from "@/atoms/sampleAtom";
import useAxios from "@/hooks/useAxios/useAxios";

const WarehouseStockTable = ({ warehouseId, productName }) => {
  const [stockDataMap, setStockDataMap] = useRecoilState(warehouseStockList);
  const { fetchData } = useAxios();

  const stockData = stockDataMap[warehouseId] || [];

  useEffect(() => {
    if (!warehouseId|| stockData.length > 0) return;

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
  }, [warehouseId]);

  const filteredData = useMemo(() => {
    if (!productName.trim()) return stockData;
    return stockData.filter((item) =>
      item.productName?.toLowerCase().includes(productName.trim().toLowerCase())
    );
  }, [stockData, productName]);

  const columns = [
    {
      title: "Product ID",
      key: "product_id",
      dataIndex: "productId",
      render: (text) => <Barcode className="h-10 w-fit" value={text} />,
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
  ];

  return <Table columns={columns} dataSource={filteredData} rowKey="product_id" />;
};

export default WarehouseStockTable;
