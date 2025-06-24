import { useEffect, useMemo } from "react";
import { Table } from "antd";
import Barcode from "react-barcode";
import { useRecoilState } from "recoil";
import { outletList } from "../../atoms/sampleAtom";
import useAxios from "../../hooks/useAxios/useAxios";

const OutletTable = ({ warehouseId, outletName, onEdit }) => {
  const [dataSource, setDataSource] = useRecoilState(outletList);
  const { fetchData } = useAxios();

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Warehouse Id",
      key: "warehouseId",
      dataIndex: "warehouseId",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => {
        return (
          <button
            className="text-blue-500 underline"
            onClick={() => onEdit(record)}
          >
            Edit
          </button> 
        );
      },
    },
  ];

  useEffect(() => {
    if (dataSource.length > 0) return;

    const token = localStorage.getItem("adminToken");

    const fetchProducts = async () => {
      const response = await fetchData({
        url: "/admin/outlet",
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
        (!warehouseId ||
          item.warehouseId.toString() === warehouseId.toString()) &&
        (!outletName ||
          item.name.toLowerCase().includes(outletName.trim().toLowerCase()))
    );
  }, [warehouseId, outletName, dataSource]);

  return <Table columns={columns} dataSource={filteredData} rowKey="id" />;
};

export default OutletTable;
