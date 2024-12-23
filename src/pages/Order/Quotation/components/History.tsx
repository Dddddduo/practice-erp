import React, { useEffect, useState } from "react"
import { Table } from "antd"
import { getQuoHistoryList } from "@/services/ant-design-pro/quotation"
import { FormattedMessage, useIntl } from "@@/exports";

interface ItemListProps {
  currentItem: any
}

const History: React.FC<ItemListProps> = ({
  currentItem,
}) => {

  const [historyList, setHistoryList]: any = useState()

  const addZero = (value) => {
    if (value < 10) {
      return `0${value}`
    }
    return value
  }


  historyList?.map((item, index) => {
    item.key = item.back_id
    item.quo_no = `Re${addZero(index + 1)}-${currentItem.quo_no}`
    return item
  })

  const columns: any = [
    {
      title: '历史报价编号',
      dataIndex: 'history_quo_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <a href={`/PDF/OrderQuotationPdf?id=${entity.back_id}`} target="_blank">{entity.quo_no}</a>
        )
      }
    },
    {
      title: '备份时间',
      dataIndex: 'back_at',
      align: 'center',
    },
  ]

  useEffect(() => {
    console.log(currentItem);

    getQuoHistoryList({ quo_id: currentItem.id }).then(res => {
      setHistoryList(res.data)
    })
  }, [])

  return (
    <>
      <Table
        columns={columns}
        dataSource={historyList}
      />
    </>
  )
}

export default History