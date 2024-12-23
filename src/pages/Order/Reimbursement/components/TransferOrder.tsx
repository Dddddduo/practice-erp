import React, {RefObject} from "react";
import {Button, Form, Input, message} from "antd";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { Radio } from 'antd';
import {transferReim} from "@/services/ant-design-pro/reimbursement";
import {ActionType} from "@ant-design/pro-components";

interface Props {
  fromReimId: number,
  handleClose: () => void
  actionRef: RefObject<ActionType>;
}

const TransferOrder:React.FC<Props> = ({handleClose, fromReimId, actionRef}) => {

  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    console.log(value, 'onFinish')

    const params = {
      "to_order_no": value?.to_order_no ?? '',
      "from_reim_id":  fromReimId,
      "keep_old_reim": value?.keep_old_reim ?? '',
    }

    try {
      const res = await transferReim(params)
      if(!res.success) {
        message.error(res.message)
        return
      }

      message.success('转单成功')
      handleClose()
      actionRef?.current?.reload()
    } catch (err) {
      message.error('请求失败' + (err as Error).message)
    }
  }


  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="待转移订单号"
        name="to_order_no"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='是否保存原报销单'
        name="keep_old_reim"
      >
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>

      </Form.Item>

      <div style={{ textAlign: 'end' }}>
        <SubmitButton form={form} type='primary' style={{marginRight: 8}}>确定</SubmitButton>
        <Button onClick={handleClose}>取消</Button>
      </div>
    </Form>
  )
}

export default  TransferOrder
