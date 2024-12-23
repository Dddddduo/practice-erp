import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Space } from "antd"
import { approveReim } from '@/services/ant-design-pro/quotation'

interface ItemListProps {
  onCloseApproval: () => void
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
}

const Approval: React.FC<ItemListProps> = ({
  onCloseApproval,
  selectedRowsState,
  success,
  error,
}) => {
  const [type, setType] = useState()
  const handleFinish = (values) => {
    const params = {
      status: type ?? '',
      quo_ids: selectedRowsState.map(item => item.id).join(',') ?? '',
      remark: values.remark ?? ''
    }
    approveReim(params).then(res => {
      if (res.success) {
        onCloseApproval()
        success('处理成功')
        return
      }
      error(res.message)
    })
  }
  return (
    <>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 30 }}
        onFinish={handleFinish}
      >
        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" onClick={() => setType('agree_submit')}>提交</Button>
            <Button type="primary" htmlType="submit" onClick={() => setType('reject_submit')} danger>拒绝</Button>
            <Button type="primary" onClick={() => onCloseApproval()} danger>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default Approval