import React, {useState, useReducer, useEffect} from 'react';
import {Table,} from 'antd';
import {finalAcceptance} from '@/services/ant-design-pro/project';
import {isObject} from 'lodash';
import {millennials} from "@/utils/utils";

interface ItemListProps {
  currentMsg: any
}

const LookTotals: React.FC<ItemListProps> = ({
                                               currentMsg,
                                             }) => {

  const [data, setData] = useState<any>([
    {
      title: 'contract_price',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'contract_cost',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'contract_profit',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'vo_price',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'vo_cost',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'vo_profit',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'total_amount',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'total_cost',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
    {
      title: 'total_profit',
      ex_vat: '',
      in_vat: '',
      profit_rate: '',
    },
  ])

  // millennials
  const columns: any = [
    {
      title: 'Item',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: 'Ex.VAT',
      dataIndex: 'ex_vat',
      align: 'center',
    },
    {
      title: 'In.VAT',
      dataIndex: 'in_vat',
      align: 'center',
    },
    {
      title: 'RATE',
      dataIndex: 'profit_rate',
      align: 'center',
    },
  ]

  useEffect(() => {
    finalAcceptance(currentMsg.id).then((res) => {
      if (res.success) {
        const format: {}[] = []
        Object.keys(res.data).map(key => {
          data.map(item => {
            if (item.title === key) {
              item.in_vat = res.data[key]
              item.ex_vat = res.data[`ex_${key}`]
              if (item.title === 'contract_profit') {
                item.profit_rate = res.data['contract_rate']
              }
              if (item.title === 'vo_profit') {
                item.profit_rate = res.data['vo_rate']
              }
              if (item.title === 'total_profit') {
                item.profit_rate = res.data['total_rate']
              }
              format.push(item)
            }
          })
        })

        // 后面添加项：报销、奖金、其他、利润
        if ('reim' in res.data && 'exReim' in res.data) {
          format.push({
            title: '报销项',
            ex_vat: res.data?.exReim,
            in_vat: res.data?.reim,
            profit_rate: '',
          })
        }

        if ('bonus' in res.data && 'exBonus' in res.data) {
          format.push({
            title: '奖金',
            ex_vat: res.data?.exBonus,
            in_vat: res.data?.bonus,
            profit_rate: '',
          })
        }

        if ('other' in res.data && 'exOther' in res.data) {
          format.push({
            title: '其他',
            ex_vat: res.data?.exOther,
            in_vat: res.data?.other,
            profit_rate: '',
          })
        }

        if ('final_profit' in res.data && 'ex_final_profit' in res.data && 'final_rate' in res.data) {
          format.push({
            title: '最终利润',
            ex_vat: res.data?.ex_final_profit,
            in_vat: res.data?.final_profit,
            profit_rate: res.data?.final_rate,
          })
        }

        setData(format)
      }
    })
  }, [])
  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </>
  )
}
export default LookTotals
