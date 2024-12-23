import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { Button, Form, Input, Space, Select } from "antd";
import { isEmpty } from "lodash";
import { getPositions, createButton, updateButton } from "@/services/ant-design-pro/accessControl";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseCreateOrUpdate: () => void
  currentItem: {
    id: number,
    name: string,
    module: string,
    pos: string,
    remark: string
  }
}

const { TextArea } = Input;

const CreateOrUpdate: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseCreateOrUpdate,
  currentItem,
}) => {
  const [form] = Form.useForm()
  const [positions, setPositions] = useState<{ value: string, label: any }[]>([])

  const handleFinish = (values) => {
    console.log(values);

    let params = {
      name: values.name ?? '',
      module: values.module ?? '',
      pos: values.pos ?? '',
      remark: values.remark ?? '',
    }

    if (isEmpty(currentItem)) {
      createButton(params).then(res => {
        if (res.success) {
          handleCloseCreateOrUpdate()
          actionRef.current?.reload()
          success('添加成功')
          return
        }
        error(res.message)
      })
      return
    }
    params = {
      ...params,
      id: currentItem.id
    }
    updateButton(params).then(res => {
      if (res.success) {
        handleCloseCreateOrUpdate()
        actionRef.current?.reload()
        success('修改成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    getPositions().then(res => {
      if (res.success) {

        const operate = Object.keys(res.data).map(key => {
          return {
            value: key,
            label: res.data[key] ?? ''
          };
        });
        setPositions(operate)
      }
    })
    if (isEmpty(currentItem)) {
      return
    }

    form.setFieldsValue({
      name: currentItem.name ?? '',
      module: currentItem.module ?? '',
      pos: currentItem.pos ?? '',
      remark: currentItem.remark ?? '',
    })
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item label="名称" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="模块" name="module" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="位置" name="pos" rules={[{ required: true }]}>
        <Select
          options={positions}
        />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseCreateOrUpdate}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrUpdate