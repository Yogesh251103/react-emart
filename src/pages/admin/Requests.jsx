import RequestTable from '@/components/admin/RequestTable';
import { Modal } from 'antd';
import React, { useState } from 'react'

function Requests() {
  const [pendingCount,setPendingCount] = useState(0);
  return (
    <>
    <div className='w-full flex justify-between'>
      <h1 className='h1'>{pendingCount}</h1>
      <Modal>

      </Modal>
      <RequestTable />
    </div>
    </>
  )
}

export default Requests
