import { useEffect, useMemo } from "react";
import { Table } from "antd";
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
      title: "Expiration Date",
      key: "expiration_date",
      dataIndex: "expiration_date",
    },
    {
      title: "Manufacture Date",
      key: "manufacture_date",
      dataIndex: "manufacture_date",
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
      key: "wholesale_price",
      dataIndex: "wholesale_price",
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <button
          className="text-blue-500 underline"
          onClick={() => onEdit(record)}
        >
          Edit
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

  return <Table columns={columns} dataSource={filteredData} rowKey="id" />;
};

export default ProductTable;
