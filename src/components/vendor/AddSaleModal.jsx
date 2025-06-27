import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Select, InputNumber } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const AddSaleModal = ({ open, onCancel, onSave, allProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddProduct = (productId) => {
    const product = allProducts.find((p) => p.id === productId);
    setSelectedProducts((prev) => [
      ...prev,
      { product, quantity: 1, total: product.price },
    ]);
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: quantity > 0 ? quantity : 1,
              total: item.product.price * (quantity > 0 ? quantity : 1),
            }
          : item
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  const totalPrice = useMemo(() => {
    return selectedProducts.reduce((acc, item) => acc + item.total, 0);
  }, [selectedProducts]);

  const resetState = () => {
    setSelectedProducts([]);
  };

  const handleSave = () => {
    const payload = {
      saleItemDTOS: selectedProducts.map((item) => ({
        productDTO: { id: item.product.id },
        quantity: item.quantity,
      })),
      date: new Date().toISOString(),
    };
    onSave(payload);
    resetState();
  };

  useEffect(() => {
    if (!open) resetState();
  }, [open]);

  const availableOptions = allProducts.filter(
    (p) => !selectedProducts.find((item) => item.product.id === p.id)
  );

 return (
  <Modal
    title="Create New Sale"
    open={open}
    onCancel={onCancel}
    onOk={handleSave}
    okButtonProps={{ style: { backgroundColor: "#FC4C4B" } }}
    width={600}
  >
    <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-2">
      {/* Product Selector */}
      <Select
        placeholder="Select a product"
        onSelect={handleAddProduct}
        className="w-full"
      >
        {availableOptions.map((product) => (
          <Select.Option key={product.id} value={product.id}>
            {product.name}
          </Select.Option>
        ))}
      </Select>

      {/* Selected Products */}
      {selectedProducts.map((item) => (
        <div
          key={item.product.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-md border"
        >
          {/* Product Info */}
          <div className="flex items-center gap-3 w-full sm:w-[40%]">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="text-sm">
              <h3 className="font-semibold text-sm sm:text-base">
                {item.product.name}
              </h3>
              <p className="text-xs text-gray-500">
                Price: ₹{item.product.price}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="small"
              className="!w-7 !h-7 flex justify-center items-center"
              icon={<MinusOutlined style={{ fontSize: "12px" }} />}
              onClick={() =>
                updateQuantity(item.product.id, item.quantity - 1)
              }
            />
            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(val) => updateQuantity(item.product.id, val)}
              className="!w-14 text-center"
              size="small"
            />
            <Button
              size="small"
              className="!w-7 !h-7 flex justify-center items-center"
              icon={<PlusOutlined style={{ fontSize: "12px" }} />}
              onClick={() =>
                updateQuantity(item.product.id, item.quantity + 1)
              }
            />
          </div>

          {/* Total Price */}
          <div className="text-sm font-medium sm:text-right sm:w-[80px]">
            ₹{item.total}
          </div>

          {/* Remove Button */}
          <Button
            danger
            type="text"
            className="sm:ml-2 text-sm"
            onClick={() => handleRemoveProduct(item.product.id)}
          >
            ✕
          </Button>
        </div>
      ))}

      {/* Total Price */}
      {selectedProducts.length > 0 && (
        <div className="text-right mt-4 font-semibold text-base sm:text-lg">
          Total: ₹{totalPrice}
        </div>
      )}
    </div>
  </Modal>
);

};

export default AddSaleModal;
