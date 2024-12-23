import { Button, Drawer, Space, Table } from "antd"
import React, { RefObject, useEffect, useState } from "react"
import { getFinanceReimOfficeAloneList } from "@/services/ant-design-pro/financialReimbursement"
import Enter from "./Enter"


interface ItemListProps {
  createTime: string
  actionRef: any
  success: (text: string) => void
  error: (text: string) => void
}

const Payouts: React.FC<ItemListProps> = ({
  createTime,
  actionRef,
  success,
  error,
}) => {
  const [baseData, setBaseData] = useState([])
  const [showEnter, setShowEnter] = useState(false)
  const [currentItem, setCurrentItem] = useState([])

  const columns: any = [
    {
      title: '姓名',
      dataIndex: "username",
      align: 'center',
    },
    {
      title: '明细',
      dataIndex: "detail",
      align: 'center',
      render: (dom, entity) => {
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>有票金额：</div>
              <div style={{ marginRight: 10 }}>{entity.with_invoice_amount}</div>
              <Space>
                <Button size="small" type="primary" onClick={() => {
                  setShowEnter(true)
                  setCurrentItem(entity.with_invoice_payment_list)
                }}>打款</Button>
                <Button size="small" type="primary">查看</Button>
              </Space>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
              <div>无票金额：</div>
              <div style={{ marginRight: 10 }}>{entity.without_invoice_amount}</div>
              <Space>
                <Button size="small" type="primary" onClick={() => {
                  setShowEnter(true)
                  setCurrentItem(entity.without_invoice_payment_list)
                }}>打款</Button>
                <Button size="small" type="primary">查看</Button>
              </Space>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>总计：</div>
              <div>{entity.total_amount}</div>
            </div>
          </div>
        )
      }
    },
  ]

  const handleCloseEnter = () => {
    setShowEnter(false)
    setCurrentItem([])
  }

  useEffect(() => {
    getFinanceReimOfficeAloneList({ office_alone_at: createTime }).then(res => {
      if (res.success) {
        setBaseData(res.data)
      }
    })
  }, [])

  return (
    <>
      <Table
        dataSource={baseData}
        columns={columns}
      />

      <Drawer
        width={800}
        open={showEnter}
        onClose={handleCloseEnter}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Enter
          handleCloseEnter={handleCloseEnter}
          currentItem={currentItem}
          success={success}
          error={error}
          path="office"
        />
      </Drawer>
    </>
  )
}

export default Payouts
