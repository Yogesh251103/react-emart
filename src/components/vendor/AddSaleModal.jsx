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
      <div className="flex flex-col gap-4">
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

        {selectedProducts.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  Price: Rs {item.product.price}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="small"
                icon={<MinusOutlined />}
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
              />
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(val) => updateQuantity(item.product.id, val)}
                style={{ width: "60px" }}
              />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
              />
            </div>
            <div className="w-20 text-right font-medium">Rs {item.total}</div>
            <Button
              danger
              type="text"
              onClick={() => handleRemoveProduct(item.product.id)}
            >
              ✕
            </Button>
          </div>
        ))}

        {selectedProducts.length > 0 && (
          <div className="text-right mt-4 font-semibold text-lg">
            Total: Rs {totalPrice}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddSaleModal;
