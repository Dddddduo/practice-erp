import React, { useEffect, useState } from "react"
import { Form, DatePicker, Button, Space } from "antd"
import dayjs from "dayjs"
import { gucciMergeQuo, getMergeQuoInfo, gucciGetEventExcel } from "@/services/ant-design-pro/quotation"

interface ItemListProps {
  onCloseSummary: () => void
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
}

const Summary: React.FC<ItemListProps> = ({
  onCloseSummary,
  selectedRowsState,
  success,
  error
}) => {

  const [brand, setBrand] = useState()

  const handleFinish = async (values) => {
    if (!values.month) {
      error('请选择时间')
      return
    }
    let brandId = 0
    for (const i in selectedRowsState) {
      brandId = selectedRowsState[i].brand_id
    }
    values.month = dayjs(values.month.$d).format('YYYY-MM')
    let res
    if (brandId === 1) {
      if (selectedRowsState.map(item => item.class_type).find(type => type === 'event')) {
        res = await gucciMergeQuo({
          quo_ids: selectedRowsState.map(item => item.id).join(','),
          quo_merge_date: values.month
        })
      } else {
        res = await gucciMergeQuo({
          quo_ids: selectedRowsState.map(item => item.id).join(','),
          quo_merge_date: values.month,
          event_title: ''
        })
      }
    } else {
      res = await getMergeQuoInfo({
        quo_ids: selectedRowsState.map(item => item.id).join(','),
        quo_merge_date: values.month
      })
    }
    if (res.success) {
      if (brandId === 1) {
        if (selectedRowsState.map(item => item.class_type).find(type => type === 'event')) {
          await gucciGetEventExcel({ merge_quo_id: res.data.data.event }).then(res => {

          })
        } else {
          for (const item in res.data) {
            window.open(`/PDF/quotation-summary-pdf?merge_quo_id=${res.data[item]}&brand_id=${brandId}&type=${item}`, '_blank')
          }
        }
        return
      }
    } else {
      error(res.message)
    }
  }

  useEffect(() => {
    setBrand(selectedRowsState[0].brand_id)
  }, [])

  return (
    <>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 30 }}
        onFinish={handleFinish}
      >


        {
          brand === 5 ?
            <Form.Item label="汇总周" name="month">
              <DatePicker picker="week" />
            </Form.Item> :
            <Form.Item label="汇总月份" name="month">
              <DatePicker picker="month" />
            </Form.Item>
        }

        <Form.Item>
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="primary" onClick={() => onCloseSummary()}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default Summary