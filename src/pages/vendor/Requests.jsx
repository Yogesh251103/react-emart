import React from "react";
import { ConfigProvider, Tabs } from "antd";
import CreateRequest from "@/components/vendor/CreateRequest";
import { replacementRequest, restockingRequest } from "@/atoms/vendor-profile";

function Requests() {
  const items = [
    {
      key: "restock",
      label: "Restocking",
      children: (
        <CreateRequest
          title="Restocking Request"
          url="/vendor/outlet/request"
          atom={restockingRequest}
        />
      ),
    },
    {
      key: "replace",
      label: "Replacement",
      children: (
        <CreateRequest
          title="Replacement Request"
          url="/vendor/outlet/request/replace"
          atom={replacementRequest}
        />
      ),
    },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#8a0000",
          },
        }}
      >
        <Tabs defaultActiveKey="restock" items={items} />
      </ConfigProvider>
    </div>
  );
}

export default Requests;
