import React, { useEffect, useState, RefObject } from "react"
import { Button, Space, Form, Select, Typography, message } from "antd"
import { ActionType } from '@ant-design/pro-components';
import type { SelectProps } from 'antd';
import { getUserList, userBindEvent } from "@/services/ant-design-pro/pushManagement"

interface ItemListProps {
  onCloseBindModel: () => void
  currentMsg,
  actionRef: RefObject<ActionType>,
  success,
  error,
}

const IncidentBindUser: React.FC<ItemListProps> = ({
  onCloseBindModel,
  currentMsg,
  actionRef,
  success,
  error
}) => {

  const [form] = Form.useForm();

  const [userList, setUserList]: any = useState([])

  const handleFinish = async (values) => {
    const params = {
      user_ids: values.user,
      event_ids: [currentMsg.id],
      type: 1
    }
    const res = await userBindEvent(params)
    if (!res.success) {
      error(res?.message)
      return
    }
    onCloseBindModel()
    actionRef.current?.reload()
    success('绑定成功！')

  }

  const getUsers = async () => {
    const { data } = await getUserList()
    // console.log(data);

    setUserList(data)
  }

  const optionsUsers: SelectProps['options'] = userList.map(item => {
    return {
      value: item.uid,
      label: item.name_cn
    }
  })

  useEffect(() => {
    console.log(currentMsg);

    getUsers()
    form.setFieldsValue({
      user: currentMsg?.users.map(item => {
        return {
          value: item.id,
          label: item.username
        }
      }) ?? ''
    })
  }, [currentMsg])

  return (
    <>
      <Typography.Title level={3}>绑定用户</Typography.Title>
      <Form
        // actionRef={actionRef}
        form={form}
        name="user_id"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="用户"
          name="user"
        >
          <Select
            mode="multiple"
            placeholder="请选择用户"
            options={optionsUsers}
            allowClear
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button onClick={onCloseBindModel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default IncidentBindUser