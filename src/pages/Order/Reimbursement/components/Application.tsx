import React, {RefObject} from "react"
import { Form, Input, Select, Button } from "antd"
import { createFinanceReimBatch } from "@/services/ant-design-pro/reimbursement"
import { ActionType } from '@ant-design/pro-components';

interface ItemListProps {
  selectedRowsState,
  actionRef: RefObject<ActionType>;
  onCloseApplicationModel: () => void
  success: (text: string) => void
  error: (text: string) => void
}

const Application: React.FC<ItemListProps> = ({
  selectedRowsState,
  actionRef,
  onCloseApplicationModel,
  success,
  error
}) => {

  const type = [
    {
      value: '公',
      label: '公'
    },
    {
      value: '私',
      label: '私'
    },
  ]
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    const trd_id_list: any = []
    selectedRowsState.map((item: any) => {
      trd_id_list.push(item.id)
    })
    const params = {
      status: 'submit',
      coll_channel: values.type ?? '',
      bank_name: values.name ?? '',
      bank_no: values.account ?? '',
      reim_desc: values.remark ?? '',
      trd_id_list: trd_id_list ?? []
    }
    createFinanceReimBatch(params).then(res => {
      if (res.success) {
        onCloseApplicationModel()
        success('记录成功')
        actionRef.current?.reload()
        return 
      }
      error(res.message)
    })
  }

  const staging = () => {
    const trd_id_list: any = []
    selectedRowsState.map((item: any) => {
      trd_id_list.push(item.id)
    })
    const params = {
      status: 'tmp_save',
      trd_id_list: trd_id_list ?? []
    }
    createFinanceReimBatch(params).then(res => {
      if (res.success) {
        onCloseApplicationModel()
        success('记录成功')
        actionRef.current?.reload()
        return 
      }
      error(res.message)
    })
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item label="收款类型" name="type">
        <Select options={type} />
      </Form.Item>

      <Form.Item label="开户行名称" name="name" rules={[{ required: true, message: '开户行名称必填！' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="银行账户" name="account" rules={[{ required: true, message: '银行账户必填！' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="用途描述" name="remark">
        <Input.TextArea />
      </Form.Item>

      <Form.Item style={{ position: 'relative', left: 135 }}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={staging}>暂存</Button>
        <Button type="primary" htmlType="submit">确定</Button>
      </Form.Item>
    </Form>
  )
}

export default Application