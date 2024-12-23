import React, { useEffect, useState, RefObject } from "react"
import { ActionType } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Select, Space, Table, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { getIncomeList, getInvoiceList } from "@/services/ant-design-pro/maintenanceDepartment";
import ShowFiles from "@/components/ShowFIles";

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

  const [incomeList, setIncomeList] = useState([])
  const [invoiceList, setInvoiceList] = useState([])

  const Income = () => {
    const columns = [
      {
        title: '公司',
        dataIndex: 'company_cn',
      },
      {
        title: '金额',
        dataIndex: 'amount',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '收款时间',
        dataIndex: 'income_at',
      },
      {
        title: '附件',
        render: (dom, entity) => (
          <ShowFiles fileIds={entity.file_ids} />
          // <Button type="primary" onClick={() => {}}>查看</Button>
        )
      },
    ]
    return (
      <Table
        dataSource={incomeList}
        columns={columns}
      />
    )
  }

  const Invoice = () => {
    const columns = [
      {
        title: '发票号',
        dataIndex: 'invoice_no',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '开票时间',
        dataIndex: 'invoice_at',
      },
      {
        title: '附件',
        render: (dom, entity) => (
          <ShowFiles fileIds={entity.file_ids} />
          // <Button type="primary">查看</Button>
        )
      },
    ]
    return (
      <Table
        dataSource={invoiceList}
        columns={columns}
      />
    )
  }

  const tabsList: TabsProps['items'] = [
    {
      key: '1',
      label: '收款记录',
      children: <Income />,
    },
    {
      key: '2',
      label: '开票记录',
      children: <Invoice />,
    },
  ];


  useEffect(() => {
    getIncomeList({ detail_id: currentItem.id }).then(res => {
      if (res.success) {
        setIncomeList(res.data)
      }
    })

    getInvoiceList({ detail_id: currentItem.id }).then(res => {
      if (res.success) {
        setInvoiceList(res.data)
      }
    })
  }, [])

  return (
    <Tabs
      defaultActiveKey="2"
      items={tabsList}
    />
  )
}

export default Detail
