import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { Table } from "antd";
import { getPaymentList } from "@/services/ant-design-pro/financialReimbursement";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  currentItem: {
    id: number
  }
  handleCloseDetail: () => void
}

const Detail: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  currentItem,
  handleCloseDetail,
}) => {

  const [baseData, setBaseData] = useState([])

  const columns = [
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '打款时间',
      dataIndex: 'pay_at',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'file',
      align: 'center',
    },
  ]

  useEffect(() => {
    console.log(currentItem);

    getPaymentList({ detail_id: currentItem.id }).then(res => {
      if (res.success) {
        setBaseData(res.data)
      }
    })
  }, [])

  return (
    <Table
      dataSource={baseData}
      columns={columns}
      pagination={false}
    />
  )
}

export default Detail