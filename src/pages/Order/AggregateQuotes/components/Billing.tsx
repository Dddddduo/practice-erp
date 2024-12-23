import React, { useEffect, useState } from 'react'
import {Form, Select, Input, Space, Button, InputNumber, message} from 'antd'
import type { SelectProps } from 'antd';
import { getCustomerInvoiceInfo, createOrUpdateFinanceCollAlone } from '@/services/ant-design-pro/aggregateQuotes'
import {getCompanyList} from "@/services/ant-design-pro/quotation";
import UploadFiles from "@/components/UploadFiles";

interface ItemListProps {
  handleCloseBilling: () => void
  current
  success: (text: string) => void
  error: (text: string) => void
}

const Billing: React.FC<ItemListProps> = ({
  handleCloseBilling,
  current,
  success,
  error
}) => {

  const [form] = Form.useForm()
  const [xsCompanyList, setXSCompanyList]: any = useState()
  const [companyList, setCompanyList]: Array<any> = useState()
  const [actionType, setActionType] = useState('');

  const handleFinish = async (values) => {

    const params = {
      address: values.address ?? '',
      price: values.money ?? '',
      bank_name: values.bank ?? '',
      bank_no: values.cardId ?? '',
      quo_merge_id: current.quo_merge_id ?? '',
      company_id: values.company ?? '',
      seller_company_id: values.seller_company_id,
      company_name: companyList.find(item => item.id === values.company).name,
      mobile: values.mobile ?? '',
      status: actionType ?? '',
      tax_no: values.taxId ?? '',
      type: 'from_quo',
      file_ids: values.detail ?? '',
      remark: values.remark ?? ''
    }

    const hide = message.loading('提交中')
    try {
      const result = await createOrUpdateFinanceCollAlone(params);
      if (result.success) {
        handleCloseBilling()
        message.success('提交成功');
        return;
      }

      message.error('提交失败');
    } catch (err) {
      message.error('提交异常:' + (err as Error).message);
    } finally {
      hide();
    }
  }

  const optionsCompany: SelectProps['options'] = xsCompanyList?.map((item: any) => {
    return {
      value: item.id,
      label: item.company_cn === '' ? item.company_en : item.company_cn,
    };
  });

  const optionsCompanyList: SelectProps['options'] = companyList?.map((item: any) => {
    return {
      value: item.id,
      label: item.name + item.bank_no,
    };
  });

  const handleChangeCompany = (e) => {
    if (e) {
      const data = companyList?.find(item => item.id === e)
      form.setFieldsValue({
        address: data.address ?? '',
        mobile: data.tel ?? '',
        taxId: data.code ?? '',
        bank: data.bank_name ?? '',
        cardId: data.bank_no ?? ''
      })
      return
    }
    form.setFieldsValue({
      address: undefined,
      mobile: undefined,
      taxId: undefined,
      bank: undefined,
      cardId: undefined
    })
  }

  useEffect(() => {
    getCompanyList().then(res => {
      setXSCompanyList(res.data)
    })

    console.log("current", current);
    getCustomerInvoiceInfo({ brand_id: current.brand_id }).then(res => {
      setCompanyList(res.data)
    })

    form.setFieldsValue({
      money: current.total_price_excl_tax,
      type: '*建筑服务*维护维修服务'
    })
  }, [])


  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}
    >
      <Form.Item label="类型" name="type" rules={[{required: true}]}>
        <Input readOnly/>
      </Form.Item>

      <Form.Item label="销售方公司" name="seller_company_id" rules={[{required: true}]}>
        <Select
          options={optionsCompany}
          allowClear
          showSearch
          placeholder="请选择"
          filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
        />
      </Form.Item>

      <Form.Item label="金额" name="money" rules={[{required: true}]}>
        <InputNumber style={{width: 300}}/>
      </Form.Item>
      <Form.Item label="公司" name="company" rules={[{ required: true, message: '请选择公司' }]}>
        <Select options={optionsCompanyList} allowClear onChange={handleChangeCompany} />
      </Form.Item>

      <Form.Item label="地址" name="address" rules={[{ required: true, message: '地址必填' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="电话" name="mobile" rules={[{ required: true, message: '电话必填' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="税号" name="taxId" rules={[{ required: true, message: '税号必填' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="银行" name="bank" rules={[{ required: true, message: '银行必填' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="卡号" name="cardId" rules={[{ required: true, message: '卡号必填' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="附件" name="detail">
        <UploadFiles/>
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <Input.TextArea/>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" onClick={() => setActionType('submit')}>提交</Button>
          <Button htmlType="submit" onClick={() => setActionType('tmp_save')}>暂存</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Billing
