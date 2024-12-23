import React, { useEffect, useState, RefObject } from "react"
import { ActionType } from '@ant-design/pro-components';
import { Button, Space, Table } from "antd";
import { LocalStorageService } from "@/utils/utils";
import { isUndefined } from "lodash";
import { mergeQuoFixed } from "@/services/ant-design-pro/fixedMonthly";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseCar: () => void
  brandId: number
  type: string
  setCarList: (list: any) => void
  catList: {}[]
}

const Car: React.FC<ItemListProps> = ({
  success,
  error,
  actionRef,
  handleCloseCar,
  brandId,
  type,
  setCarList,
  catList
}) => {
  const columns: Array<any> = [
    {
      title: 'ID',
      dataIndex: 'quo_fixed_id',
      align: 'center'
    },
    {
      title: '店铺名',
      dataIndex: 'shop_name_cn',
      align: 'center'
    },
    {
      title: '店铺编号',
      dataIndex: 'shop_no',
      align: 'center'
    },
    {
      title: '城市',
      dataIndex: 'city_name_cn',
      align: 'center'
    },
    {
      title: '月结费用',
      dataIndex: 'monthly_amount',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Button type="primary" danger onClick={() => remove(entity)}>删除</Button>
        )
      }
    },
  ]

  const remove = (entity) => {
    const newList = catList?.filter(item => item.quo_fixed_id !== entity.quo_fixed_id)
    setCarList(newList)
    setCarList(newList)
    LocalStorageService.setItem('fixedMonthlyCar', newList)
  }

  const removeAll = () => {
    setCarList([])
    setCarList([])
    LocalStorageService.sync('fixedMonthlyCar', [])
  }

  const summary = () => {
    if (isUndefined(brandId)) {
      error('请选择品牌')
      return
    }

    const params = {
      brand_id: brandId,
      quo_merge_id: '',
      title_info: '',
      type: type,
      shop_ids_arr: catList.map((item: any) => item.shop_id) ?? []
    }
    mergeQuoFixed(params).then(res => {
      if (res.success) {
        window.open(`/quotation-summary-pdf?merge_quo_id=${res.data.STORE}&brand_id=${brandId}&type=fixed`)
        return
      }
      error(res.message)
    })
  }

  return (
    <>
      <Table
        dataSource={catList}
        columns={columns}
      />
      <div style={{ position: 'absolute', bottom: 30 }}>
        <span style={{ marginRight: 10 }}>总共 <span style={{ fontWeight: 700 }}>{catList.length}</span> 条</span>
        <Space>
          {
            catList.length > 0 &&
            <>
              <Button type="primary" onClick={summary}>汇总</Button>
              <Button type="primary" danger onClick={removeAll}>清空</Button>
            </>
          }
          <Button type="primary" ghost danger onClick={() => handleCloseCar()}>关闭</Button>
        </Space>
      </div>
    </>
  )
}

export default Car