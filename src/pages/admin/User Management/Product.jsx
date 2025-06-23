import { useState } from "react";
import DropDown from "../../../components/admin/DropDown";
import { PlusOutlined } from "@ant-design/icons";
import CustomTable from "../../../components/admin/Table";
import { Modal } from "antd";

const Product = () => {
  const [input, setInput] = useState("");
  const [productFormData, setProductFormData] = useState({
    currency : "",
    manufacture_date : "",
    expiration_date : "",
    name:"",
    price:"",
    supplier_id:"",
    category:"",
    description:"",
    threshold:"",
    wholesale_price:""
  })

  const [modalOpen, setModalOpen] = useState(false);


  return (
    <div className="flex flex-col">
      <h1 className="h1">Products</h1>
      <div className="w-full flex justify-evenly">
        <input
          type="text"
          className="input"
          placeholder="Enter product name here"
          onChange={(e) => setInput(e.target.value)}
        />
        {/* <DropDown
          url="/admin/product"
          method="GET"
          setWarehouseId={setWarehouseId}
        /> */}
        <button onClick={()=>setModalOpen(true)} className="add-button cursor-pointer">
          <PlusOutlined />
          Add new product
        </button>
        <Modal
            title="Add New Product"
            centered
            open={modalOpen}
            onOk={()=>console.log("hi")}
            onCancel={() => setModalOpen(false)}
            okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
          >
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Price"
                name="price"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Currency"
                name="currency"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Image"
                name="image"
                onChange={handleChange}
                required
              />
              <input
                type="date"
                className="p-2 border-2 border-gray-200 rounded-md"
                onChange={handleChange}
                required
              />
              <input
                type="date"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                value={warehouseData.name}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                value={warehouseData.name}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                value={warehouseData.name}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                value={warehouseData.name}
                required
              />
              <input
                type="text"
                className="p-2 border-2 border-gray-200 rounded-md"
                placeholder="Name"
                onChange={(e) =>
                  setWarehouseData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                value={warehouseData.name}
                required
              />
            </div>
          </Modal>
      </div>
      <CustomTable />
    </div>
  );
};

export default Product;
