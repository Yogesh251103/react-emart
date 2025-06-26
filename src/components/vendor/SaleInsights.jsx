import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, Table, Tag } from "antd";
import useAxios from "@/hooks/useAxios/useAxios";

const COLORS = ["#8a0000", "#ffb300", "#4caf50", "#2196f3", "#9c27b0"];

function SaleInsights() {
  const { fetchData } = useAxios();
  const [uniqueData, setUniqueData] = useState([]);
  const token = localStorage.getItem("vendorToken");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetchData({
          method: "GET",
          url: "/vendor/outlet/sale/insights",
          headers: { Authorization: `Bearer ${token}` },
        });

        const productMap = new Map();

        res.forEach((item) => {
          const id = item["Product ID"];
          if (!productMap.has(id)) {
            productMap.set(id, item);
          }
        });

        setUniqueData(Array.from(productMap.values()));
      } catch (err) {
        console.error("Error fetching sale insights", err);
      }
    };

    fetchInsights();
  }, []);

  const columns = [
    { title: "Product", dataIndex: "Product Name", key: "name" },
    { title: "Category", dataIndex: "Category", key: "category" },
    {
      title: "Stock Qty",
      dataIndex: "Stock Qty",
      key: "stock",
      render: (qty) => <Tag color={qty < 10 ? "red" : "green"}>{qty}</Tag>,
    },
    {
      title: "Expiry (Days)",
      dataIndex: "Product Expiry Days",
      key: "expiry",
      render: (days) => (
        <Tag color={days <= 3 ? "red" : days <= 7 ? "orange" : "green"}>
          {days}
        </Tag>
      ),
    },
    { title: "Units/Day", dataIndex: "Units/Day", key: "ud" },
    {
      title: "Price",
      key: "price",
      render: (_, row) => `${row.Currency} ${row.Price}`,
    },
  ];

  const categoryData = Object.entries(
    uniqueData.reduce((acc, item) => {
      acc[item.Category] = (acc[item.Category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

return (
  <div className="p-4 sm:p-6">
    <h1 className="text-xl sm:text-2xl font-bold text-[#8a0000] mb-6">Sale Insights</h1>

    {/* Responsive Grid of Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      <Card
        style={{ border: "2px solid #DDDDDD" }}
        title="Stock Quantity per Product"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uniqueData}>
            <XAxis dataKey="Product Name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Stock Qty" fill="#8a0000" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        style={{ border: "2px solid #DDDDDD" }}
        title="Sales Velocity (Units/Day)"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uniqueData}>
            <XAxis dataKey="Product Name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Units/Day" fill="#ffb300" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        style={{ border: "2px solid #DDDDDD" }}
        title="Product Expiry Status"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uniqueData}>
            <XAxis dataKey="Product Name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Product Expiry Days" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        style={{ border: "2px solid #DDDDDD" }}
        title="Category Distribution"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Table Section */}
    <Card
      title="Product Inventory Table"
      style={{ border: "2px solid #DDDDDD" }}
      className="mt-6"
    >
      <div className="overflow-x-auto">
        <Table
          dataSource={uniqueData}
          columns={columns}
          rowKey="Product ID"
          pagination={{ pageSize: 6 }}
          className="min-w-[700px]"
        />
      </div>
    </Card>
  </div>
);

}

export default SaleInsights;
