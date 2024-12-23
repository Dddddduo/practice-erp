import React, {useEffect, useState} from "react";
import {Button, Form, FormInstance, Input, InputNumber, Select, Space} from "antd";
import UploadFiles from "@/components/UploadFiles";
import AddInvoiceModal from "@/components/AddInvoiceModal";
import {find, isEmpty} from "lodash";


interface ApplyInvoiceProps {
  formInstance: FormInstance
  handleFinish: (values: any) => Promise<void>;
  dataSource: {[key: string]: any}
  onChangeCompany: (id) => void
  editData?: {[key: string]: any }
}

const subType = [
  {value: '*建筑服务*维护维修服务', label: '*建筑服务*维护维修服务'},
  {value: '*现代服务*其他服务费', label: '*现代服务*其他服务费'},
  {value: '*信息技术服务*信息系统服务', label: '*信息技术服务*信息系统服务'},
  {value: '*建筑服务*机电工程', label: '*建筑服务*机电工程'},
  {value: '*建筑服务*安装工程', label: '*建筑服务*安装工程'}
]

export const ApplyInvoice: React.FC<ApplyInvoiceProps> = ({dataSource, formInstance, handleFinish, onChangeCompany, editData = {}}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // console.log("edit:", editData)
    let companyInfo = undefined;
    let companyName = '';
    if (dataSource?.companyInfo) {
      const tmp = find(dataSource?.companyInfo, {name: editData?.company_name});
      companyInfo = tmp?.id ?? undefined;
      companyName = tmp?.name ?? '';
    }

    if (!isEmpty(editData)) {
      formInstance.setFieldsValue({
        id: editData?.id ?? 0,
        type: editData?.coll_type ?? undefined,
        company: editData?.seller_company_id ?? undefined,
        address: editData?.address ?? '',
        companyInfo: companyInfo, // editData?.
        company_name: companyName,
        tel: editData?.mobile ?? '',
        money: editData?.amount ?? 0,
        code: editData?.tax_no ?? '',
        bank: editData?.bank_name ?? '',
        remark: editData?.remark ?? '',
        detail: editData?.file_ids ?? '',
        bank_no: editData?.bank_no ?? '',
      });
    }
  }, [editData]);

  const handleModalCancel = () => {
    setShowModal(false);
  }

  return (
    <>
      <Form
        key="invoiceRequestForm"
        form={formInstance}
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        style={{maxWidth: 1200}}
        onFinish={handleFinish}
      >
        <Form.Item label="类型" name="type" rules={[{required: true}]}>
          <Select options={subType} allowClear placeholder="请选择" />
        </Form.Item>

        <Form.Item label="销售方公司" name="company" rules={[{required: true}]}>
          <Select
            options={dataSource?.companyList ?? []}
            allowClear
            showSearch
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
          />
        </Form.Item>

        <Form.Item label="客户开票名称" name="companyInfo" rules={[{ required: true }]}>
          <Select
            style={{flex: 1}}
            showSearch
            options={dataSource?.companyInfo ?? []}
            allowClear
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
            onChange={onChangeCompany}
          />
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Button type="primary" style={{marginLeft: '8px'}} onClick={() => setShowModal(true)}>
            添加公司
          </Button>
        </Form.Item>



        <Form.Item label="地址" name="address" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item label="电话" name="tel" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item label="金额" name="money" rules={[{required: true}]}>
          <InputNumber style={{width: 300}}/>
        </Form.Item>

        <Form.Item label="税号" name="code" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item label="银行" name="bank" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item label="卡号" name="bank_no" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item label="附件" name="detail">
          <UploadFiles/>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea/>
        </Form.Item>

        <Form.Item name="submitType" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item name="company_name" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item name="id" hidden={true}>
          <Input />
        </Form.Item>

        {
          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => formInstance.setFieldsValue({ submitType: 'submit' })}>提交</Button>
              <Button type="primary" htmlType="submit" onClick={() => formInstance.setFieldsValue({ submitType: 'tmp_save' })}>暂存</Button>
            </Space>
          </Form.Item>
        }

      </Form>
      <AddInvoiceModal
        visible={showModal}
        onClose={handleModalCancel}
        type="invoicing"
      />
    </>

  );
}
