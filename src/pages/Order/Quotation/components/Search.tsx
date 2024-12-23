import React, { useState } from "react"
import { Table, Tabs } from "antd"

interface ItemListProps {
  quohistoryPrice,
  reimhistoryPrice,
  quoPartsPrice
}

const Search: React.FC<ItemListProps> = ({
  quohistoryPrice,
  reimhistoryPrice,
  quoPartsPrice
}) => {

  const [tabItem, setTabItem] = useState(1)

  const tabs = [
    {
      id: 1,
      name: '递交客户端历史报价'
    },
    {
      id: 2,
      name: '工人历史成本'
    }
  ]

  const handleChangeTabs = (e) => {
    setTabItem(e)
  }

  const quohistoryPriceColumns: any = [
    {
      title: '明细',
      dataIndex: 'k',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'v',
      align: 'center',
    },
    {
      title: '报价单编号',
      dataIndex: 'quo_no',
      align: 'center',
      render: (dom) => {
        return (
          <a>{dom}</a>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'create_at',
      align: 'center',
    },
  ]

  const reimhistoryColumns: any = [
    {
      title: '明细',
      dataIndex: 'k',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'v',
      align: 'center',
    },
    {
      title: '报销单编号',
      dataIndex: 'reim_no',
      align: 'center',
      render: (dom) => {
        return (
          <a href={`/order/reimbursement?reim_no=${dom}`} target="_blank">{dom}</a>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'create_at',
      align: 'center',
    },
  ]

  const quoPartsPriceColumns: any = [
    {
      title: '明细',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
    },
  ]

  return (
    <>
      <div>
        <div>历史报价</div>
        <Table
          columns={quohistoryPriceColumns}
          dataSource={quohistoryPrice}
        />
      </div>
      <div>
        <div>配件价格</div>
        <Tabs defaultActiveKey="1" onChange={handleChangeTabs} items={tabs.map(item => {
          {
            return {
              label: item.name,
              key: item.id,
              children: <>
                {
                  tabItem === 1 ?
                    <Table
                      columns={quoPartsPriceColumns}
                      dataSource={quoPartsPrice}
                    /> :
                    <Table
                      columns={reimhistoryColumns}
                      dataSource={reimhistoryPrice}
                    />
                }

              </>,
            };
          }
        })} />;
      </div>
    </>
  )
}

export default Search