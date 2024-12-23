import React, {useEffect} from 'react';
import {Button, Form, Input, Space, DatePicker, message} from 'antd';
import dayjs from 'dayjs';
import UploadFiles from "@/components/UploadFiles";
import {updatePaymentSingle, UpdateReimInfo} from "@/services/ant-design-pro/project";
import {StringDatePicker} from "@/components/StringDatePickers";
import SubmitButton from "@/components/Buttons/SubmitButton";

interface ItemListProps {
  currentItem: any
  handleDrawe: () => void
  initData: () => void
}

const PayoutDetails: React.FC<ItemListProps> = ({
                                                  currentItem,
                                                  handleDrawe,
                                                  initData
                                                }) => {

  const [form] = Form.useForm()

  const handleFinish = (values: any) => {
    // const params = {
    //   ...currentItem,
    //   ...values,
    //   payment_id: currentItem?.id ?? '',
    // }

    console.log('values', values)

    const params = {
      id: currentItem.id ?? 0,
      reim_list_id: currentItem.reim_list_id ?? 0,
      reim_desc: values?.reim_desc ?? '',
      amount: values?.amount ?? '',
      file_ids: values?.files ?? '',
      reim_date: values?.reim_date ?? '',
      have_invoice: currentItem.have_invoice ?? '',
      reim_type: currentItem.reim_type ?? '',
      invoice_num: currentItem.invoice_num ?? '',
    };

    UpdateReimInfo(params).then(async (res) => {
      if (res.success) {
        await handleDrawe()
        await initData()
        return
      }
      message.error(res.message)
    })

    // updatePaymentSingle(params).then(async (res) => {
    //   if (res.success) {
    //     await handleDrawe()
    //     await initData()
    //     return
    //   }
    //   message.error(res.message)
    // })
  }

  useEffect(() => {
    console.log('currentItem', currentItem);
    form.setFieldsValue({
      amount: currentItem?.amount ?? '',
      files: currentItem?.file_ids ?? '',
      reim_date: currentItem?.reim_date ?? "",
      reim_desc: currentItem?.reim_desc ?? ''
    })
  }, [])

  return (
    <Form
      labelCol={{span: 5}}
      wrapperCol={{span: 15}}
      style={{maxWidth: 600}}
      form={form}
      onFinish={handleFinish}
    >
      <Form.Item label="金额" name="amount">
        <Input/>
      </Form.Item>
      <Form.Item label="附件" name="files">
        <UploadFiles/>
      </Form.Item>
      {/*<Form.Item label="打款时间" name="pay_at">*/}
      {/*  <StringDatePicker/>*/}
      {/*</Form.Item>*/}

      <Form.Item label="报修明细时间" name="reim_date">
        <StringDatePicker/>
      </Form.Item>

      <Form.Item label="明细" name="reim_desc">
        <Input/>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
        </Space>
      </Form.Item>
    </Form>
  )
}
export default PayoutDetails
