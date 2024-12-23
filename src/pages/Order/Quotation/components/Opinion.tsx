import React from "react"
import { Form, Input, Space, Button, message } from "antd"
import { approveReim } from "@/services/ant-design-pro/quotation"

interface ItemListProps {
  onCloseModal: () => void
  itemId: Number
  success: (text: string) => void
  error: (text: string) => void
}

const Opinion: React.FC<ItemListProps> = ({
  onCloseModal,
  itemId,
  success,
  error,
}) => {

  const handleFinish = (values) => {
    const params = {
      status: 'reject_submit',
      reim_id: itemId ?? 0,
      remark: {
        value: values.opinion ?? '',
        action: 'confirm'
      }
    }
    console.log(params);
    approveReim(params).then(res => {
      if (res.success) {
        onCloseModal()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}
    >
      <Form.Item label="审核意见" name="opinion">
        <Input />
      </Form.Item>
      <Form.Item>
        <Space style={{ marginTop: 30 }}>
          <Button type="primary" danger onClick={() => onCloseModal()}>取 消</Button>
          <Button type="primary" htmlType="submit">确 定</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Opinion