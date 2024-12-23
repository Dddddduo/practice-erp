import React, { useEffect, useState } from 'react'
import { Form, Select, Button, Space } from "antd"
import type { SelectProps } from 'antd';
import { getColorMarkList, quoColorMark } from '@/services/ant-design-pro/quotation';

interface ItemListProps {
  onCloseMarkerColor: () => void
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
  currentItem: any
  actionRef: any
}

const MarkerColor: React.FC<ItemListProps> = ({
  onCloseMarkerColor,
  selectedRowsState,
  success,
  error,
  currentItem,
  actionRef
}) => {
  const [color, setColor]: any = useState()

  const handleFinish = (values) => {
    console.log(currentItem);
    const params = {
      color_mark: values.color ?? '',
      quo_id: currentItem ? currentItem.id : '',
      quo_ids: currentItem ? '' : selectedRowsState.map(item => item.id).join(',')
    }
    console.log(params);
    quoColorMark(params).then(res => {
      if (!res.success) {
        error(res.message)
        return
      }
      onCloseMarkerColor()
      actionRef.current.reload()
      success('处理成功')
    })
  }

  useEffect(() => {
    getColorMarkList().then(res => {
      setColor(res.data.map(item => ({ value: item, label: item })))
    })
  }, [])

  return (
    <>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 30 }}
        onFinish={handleFinish}
      >
        <Form.Item label="选择颜色" name="color">
          <Select options={color} />
        </Form.Item>

        <Form.Item>
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="primary" onClick={() => onCloseMarkerColor()}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default MarkerColor