import { useState } from "react"

function Inventory() {
  const [search,setSearch] = useState();
  const [warehouseId,setWareHouseId] = useState();
  return (
    <>
      <h1 className="h1 pb-20">Inventory</h1>
      {/* <div className="flex gap-x-10">
        <input type="text" onChange={(e)=>setSearch(e.target.value)} className="border rounded p-3"/>
        <WarehouseDropDown/>
      </div> */}
    </>
  )
}

export default Inventory
