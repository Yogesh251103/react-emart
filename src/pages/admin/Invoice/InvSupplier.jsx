import { useEffect, useState } from "react";
import { Table, Button, Modal, InputNumber, Input } from "antd";
import jsPDF from "jspdf";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import { useRecoilState } from "recoil";
import { productList, supplierInvoice } from "@/atoms/sampleAtom";
import seal from "@/assets/seal.png";
import DropDown from "@/components/admin/DropDown";

function InvSupplier() {
  const { fetchData, loading } = useAxios();
  const [supplies, setSupplies] = useRecoilState(supplierInvoice);
  const showSnackBar = useSnackbar();

  useEffect(() => {
    if (!supplies.loaded) {
      getSupplies();
    }
  }, [supplies]);

  const getSupplies = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetchData({
        method: "GET",
        url: "/admin/warehouse/supply",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setSupplies({
          loaded: true,
          data: response.map((item, index) => ({
            key: index + 1,
            id: item.id,
            product: item.productDTO?.name || "N/A",
            supplier: item.supplierDTO?.name || "NA",
            warehouse: item.warehouseDTO?.name || "N/A",
            type: item.type || "N/A",
            quantity: item.quantity || 0,
            unit: item.productDTO?.unit || "units",
            manufactureDate: item.manufactureDate?.slice(0, 10) || "N/A",
            expiryDate: item.expiryDate?.slice(0, 10) || "N/A",
            date: item.date?.slice(0, 10) || "N/A",
          })),
        });
      }
    } catch (err) {
      showSnackBar("Failed to fetch outlet invoice data", "error");
    }
  };

  const handleDownloadPDF = (supply) => {
    const doc = new jsPDF();
    const leftX = 14;
    const rightX = 110;
    let currentY = 20;
    const gap = 9;

    doc.setFontSize(20);
    doc.setTextColor("#8a0000");
    doc.text("E-Mart Supplier Invoice", leftX, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Date: ${supply.date}`, leftX, currentY);
    doc.text(`Invoice No: INV-${supply.id.toUpperCase()}`, leftX, currentY + 7);
    currentY += 20;

    const pairs = [
      [
        ["Product", supply.product],
        ["Supplier", supply.supplier],
      ],
      [
        ["Warehouse", supply.warehouse],
        ["Type", supply.type],
      ],
      [
        ["Quantity", `${supply.quantity} ${supply.unit}`],
        ["Mfg Date", supply.manufactureDate],
      ],
      [
        ["Exp Date", supply.expiryDate],
        ["Supplied On", supply.date],
      ],
    ];

    pairs.forEach(([leftPair, rightPair]) => {
      doc.setFont(undefined, "bold");
      doc.text(`${leftPair[0]}:`, leftX, currentY);
      doc.text(`${rightPair[0]}:`, rightX, currentY);

      doc.setFont(undefined, "normal");
      doc.text(leftPair[1].toString(), leftX + 40, currentY);
      doc.text(rightPair[1].toString(), rightX + 40, currentY);

      currentY += gap;
    });

    const img = new Image();
    img.src = seal;
    img.onload = () => {
      const sealY = currentY + 10;
      doc.setFontSize(12);
      doc.setTextColor("#8a0000");
      doc.text(
        "Digitally Verified by E-Mart Inventory Management System",
        leftX,
        sealY
      );

      // Add seal image
      doc.addImage(img, "PNG", 150, sealY - 5, 40, 40);

      // Footer
      const now = new Date();
      const timestamp = now.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      doc.setFontSize(10);
      doc.setTextColor("#666");
      doc.text(`Report generated on: ${timestamp}`, leftX, sealY + 45);

      doc.save(`Supplier_Invoice_${supply.product}_${supply.date}.pdf`);
    };
  };

  const columns = [
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Supplier", dataIndex: "supplier", key: "supplier" },
    { title: "Warehouse", dataIndex: "warehouse", key: "warehouse" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Mfg Date", dataIndex: "manufactureDate", key: "manufactureDate" },
    { title: "Exp Date", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Supplied On", dataIndex: "date", key: "date" },
    {
      title: "Invoice",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          style={{ background: "#8a0000", color: "white", padding: 14 }}
          onClick={() => handleDownloadPDF(record)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center px-5 pt-5">
        <h1 className="md:text-2xl font-bold">
          Supplier to Warehouse Invoices
        </h1>
      </div>
      <div className="p-5">
        <Table
          className="border-2 border-grey shadow-sm rounded-lg"
          loading={loading}
          dataSource={supplies.data}
          columns={columns}
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
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </div>
  );
}

export default InvSupplier;
