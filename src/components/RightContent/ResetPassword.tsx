import { useIntl, history } from '@umijs/max';
import { resetpassword } from '@/services/ant-design-pro/api';
import { LocalStorageService } from '@/utils/utils';
import { Button, Form, Input, Space, message} from 'antd';
import React from 'react';
import {FormattedMessage} from "@@/exports";
import { Typography } from 'antd';

interface ItemListProps {
  handleCloseResetPassword: () => void
}

const ResetPassword: React.FC<ItemListProps> = ({ handleCloseResetPassword }) => {
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();

  const { Text } = Typography;

  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };
  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };


  const intl = useIntl()

  const handleFinish = (values: {
    old_password: string
    new_password: string
    confirm_password: string
  }) => {
    const params = {
      oldPassword: values.old_password ?? '',
      newPassword: values.new_password ?? '',
      confirmPassword: values.confirm_password ?? ''
    }
    resetpassword(params).then(res => {
      if (res.success) {
        LocalStorageService.clear()
        history.push('/user/login')
        success('Successfully')
        return
      }
      error(res.message)
    })
  }
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}

    >
      {contextHolder}
      <Form.Item
        label={
          intl.formatMessage({
            id: 'internationalization.field.oldPassword',
            defaultMessage: '旧密码'
          })
        }
        name="old_password"
        rules={[{required: true}]}
      >
        <Input.Password placeholder={intl.formatMessage({
          id: 'internationalization.field.inputOldPassword',
          defaultMessage: '请输入你的旧密码'
        })} />
      </Form.Item>

      <Form.Item
        label={
          intl.formatMessage({
            id: 'internationalization.field.newPassword',
            defaultMessage: '新密码'
          })
        }
        name="new_password"
        rules={[{required: true, min: 8, max: 40}]}
      >
        <Input.Password placeholder={intl.formatMessage({
          id: 'internationalization.field.inputNewPassword',
          defaultMessage: '请输入你的新密码'
        })} />
      </Form.Item>

      <Form.Item
        label={
          intl.formatMessage({
            id: 'internationalization.field.confirmPassword',
            defaultMessage: '确认密码'
          })
        }
        name="confirm_password"
        rules={[
          {required: true},
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('new_password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(intl.formatMessage({
                id: "internationalization.field.inconsistency",
                defaultMessage: '密码不一致'
              })));
            },
          }),
        ]}
      >
        <Input.Password placeholder={intl.formatMessage({
          id: 'internationalization.field.inputConfirmPassword',
          defaultMessage: '请确认你的新密码'
        })} />
      </Form.Item>

      <Form.Item
        label=" "
        colon={false}
      >
        <Text type="danger">新密码必须保证大于等于8位，含有数字字母(不区分大小写)特殊字符（!@#$%^&*(),.?）</Text>
      </Form.Item>


      <Form.Item
        label=" "
        colon={false}
      >
        <Space>
          <Button type='primary' htmlType='submit' >
            <FormattedMessage id='submit' defaultMessage='提交'/>
          </Button>
          <Button danger ghost onClick={handleCloseResetPassword}>
            <FormattedMessage id='cancel' defaultMessage='取消'/>
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ResetPassword
