import { Table } from "antd"
import { MdOutlineAdd, MdOutlineEdit } from "react-icons/md"
import { useRecoilState } from "recoil"
import { supplierAtom } from "../../../atoms/sampleAtom"
import useAxios from "../../../hooks/useAxios/useAxios"

function Supplier() {
  const [supplierData,setSupplierData] = useRecoilState(supplierAtom)
  const {response , error , loading , fetchData} = useAxios();
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "logo",
      dataIndex: "logo",
      key: "logo"
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email"
    },{
      title: "phone",
      dataIndex: "phone",
      key: "phone"
    },{
      title: "address",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "tax number",
      dataIndex: "tax_number",
      key: "tax_number"
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Edit",
      key: "edit",
      dataIndex: "edit",
      render: (_,record)=>{
        <button>
          <MdOutlineEdit/>
        </button>
      }
    }
  ]
  return (
    <div>
      <div>
        <h1 className='p-2 text-2xl font-bold'>Suppliers</h1>
      </div>
      <div className="flex justify-between">
        <button className="flex flex-row justify-center items-center p-2 bg-[#FC4C4B] rounded-md text-white">
          Add New Supplier <MdOutlineAdd/>
        </button>
      </div>
      <div>
        <Table dataSource={supplierData} columns={columns}/>
      </div>
    </div>
  )
}

export default Supplier
