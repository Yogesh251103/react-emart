import React, { useState } from "react";

const RequestTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
      {
        title: "ID",
        key: "id",
        dataIndex: "id",
        render: (text) => <Barcode className="h-10 w-fit" value={text} />,
      },
      {
        title: "Date",
        key: "date",
        dataIndex: "date",
      },
      {
        title: "Quantity",
        key: "quantity",
        dataIndex: "quantity",
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
      },
      {
        title: "Type",
        key: "type",
        dataIndex: "type",
      },
      {
        title: "Outlet ID",
        key: "outlet_id",
        dataIndex: "category",
      },
      {
        title: "Product ID",
        key: "product_id",
        dataIndex: "threshold",
      },
      {
        title: "User ID",
        key: "user_id",
        dataIndex: "wholesale_price",
      },
      {
        title: "Warehouse ID",
        key: "warehouse_id",
        dataIndex: "wholesale_price",
      },
      {
        title: "Edit",
        key: "edit",
        render: (_, record) => (
          <button
            className="text-blue-500 underline"
            onClick={() => onEdit(record)}
          >
            Edit
          </button>
        ),
      },
    ];
  return (
    <>
      <button>Export to excel</button>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />;
    </>
  );
};

export default RequestTable;
