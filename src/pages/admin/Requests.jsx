import { productList, warehouseAtom } from "@/atoms/sampleAtom";
import DropDown from "@/components/admin/DropDown";
import RequestTable from "@/components/admin/RequestTable";
import { ConfigProvider, Input, InputNumber, Modal, Tabs } from "antd";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { PlusOutlined } from "@ant-design/icons";

function Requests() {
  const [warehouseGlobal, setWarehouseGlobal] = useRecoilState(warehouseAtom);
  const [warehouseId, setWarehouseId] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("restocking");
  const [modalOpen, setModalOpen] = useState(false);
  const [productsGlobal, setProductsGlobal] = useRecoilState(productList);
  const [productId, setProductId] = useState(null);
  const [reason, setReason] = useState("");
  const [quantity,setQuantity] = useState(0)

  const items = [
    {
      key: "restocking",
      label: "Restocking Requests",
      children: <RequestTable tabKey="restocking" warehouseId={warehouseId} />,
    },
    {
      key: "replacement",
      label: "Replacement Requests",
      children: <RequestTable tabKey="replacement" warehouseId={warehouseId} />,
    },
    {
      key: "approved",
      label: "Approved Requests",
      children: <RequestTable tabKey="approved" warehouseId={warehouseId} />,
    },
    {
      key: "rejected",
      label: "Rejected Requests",
      children: <RequestTable tabKey="rejected" warehouseId={warehouseId} />,
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-10">
      <div className="w-full flex justify-between">
        <DropDown
          url="/admin/warehouse"
          method="GET"
          setter={setProductId}
          globalState={warehouseGlobal}
          setGlobalState={setWarehouseGlobal}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="add-button cursor-pointer space-x-2"
        >
          <PlusOutlined />
          Make request
        </button>
      </div>
      <Modal
        title="Make supply request to supplier"
        centered
        open={modalOpen}
        // onOk={handleSaveProduct}
        onCancel={()=>setModalOpen(false)}
        okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
      >
        <DropDown
          url="/admin/supplier"
          method="GET"
          setter={setProductId}
          globalState={productsGlobal}
          setGlobalState={setProductsGlobal}
        />
        <InputNumber
            min={1}
            value={quantity}
            onChange={setQuantity}
            className="w-full"
          />
        <Input.TextArea
          rows={3}
          placeholder="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#8a0000",
          },
        }}
      >
        <Tabs
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
          items={items}
        />
      </ConfigProvider>
    </div>
  );
}

export default Requests;
