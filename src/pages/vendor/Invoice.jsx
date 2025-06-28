import { useEffect, useState } from "react";
import { Table, Button, Modal, Descriptions, Grid } from "antd";
import jsPDF from "jspdf";
import seal from "@/assets/seal.png";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import { useRecoilState } from "recoil";
import { outletInvoice } from "@/atoms/vendor-profile";

const { useBreakpoint } = Grid;

function Invoice() {
  const { fetchData, loading: fetchLoading } = useAxios();
  const [supplies, setSupplies] = useRecoilState(outletInvoice);
  const [viewing, setViewing] = useState(null);
  const showSnackBar = useSnackbar();
  const screens = useBreakpoint();
  const loading = !supplies.loaded || fetchLoading;
  const token = localStorage.getItem("vendorToken");

  useEffect(() => {
    if (!supplies.loaded) fetchSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplies.loaded]);

  const fetchSupplies = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "/vendor/outlet/supply/history",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        const formatted = response.map((item, index) => ({
          key: index + 1,
          id: item.id,
          product: item.productDTO?.name || "N/A",
          warehouse: item.warehouseDTO?.name || "N/A",
          outlet: item.outletDTO?.name || "N/A",
          type: item.type || "N/A",
          quantity: item.quantity || 0,
          manufactureDate: item.manufactureDate?.slice(0, 10) || "N/A",
          expiryDate: item.expiryDate?.slice(0, 10) || "N/A",
          date: item.date?.slice(0, 10) || "N/A",
        }));
        setSupplies({ loaded: true, data: formatted });
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
    doc.text("E-Mart Outlet Invoice", leftX, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Date: ${supply.date}`, leftX, currentY);
    doc.text(`Invoice No: INV-${supply.id.toUpperCase()}`, leftX, currentY + 7);
    currentY += 20;

    const pairs = [
      [["Product", supply.product], ["Warehouse", supply.warehouse]],
      [["Outlet", supply.outlet], ["Type", supply.type]],
      [["Quantity", `${supply.quantity} units`], ["Mfg Date", supply.manufactureDate]],
      [["Exp Date", supply.expiryDate], ["Supplied On", supply.date]],
    ];

    pairs.forEach(([left, right]) => {
      doc.setFont(undefined, "bold");
      doc.text(`${left[0]}:`, leftX, currentY);
      doc.text(`${right[0]}:`, rightX, currentY);

      doc.setFont(undefined, "normal");
      doc.text(left[1].toString(), leftX + 40, currentY);
      doc.text(right[1].toString(), rightX + 40, currentY);

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

      doc.addImage(img, "PNG", 150, sealY - 5, 40, 40);

      const timestamp = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      doc.setFontSize(10);
      doc.setTextColor("#666");
      doc.text(`Report generated on: ${timestamp}`, leftX, sealY + 45);

      doc.save(`Outlet_Invoice_${supply.product}_${supply.date}.pdf`);
    };
  };

  const columns = [
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Supplied On", dataIndex: "date", key: "date" },
    { title: "Warehouse", dataIndex: "warehouse", key: "warehouse", responsive: ["md"] },
    { title: "Outlet", dataIndex: "outlet", key: "outlet", responsive: ["md"] },
    { title: "Type", dataIndex: "type", key: "type", responsive: ["md"] },
    { title: "Mfg Date", dataIndex: "manufactureDate", key: "manufactureDate", responsive: ["md"] },
    { title: "Exp Date", dataIndex: "expiryDate", key: "expiryDate", responsive: ["md"] },
    {
      title: "Invoice",
      key: "action",
      render: (_, record) => (
        <>
          {!screens.md && (
            <Button size="small" type="default" className="mr-2" onClick={() => setViewing(record)}>
              View
            </Button>
          )}
          <Button
            size="small"
            type="primary"
            style={{ background: "#8a0000", color: "white" }}
            onClick={() => handleDownloadPDF(record)}
          >
            Download
          </Button>
        </>
      ),
    },
  ];

  const tableClass = screens.md
    ? "min-w-[800px] border border-gray-300 shadow rounded"
    : "border border-gray-300 shadow rounded";

  const tableSize = screens.md ? "middle" : "small";
  const pagination = screens.md ? { pageSize: 5 } : { pageSize: 5, simple: true };

  return (
    <div className="p-4 sm:p-6">
      {/* Title */}
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-[#8a0000]">
          Warehouse to Outlet Invoices
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          rowKey="key"
          size={tableSize}
          loading={loading}
          dataSource={supplies.data}
          columns={columns}
          pagination={pagination}
          scroll={{ x: screens.md ? "max-content" : false }}
          className={tableClass}
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
                    textAlign: "center",
                  }}
                />
              ),
            },
          }}
        />
      </div>

      {/* Mobile Modal View */}
      <Modal
        title="Invoice Details"
        open={!!viewing}
        onCancel={() => setViewing(null)}
        footer={null}
      >
        {viewing && (
          <Descriptions bordered size="small" column={1} labelStyle={{ fontWeight: 600 }}>
            <Descriptions.Item label="Product">{viewing.product}</Descriptions.Item>
            <Descriptions.Item label="Warehouse">{viewing.warehouse}</Descriptions.Item>
            <Descriptions.Item label="Outlet">{viewing.outlet}</Descriptions.Item>
            <Descriptions.Item label="Type">{viewing.type}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{viewing.quantity}</Descriptions.Item>
            <Descriptions.Item label="Mfg Date">{viewing.manufactureDate}</Descriptions.Item>
            <Descriptions.Item label="Exp Date">{viewing.expiryDate}</Descriptions.Item>
            <Descriptions.Item label="Supplied On">{viewing.date}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Invoice;
