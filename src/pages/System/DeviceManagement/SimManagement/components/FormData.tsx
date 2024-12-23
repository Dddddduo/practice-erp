import {Button, Form, Input, Radio, Select, Space} from "antd";
import React from "react";
import {StringDatePicker} from "@/components/StringDatePickers";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {BaseDataParams} from "@/viewModel/System/DeviceManagement/useViewSimManagement";


interface FormDataProps {
  form,
  baseData: BaseDataParams
  handleFinishForm: () => void
  handleChangeStatus: (e: any) => void
}

const FormData: React.FC<FormDataProps> = ({
                                             form,
                                             baseData,
                                             handleFinishForm,
                                             handleChangeStatus
                                           }) => {
  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: 800 }}
    >
      <Form.Item label="卡号" name="card_no" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="ICC ID" name="icc_id">
        <Input />
      </Form.Item>

      <Form.Item label="运营商" name="operator_id">
        <Select
          options={baseData?.operatorList}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item label="供应商" name="vendor_id">
        <Select
          options={baseData?.vendorList}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item label="启用状态" name="status">
        <Radio.Group value={baseData?.status} onChange={handleChangeStatus}>
          <Radio value={1}>启用</Radio>
          <Radio value={0}>停用</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="有效开始" name="start_at">
        <StringDatePicker />
      </Form.Item>

      <Form.Item label="有效结束" name="end_at">
        <StringDatePicker />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" onConfirm={handleFinishForm}>提交</SubmitButton>
          <Button type="primary" danger>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FormData
