import { Table, Button, Tag } from "antd";
import { outletStock } from "@/atoms/vendor-profile";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import useAxios from "@/hooks/useAxios/useAxios";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

function IncomingSupply() {
  const [supplies, setSupplies] = useState([]);
  const setOutletStocks = useSetRecoilState(outletStock);
  const { fetchData } = useAxios();
  const showSnackBar = useSnackbar();
  const token = localStorage.getItem("vendorToken");

  const fetchIncomingInventory = async () => {
    try {
      const response = await fetchData({
        url: "/vendor/outlet/supply",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response) {
        setSupplies(response);
      }
    } catch (err) {
      showSnackBar("An error occurred fetching supplies", "error");
      console.error(err);
    }
  };

  const verifyIncomingInventory = async (id) => {
    try {
      const response = await fetchData({
        url: `/vendor/outlet/supply/${id}`,
        method: "PUT",
        body: {},
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response) {
        setSupplies((supplies) =>
          supplies.filter((supply) => supply.id !== id)
        );
        setOutletStocks({ loaded: false, data: [] });
        showSnackBar("Supply verified successfully", "success");
      }
    } catch (err) {
      showSnackBar("An error occurred verifying supply", "error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncomingInventory();
  }, []);

  const columns = [
    {
      title: "Product",
      dataIndex: ["productDTO", "name"],
      key: "product",
    },
    {
      title: "Category",
      dataIndex: ["productDTO", "category"],
      key: "category",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Warehouse",
      dataIndex: ["warehouseDTO", "name"],
      key: "warehouse",
    },
    {
      title: "Outlet",
      dataIndex: ["outletDTO", "name"],
      key: "outlet",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => verifyIncomingInventory(record.id)}
          className="cursor-pointer bg-green-100 text-green-800 border border-green-800 px-3 py-1 rounded"
        >
          Verify Supply
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Incoming Supplies</h1>
      <Table
        dataSource={supplies}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="mt-6 border border-gray-200 shadow rounded"
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

export default IncomingSupply;
