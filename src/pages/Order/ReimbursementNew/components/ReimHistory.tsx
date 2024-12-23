import React, { useEffect } from "react"
import { Typography, Table } from "antd";


interface ItemListProps {
  historyList: [];
  showReimOrderDetail: (entity: object) => void
}

/***
 * 报销历史列表
 * @constructor
 */
const ReimHistory: React.FC<ItemListProps> = ({
  historyList,
  showReimOrderDetail
}) => {

  const columns = [
    {
      title: '历史报销编号',
      dataIndex: 'order_no',
      key: 'back_id',
      render: (dom, entity) => {
        return (
          <a onClick={() => showReimOrderDetail(entity)}>{dom}</a>
        )
      }
    },
    {
      title: '备份时间',
      dataIndex: 'back_at',
      key: 'back_id',
    },
    {
      title: '备份人',
      dataIndex: 'back_name',
      key: 'back_id',
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'back_id',
    },
    {
      title: '创建平台',
      dataIndex: 'back_plat_cn',
      key: 'back_id',
    },
  ]

  return (
    <>
      <Typography.Title level={3}>历史报销记录</Typography.Title>
      <Table
        columns={columns}
        dataSource={historyList}
      />
    </>
  )
}

export default ReimHistory
