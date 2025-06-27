import { useEffect, useMemo } from "react";
import { Table } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import Barcode from "react-barcode";
import { useRecoilState } from "recoil";
import { productList } from "../../atoms/sampleAtom";
import useAxios from "../../hooks/useAxios/useAxios";

const ProductTable = ({ supplierId, productName, onEdit }) => {
  const [dataSource, setDataSource] = useRecoilState(productList);
  const { fetchData } = useAxios();

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
      render: (text) => <Barcode className="h-10 w-fit" value={text} />,
    },
    {
      title: "Currency",
      key: "currency",
      dataIndex: "currency",
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Supplier ID",
      key: "supplier_id",
      dataIndex: "supplierId",
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
    },
    {
      title: "Threshold",
      key: "threshold",
      dataIndex: "threshold",
    },
    {
      title: "Wholesale Price",
      key: "wholesalePrice",
      dataIndex: "wholesalePrice",
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <button
          className="cursor-pointer"
          onClick={() => onEdit(record)}
        >
          <MdOutlineEdit size={20} color="#FC4C4B" />
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (dataSource.length > 0) return;

    const token = localStorage.getItem("adminToken");

    const fetchProducts = async () => {
      const response = await fetchData({
        url: "/admin/product",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        console.log(response);
        setDataSource(response);
      }
    };

    fetchProducts();
  }, []);

  const filteredData = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return [];

    return dataSource.filter(
      (item) =>
        (!supplierId || item.supplierId.toString() === supplierId.toString()) &&
        (!productName ||
          item.name.toLowerCase().includes(productName.trim().toLowerCase()))
    );
  }, [supplierId, productName, dataSource]);

  return (
  <div className="overflow-x-auto">
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      scroll={{ x: 'max-content' }} // Enables horizontal scroll if needed
      pagination={{ pageSize: 5 }} // Optional: you can adjust
      className="min-w-full"
    />
  </div>
);

};

export default ProductTable;
