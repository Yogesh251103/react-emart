import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample chart data
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Sales",
      data: [120, 190, 300, 500, 200],
      fill: false,
      borderColor: "#1890ff",
      tension: 0.4,
    },
  ],
};

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Monthly Sales Data" },
  },
};

const ChartCard = () => {
  return (
    <Card
      title="Sales Overview"
      hoverable
      style={{ width: 600, margin: "0 auto", marginTop: 50 }}
    >
      <Line data={data} options={options} />
    </Card>
  );
};

export default ChartCard;
