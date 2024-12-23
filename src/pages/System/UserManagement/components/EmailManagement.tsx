import { Button, Form, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { showUserEmail, createUserEmail, updateUserEmail } from "@/services/ant-design-pro/user";

interface ItemListProps {
  handleCloseEmailManagement: () => void
  currentItem: {
    email: string
    user_id: number
  }
  success: (text) => void
  error: (text) => void
  actionRef: any
}

const EmailManagement: React.FC<ItemListProps> = ({
  handleCloseEmailManagement,
  currentItem,
  success,
  error,
  actionRef
}) => {

  const [form] = Form.useForm()
  const [email, setEmail] = useState('')
  const [emailIId, setEmailId] = useState(0)

  const handleFinish = (values) => {
    const params = {
      sender_staff_id: currentItem.user_id ?? '',
      email: values.email ?? '',
      password: values.password ?? '',
    }
    console.log(params);
    if (email) {
      updateUserEmail(params, emailIId).then(res => {
        if (res.success) {
          handleCloseEmailManagement()
          actionRef.current.reload()
          success('提交成功')
          return
        }
        error(res.message)
      })
      return
    }
    createUserEmail(params).then(res => {
      if (res.success) {
        handleCloseEmailManagement()
        actionRef.current.reload()
        success('提交成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    console.log(currentItem);
    showUserEmail(currentItem.user_id).then(res => {
      if (res.success) {
        setEmail(res.data)
        setEmailId(res.data ? res.data.id : 0)
        form.setFieldsValue({
          email: res.data ? res.data.email : '',
          password: '',
        })
      }
    })

  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}
    >
      <Form.Item label="邮箱" name="email">
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item label="密码" name="password">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseEmailManagement}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default EmailManagement