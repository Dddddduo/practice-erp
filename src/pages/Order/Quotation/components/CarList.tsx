import React, { useEffect, useState } from 'react'
import { Button, Space, Table } from 'antd'
import { mergeQuo } from '@/services/ant-design-pro/quotation'
import { LocalStorageService } from "@/utils/utils";

interface ItemListProps {
  carList: Array<any>
  handleCarList: (list) => void
}

const CarList: React.FC<ItemListProps> = ({
  carList,
  handleCarList
}) => {

  const [list, setList]: any = useState([])

  const remove = (entity) => {
    const newList = list.filter(item => item.id !== entity.id)
    setList(newList)
    handleCarList(newList)
    LocalStorageService.setItem('carList', newList)
  }

  const removeAll = () => {
    setList([])
    handleCarList([])
    LocalStorageService.sync('carList', [])
  }

  const summaryAll = () => {
    let brand_id
    for (const item in list) {
      brand_id = list[item].brand_id
    }
    mergeQuo({ quo_ids: list.map(item => item.id).join(',') }).then(res => {
      if (res.success) {
        removeAll()
        window.open(`/quotation-summary-pdf?merge_ids=${list.map(item => item.id).join(',')}&brand_id=${brand_id}`)
      }

    })
  }

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'id',
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
      title: '报销单编号',
      dataIndex: 'order_no',
      align: 'center',
      render: (dom) => {
        return (
          <a>{dom}</a>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Button type='primary' danger onClick={() => remove(entity)}>移除</Button>
        )
      }
    },
  ]

  useEffect(() => {
    console.log(carList);
    setList(carList.map(item => {
      item.key = item.id
      return item
    }))
  }, [])
  return (
    <>
      <Table
        columns={columns}
        dataSource={list}
      />
      {
        list.length > 0 &&
        <Space style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '30px'
        }}>
          <Button type='primary' danger onClick={removeAll}>清空全部</Button>
          <Button type='primary' onClick={summaryAll}>汇总全部</Button>
        </Space>
      }

    </>
  )
}

export default CarList