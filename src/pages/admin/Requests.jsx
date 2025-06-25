import { warehouseAtom } from "@/atoms/sampleAtom";
import DropDown from "@/components/admin/DropDown";
import RequestTable from "@/components/admin/RequestTable";
import { Tabs } from "antd";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

function Requests() {
  const [warehouseGlobal, setWarehouseGlobal] = useRecoilState(warehouseAtom);
  const [warehouseId, setWarehouseId] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("restocking");

  const getTabContent = () => {
    switch (activeTabKey) {
      case "restocking":
        return (
          <RequestTable
            url={`/admin/outlet/${warehouseId}/request`}
            warehouseId={warehouseId}
            filterByWarehouseId={false}
          />
        );
      case "replacement":
        return (
          <RequestTable
            url={`/admin/outlet/${warehouseId}/request/replace`}
            warehouseId={warehouseId}
            filterByWarehouseId={false}
          />
        );
      case "approved":
        return (
          <RequestTable
            url={`/admin/outlet/request/approved`}
            warehouseId={warehouseId}
            filterByWarehouseId={true}
          />
        );
      case "rejected":
        return (
          <RequestTable
            url={`/admin/outlet/request/rejected`}
            warehouseId={warehouseId}
            filterByWarehouseId={true}
          />
        );
      default:
        return null;
    }
  };

  const items = [
    { key: "restocking", label: "Restocking Requests" },
    { key: "replacement", label: "Replacement Requests" },
    { key: "approved", label: "Approved Requests" },
    { key: "rejected", label: "Rejected Requests" },
  ];

  return (
    <div className="w-full flex flex-col space-y-10">
      <DropDown
        url="/admin/warehouse"
        method="GET"
        setter={setWarehouseId}
        globalState={warehouseGlobal}
        setGlobalState={setWarehouseGlobal}
      />
      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key)}
        items={items.map((item) => ({
          ...item,
          children: getTabContent(),
        }))}
      />
    </div>
  );
}

export default Requests;
