// 修改密码组件

import { updatePassword } from '@/services/ant-design-pro/user';
import { Button, Form, Input, Space, Typography } from 'antd';
import React, { useEffect } from 'react';

interface ItemListProps {
  selectedRow: API.UserManagement;
  onQuite: () => void;
  success: (text: string) => void;
  error: (text: string) => void;
  actionRef: any
}

const UpdatePassword: React.FC<ItemListProps> = ({
  selectedRow,
  onQuite,
  success,
  error,
  actionRef
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: { tel: number; password: string; password_ok: string }) => {
    // console.log(values);
    const customParams = {
      user_id: selectedRow.user_id,
      tel: values.tel,
      password: values.password,
      confirm_password: values.password_ok,
    };
    // console.log(customParams);

    if (values.password === values.password_ok) {
      updatePassword(customParams).then(res => {
        if (res.success) {
          onQuite();
          actionRef.current.reload()
          success('密码修改成功');
          return
        }
        error(res.message)
      })

    }
  };

  useEffect(() => {
    form.setFieldsValue({
      user_id: selectedRow?.user_id ?? -1,
      tel: selectedRow?.tel ?? '',
      password: '',
      password_ok: '',
    });
  }, [selectedRow]);

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: '30px' }}>
        修改密码
      </Typography.Title>
      <Form
        form={form}
        name="user_id"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, position: 'relative', height: 200 }}
        onFinish={handleFinish}
      >
        <Form.Item label="手机号" name="tel">
          <Input disabled type="number" placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="password"
          rules={[
            { required: true, message: '请输入新密码！' },
            { min: 6, max: 16, message: '密码长度在6~16个字符之间！' },
          ]}
          validateTrigger="onBlur"
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="password_ok"
          rules={[
            { required: true, message: '请确认新密码！' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致！'));
              },
            }),
          ]}
          validateTrigger="onBlur"
        >
          <Input.Password placeholder="请确认新密码" />
        </Form.Item>

        <Form.Item style={{ position: 'absolute', right: 50 }}>
          <Space>
            <Button onClick={onQuite}>取消</Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdatePassword;
