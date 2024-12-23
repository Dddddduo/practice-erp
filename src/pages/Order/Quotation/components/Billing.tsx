import React, {useEffect, useState} from 'react'
import {Form, Input, Select, Button, Space, InputNumber, message, Card, Table} from "antd"
import {
  getCompanyList,
  getCustomerInvoiceInfo,
  createOrUpdateFinanceCollAlone
} from '@/services/ant-design-pro/quotation'
import type {SelectProps} from 'antd';
import * as math from 'mathjs'
import UploadFiles from "@/components/UploadFiles";
import {isEmpty} from "lodash";
import {EyeOutlined} from "@ant-design/icons";
import PaymentRequestRecord from "@/pages/Project/FullPQI/components/FinalAccount/PaymentRequestRecord";

interface ItemListProps {
  onCloseBillimg: () => void
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
}

const Billing: React.FC<ItemListProps> = ({
                                            onCloseBillimg,
                                            selectedRowsState,
                                            success,
                                            error
                                          }) => {

  const [form] = Form.useForm()

  const [companyList, setCompanyList]: any = useState()
  const [customerInvoiceInfo, setCustomerInvoiceInfo]: any = useState()
  const [company, setCompany]: any = useState()
  const [actionType, setActionType] = useState('');

  const handleFinish = async (values) => {
    let tax_rate
    let quo_id_list: any = []
    for (const item in selectedRowsState) {
      tax_rate = math.chain(selectedRowsState[item].tax_rate).round(2).done()
      quo_id_list.push(selectedRowsState[item].id)
    }

    const params = {
      address: values.address ?? '',
      bank_name: values.bank ?? '',
      bank_no: values.cardId ?? '',
      company_id: values.customerCompany ?? '',
      company_name: company?.name,
      remark: values.remark ?? '',
      mobile: values.mobile ?? '',
      price: values.money ?? '',
      quo_id_list: quo_id_list,
      seller_company_id: values.company,
      status: actionType ?? '',
      tax_no: values.taxId ?? '',
      tax_rate: tax_rate,
      type: 'from_quo',
      file_ids: values.detail ?? '',
    }

    const hide = message.loading('提交中')
    try {
      const result = await createOrUpdateFinanceCollAlone(params);
      if (result.success) {
        onCloseBillimg()
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

  const optionsCompany: SelectProps['options'] = companyList?.map((item: any) => {
    return {
      value: item.id,
      label: item.company_cn === '' ? item.company_en : item.company_cn,
    };
  });

  const optionsCustomerInvoiceInfo: SelectProps['options'] = customerInvoiceInfo?.map((item: any) => {
    return {
      value: item.id,
      label: item.name + item.bank_no,
    };
  });

  const handleChangeCompany = (e) => {
    const data = customerInvoiceInfo.find(item => item.id === e)
    setCompany(data)
    form.setFieldsValue({
      address: data.address ?? '',
      mobile: data.tel ?? '',
      taxId: data.code ?? '',
      bank: data.bank_name ?? '',
      cardId: data.bank_no ?? ''
    })
  }

  useEffect(() => {
    console.log(selectedRowsState);
    let brandId = 0
    for (const i in selectedRowsState) {
      brandId = selectedRowsState[i].brand_id
    }
    getCompanyList().then(res => {
      setCompanyList(res.data)
    })
    getCustomerInvoiceInfo({brand_id: brandId}).then(res => {
      setCustomerInvoiceInfo(res.data)
    })
    let money = selectedRowsState.reduce((pre, item) => pre + Number(item.total_price_excl_tax)!, 0)
    console.log('selectedRowsState--selectedRowsState',selectedRowsState)
    form.setFieldsValue({
      money: money,
      type: '*建筑服务*维护维修服务'
    })
  }, [])



  return (
    <>
      <Form
        form={form}
        labelCol={{span: 5}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600, marginTop: 30}}
        onFinish={handleFinish}
      >
        <Form.Item label="类型" name="type" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="销售方公司" name="company" rules={[{required: true}]}>
          <Select
            options={optionsCompany}
            allowClear
            showSearch
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
          />
        </Form.Item>

        <Form.Item label="公司" name="customerCompany">
          {/*<div style={{display: 'flex', alignItems: 'center'}}>*/}
          <Select
            style={{flex: 1}}
            showSearch
            options={optionsCustomerInvoiceInfo}
            allowClear
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
            onChange={handleChangeCompany}
          />
          {/*<Button type="primary" style={{marginLeft: '8px'}} onClick={showModal}>*/}
          {/*  添加*/}
          {/*</Button>*/}
          {/*</div>*/}
        </Form.Item>

        <Form.Item label="地址" name="address" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="电话" name="mobile" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="金额" name="money" rules={[{required: true}]}>
          <InputNumber style={{width: 300}}/>
        </Form.Item>

        <Form.Item label="税号" name="taxId" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="银行" name="bank" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="卡号" name="cardId" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="附件" name="detail">
          <UploadFiles/>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea/>
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Space>
            <Button type="primary" htmlType="submit" onClick={() => setActionType('submit')}>提交</Button>
            <Button htmlType="submit" onClick={() => setActionType('tmp_save')}>暂存</Button>
          </Space>
        </Form.Item>
      </Form>

      <PaymentRequestRecord currentItem={[]} />
    </>
  )
}

export default Billing
