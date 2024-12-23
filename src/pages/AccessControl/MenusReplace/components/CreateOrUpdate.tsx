import React from 'react';
import {Button, Form, Input, InputNumber, Space, TreeSelect} from "antd";
interface Props {
  formData: any
  form: any
  closeModal: () => void,
  handleFinished: (values: any) => void
}
const CreateOrUpdate:React.FC<Props> = (props) => {
  const { formData , form , closeModal , handleFinished } = props
  console.log('formData--formData',formData)
  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinished}
    >
      <Form.Item label="名称" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="图标" name="icon">
        <Input />
      </Form.Item>

      <Form.Item label="上级菜单" name="pid" rules={[{ required: true }]}>
        <TreeSelect treeData={formData.menus} />
      </Form.Item>

      <Form.Item label="路径" name="path" rules={[{ required: true }]}>
        <Input placeholder="示例：/父级/当前" />
      </Form.Item>

      {/* <Form.Item label=" " name="level" rules={[{ required: true }]}>
        <TreeSelect treeData={pidData} />
      </Form.Item> */}

      <Form.Item label="排序值" name="sort_by" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: 345 }} placeholder="0~100" />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={closeModal}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateOrUpdate;
