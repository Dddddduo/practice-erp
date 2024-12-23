import React, { useEffect, useState, RefObject } from "react"
import { Button, Space, Form, Select, Typography } from "antd"
import type { SelectProps } from 'antd';
import { ActionType } from '@ant-design/pro-components';
import { getBindEventList, userBindEvent } from "@/services/ant-design-pro/pushManagement"

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  onCloseBindModel: () => void
  currentMsg
  success
  error
}
const UserBindEvent: React.FC<ItemListProps> = ({
  actionRef,
  onCloseBindModel,
  currentMsg,
  success,
  error
}) => {
  const [form] = Form.useForm();

  const [eventList, setEventList]: any = useState([])

  const getEventlist = async () => {
    const { data } = await getBindEventList({ name: '' })
    // console.log(data);
    setEventList(data)
  }

  const handleFinish = async (values) => {
    const params = {
      user_ids: [currentMsg.id],
      event_ids: values.event,
      type: 2
    }
    const res = await userBindEvent(params)
    if (!res.success) {
      error(res.message)
      return
    }
    onCloseBindModel()
    actionRef.current?.reload()
    success('绑定成功！')
  }

  const optionsEvent: SelectProps['options'] = eventList.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })

  useEffect(() => {
    getEventlist()

    form.setFieldsValue({
      event: currentMsg.push_events.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      }) ?? ''
    })
  }, [currentMsg])

  return (
    <>
      <Typography.Title level={3}>绑定事件</Typography.Title>
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
          label="事件"
          name="event"
        >
          <Select
            mode="multiple"
            placeholder="请选择事件"
            allowClear
            options={optionsEvent}
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

export default UserBindEvent