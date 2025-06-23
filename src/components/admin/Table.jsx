import { useEffect, useState } from "react";
import { Table } from 'antd';
import Barcode from "react-barcode";
import { useRecoilState } from "recoil";
import { productList } from "../../atoms/sampleAtom";
import useAxios from "../../hooks/useAxios/useAxios";

const CustomTable = ({supplierId}) => {
  const [dataSource, setDataSource] = useRecoilState(productList);
  const {response, error, loading, fetchData} = useAxios();
  const columns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: 'Currency',
    key: 'currency',
    dataIndex: 'currency',
  },
  {
    title: 'Expiration Date',
    key: 'expiration_date',
    dataIndex: 'expiration_date',
  },
  {
    title: 'Manufacture Date',
    key: 'manufacture_date',
    dataIndex: 'manufacture_date',
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Price',
    key: 'price',
    dataIndex: 'price',
  },
  {
    title: 'Supplier ID',
    key: 'supplier_id',
    dataIndex: 'supplier_id',
  },
  {
    title: 'Category',
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: 'Threshold',
    key: 'threshold',
    dataIndex: 'threshold',
  },
  {
    title: 'Wholesale Price',
    key: 'wholesale_price',
    dataIndex: 'wholesale_price',
  },
];

{/* <Barcode className="h-10 w-fit" value="a1b2c3d4-e5f6-7890-abcd-1234567890ef" /> */}
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchProducts = async () => {
      const response = await fetchData({
        url:"/admin/product",
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(response) {
        const result = response.map((item)=>{
          return {
            ...item,
            id:<Barcode className="h-10 w-fit" value={item.id}/>
          }
        })
        setDataSource(result);
      }
      console.log(response);
    }

    fetchProducts();
  }, []);

  return <Table columns={columns} dataSource={dataSource} rowKey="id" />;
};

export default CustomTable;
