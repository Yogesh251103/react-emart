import React, { useEffect, useState, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { outletStock, productsList } from "@/atoms/vendor-profile";
import useAxios from "@/hooks/useAxios/useAxios";
import { Table, Button } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import dayjs from "dayjs";
import AddSaleModal from "@/components/vendor/AddSaleModal";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import jsPDF from "jspdf";
import seal from "@/assets/seal.png";
import JsBarcode from "jsbarcode";

function Billing() {
  const { fetchData, loading } = useAxios();
  const products = useRecoilValue(productsList);
  const token = localStorage.getItem("vendorToken");
  const showSnackbar = useSnackbar();

  const [sales, setSales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const setOutletStock = useSetRecoilState(outletStock);

  const fetchSales = async () => {
    try {
      const res = await fetchData({
        method: "GET",
        url: "/vendor/outlet/sale",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res);
    } catch (err) {
      showSnackbar("Failed to fetch sales", "error");
    }
  };

  const handleCreateSale = async (payload) => {
    try {
      if (payload.saleItemDTOS.length === 0) {
        showSnackbar("Please add products", "error");
        return;
      }
      const response = await fetchData({
        method: "POST",
        url: "/vendor/outlet/sale",
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response) {
        showSnackbar("Sale added successfully", "success");
        setModalOpen(false);
        fetchSales();
        setOutletStock({ loaded: false, data: [] });
      } else {
        showSnackbar("No stock available in outlet", "error");
      }
    } catch (err) {
      showSnackbar("Add sale failed", "error");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDownloadInvoice = async (sale) => {
    const doc = new jsPDF();
    const leftX = 14;
    const rightX = 110;
    let currentY = 20;
    const gap = 9;

    doc.setFontSize(20);
    doc.setTextColor("#8a0000");
    doc.text("E-Mart Sale Invoice", leftX, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(
      `Date: ${dayjs(sale.date).format("YYYY-MM-DD HH:mm")}`,
      leftX,
      currentY
    );
    doc.text(`Invoice No: INV-${sale.id.toUpperCase()}`, leftX, currentY + 7);
    currentY += 20;

    doc.setFont(undefined, "bold");
    doc.text("Outlet Name:", leftX, currentY);
    doc.setFont(undefined, "normal");
    doc.text(sale.outletName, leftX + 40, currentY);
    currentY += gap;

    doc.setFont(undefined, "bold");
    doc.text("Vendor Name:", leftX, currentY);
    doc.setFont(undefined, "normal");
    doc.text(sale.vendorDTO.name, leftX + 40, currentY);
    currentY += gap;

    doc.setFont(undefined, "bold");
    doc.text("Vendor Email:", leftX, currentY);
    doc.setFont(undefined, "normal");
    doc.text(sale.vendorDTO.email, leftX + 40, currentY);
    currentY += gap;

    for (const [index, item] of sale.saleItemDTOS.entries()) {
      const { productDTO, quantity } = item;
      const total = quantity * productDTO.price;

      doc.setFont(undefined, "bold");
      doc.text(`Product ${index + 1}:`, leftX, currentY);
      doc.setFont(undefined, "normal");
      doc.text(productDTO.name, leftX + 30, currentY);
      currentY += gap;

      doc.text(`Quantity: ${quantity}`, leftX + 30, currentY);
      doc.setFont(undefined, "bold");
      doc.text("Rate:", rightX, currentY);
      doc.setFont(undefined, "normal");
      doc.text(
        `${productDTO.currency}${productDTO.price}`,
        rightX + 15,
        currentY
      );
      currentY += gap;

      doc.setFont(undefined, "bold");
      doc.text("Total:", rightX, currentY);
      doc.setFont(undefined, "normal");
      doc.text(`${productDTO.currency} ${total}`, rightX + 15, currentY);
      currentY += 10;

      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, productDTO.id, { format: "CODE128" });
      const barcodeImg = barcodeCanvas.toDataURL("image/png");
      doc.addImage(barcodeImg, "PNG", leftX + 30, currentY - 10, 60, 20);
      currentY += 25;

      await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = productDTO.image;
        img.onload = () => {
          doc.addImage(img, "JPEG", leftX + 130, currentY - 50, 30, 30);
          resolve();
        };
        img.onerror = resolve;
      });

      currentY += 10;
    }

    doc.setFontSize(12);
    doc.setTextColor("#8a0000");
    doc.text(`Sale Total: Rs. ${sale.totalPrice}`, leftX, currentY + 10);
    currentY += 25;

    const sealImg = new Image();
    sealImg.src = seal;
    sealImg.onload = () => {
      doc.setFontSize(12);
      doc.setTextColor("#8a0000");
      doc.text(
        "Digitally Verified by E-Mart Inventory System",
        leftX,
        currentY
      );

      doc.addImage(sealImg, "PNG", 150, currentY - 5, 40, 40);

      // Timestamp
      const now = new Date();
      const timestamp = now.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      doc.setFontSize(10);
      doc.setTextColor("#666");
      doc.text(`Report generated on: ${timestamp}`, leftX, currentY + 45);

      doc.save(`Sale_Invoice_${sale.id}.pdf`);
    };
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Vendor",
      dataIndex: "vendorDTO",
      key: "vendor",
      render: (vendor) => vendor?.name || "-",
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => (
        <div className="flex flex-col gap-2">
          {record.saleItemDTOS.map((item) => (
            <div key={item.id} className="bg-gray-100 p-2 rounded-md">
              {item.productDTO.name} - {item.quantity} x{" "}
              {item.productDTO.currency}
              {item.productDTO.price} =
              <b className="ml-1">
                {item.productDTO.currency}
                {item.quantity * item.productDTO.price}
              </b>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: "#8a0000", padding: 15 }}
          onClick={() => handleDownloadInvoice(record)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="md:text-2xl md:pl-5 font-bold mb-4">Product Sales</h1>
      <div className="flex justify-end px-5 mb-4">
        <Button
          style={{ border: "2px solid #8a0000", color: "#8a0000", padding: 15 }}
          onClick={() => setModalOpen(true)}
        >
          Add Sale <MdOutlineAdd />
        </Button>
      </div>
      <div className="px-5">
        <Table
          className="border-2 border-grey shadow-sm rounded-lg"
          loading={loading}
          dataSource={sales}
          rowKey={(record) => record.id}
          columns={columns}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  className="bg-red-100 text-black"
                  style={{
                    ...props.style,
                    backgroundColor: "#8a0000",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              ),
            },
          }}
        />
      </div>

      {/* Add Sale Modal */}
      <AddSaleModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSave={handleCreateSale}
        allProducts={products.data || []}
      />
    </div>
  );
}

export default Billing;
