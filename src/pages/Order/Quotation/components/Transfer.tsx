import React from "react";
import {Button, Form, Input, message} from "antd";
import {transferQuo} from "@/services/ant-design-pro/quotation";

interface TransferProps {
  fromQuoId: number,
  hideTransfer: () => void
}

const Transfer: React.FC<TransferProps> = ({
  fromQuoId,
  hideTransfer
}) => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const onSubmit = async (values) => {
    console.log(values)
    const result = await transferQuo({
      from_quo_id: fromQuoId,
      ...values
    })
    if (result.success) {
      messageApi.success('转单成功')
      hideTransfer()
    } else {
      messageApi.error(result.message)
    }
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={onSubmit}
      >
        <Form.Item label="待转订单号" name="to_order_no">
          <Input  />
        </Form.Item>

        <Form.Item label="">
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Transfer
