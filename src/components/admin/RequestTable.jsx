import React, { useState } from "react";

const RequestTable = () => {
  const [dataSource, setDataSource] = useState([]);

  return (
    <>
      <button>Export to excel</button>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />;
    </>
  );
};

export default RequestTable;
