import { StringDatePicker } from '@/components/StringDatePickers';
import { updateUser, usersAdd } from '@/services/ant-design-pro/user';
import { ActionType } from '@ant-design/pro-components';
import type { SelectProps } from 'antd';
import { Button, DatePicker, Form, Input, Select, Space, Switch, Typography } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import React, { RefObject, useEffect, useState } from 'react';

const { Option } = Select;

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  selectedRow: API.UserManagement;
  roleList: any;
  onOk: () => void;
  success: (text: string) => void
  error: (text: string) => void
}

const UpdateUserMessage: React.FC<ItemListProps> = ({
  selectedRow,
  roleList,
  actionRef,
  onOk,
  success,
  error
}) => {

  const [switchState, setSwitchState] = useState(false)
  const [form] = Form.useForm();
  // 角色列表
  const optionsRole: SelectProps['options'] = roleList.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  // 给表单赋值
  const handleFinish = async (values) => {
    const result = {
      user_id: values.user_id ?? undefined,
      username: values.username,
      username_en: values.username_en,
      gender: values.gender === '男' ? '1' : '2',
      // user_role: getNameById(values.user_role).join(),
      role_id: values.user_role ?? [],
      position: values.position,
      department: values.department,
      tel: values.tel,
      email: values.email,
      is_email_receive: values.is_email_receive ? true : false,
      id_number: values.id_number,
      address: values.address,
      hire_date: values.hire_date,
      due_date: values.due_date,
      user_state: selectedRow?.user_state ? 1 : 0,
    };
    console.log(result);
    if (isEmpty(selectedRow)) {
      usersAdd({ data: result }).then(res => {
        if (res.success) {
          if (actionRef.current) {
            onOk();
            actionRef.current.reload();
            success('添加成功')
            return
          }
          return
        }
        error(res.message)
      })
      return
    }
    await updateUser(result).then((res) => {
      if (res.success) {
        if (actionRef.current) {
          onOk();
          actionRef.current.reload();
          success('修改成功')
          return
        }
        return
      }
      error(res.message)
    });
  };

  const onChangeSwitch = (state: boolean) => {
    setSwitchState(state)
  }

  useEffect(() => {
    console.log(selectedRow);
    if (isEmpty(selectedRow)) {
      return
    }
    const switchState = selectedRow?.is_email_receive ? true : false
    setSwitchState(switchState)
    form.setFieldsValue({
      user_id: selectedRow?.user_id ?? -1,
      username: selectedRow?.username ?? '',
      username_en: selectedRow?.username_en ?? '',
      gender: selectedRow?.gender === '1' ? '男' : '女' ?? '',
      user_role: selectedRow?.role_id ?? [],
      position: selectedRow?.position ?? '',
      department: selectedRow?.department ?? '',
      tel: selectedRow?.tel ?? '',
      email: selectedRow?.email ?? '',
      is_email_receive: selectedRow?.is_email_receive ?? -1,
      id_number: selectedRow?.id_number ?? '',
      address: selectedRow?.address ?? '',
      hire_date: dayjs(selectedRow?.hire_date, 'YYYY-MM-DD') ?? '',
      due_date: dayjs(selectedRow?.due_date, 'YYYY-MM-DD') ?? '',
      user_state: selectedRow?.user_state ? 1 : 0 ?? -1,
    });
  }, []);

  return (
    <div>
      <Form
        actionRef={actionRef}
        form={form}
        name="user_id"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        {
          !isEmpty(selectedRow) &&
          <Form.Item label="用户ID" name="user_id">
            <Input disabled />
          </Form.Item>
        }

        <Form.Item
          label="姓名"
          name="username"
          rules={[{ required: true, message: '请输入姓名！' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item label="英文名" name="username_en">
          <Input placeholder="请输入英文名" />
        </Form.Item>

        <Form.Item name="gender" label="性别">
          <Select placeholder="请选择性别" allowClear>
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </Form.Item>

        <Form.Item name="user_role" label="角色">
          <Select mode="multiple" placeholder="请选择角色" allowClear options={roleList} />
        </Form.Item>

        <Form.Item label="职位" name="position">
          <Input placeholder="请输入职位" />
        </Form.Item>

        <Form.Item label="归属部门" name="department">
          <Input placeholder="请输入归属部门" />
        </Form.Item>

        <Form.Item label="电话" name="tel" rules={[{ required: true, message: '请输入手机号！' }]}>
          <Input type="number" placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item label="邮箱" name="email">
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="是否接收邮件" name="is_email_receive">
          <Switch checked={switchState} onChange={onChangeSwitch} />
        </Form.Item>

        <Form.Item label="身份证号" name="id_number">
          <Input placeholder="请输入身份证号" />
        </Form.Item>

        <Form.Item label="地址" name="address">
          <Input placeholder="请输入地址" />
        </Form.Item>

        <Form.Item label="入职日期" name="hire_date">
          <StringDatePicker />
        </Form.Item>

        <Form.Item label="合同到期" name="due_date">
          <StringDatePicker />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Space>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button danger onClick={onOk}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div >
  );
};

export default UpdateUserMessage;
