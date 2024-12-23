import SubmitButton from "@/components/Buttons/SubmitButton"
import { StringDatePicker } from "@/components/StringDatePickers"
import UploadFiles from "@/components/UploadFiles"
import { invoiceOcr } from "@/services/ant-design-pro/financialReimbursement"
import { invoicePqiCostEstimate } from "@/services/ant-design-pro/pqi"
import { Card, Form, Input, Space, Table, message } from "antd"
import { isEmpty } from "lodash"
import React, { useEffect, useState } from "react"

interface PaymentParams {
  handleClosePayment: () => void
  orderId: number
  orderSupplierId: number
  reimDetailList: []
  currentItem: any
}

const Payment: React.FC<PaymentParams> = ({
  handleClosePayment,
  orderId,
  orderSupplierId,
  reimDetailList,
  currentItem,
}) => {
  const [form] = Form.useForm()
  const [detailList, setDetailList] = useState([])
  const [loading, setLoading] = useState(true)
  const columns: {}[] = [
    {
      title: '序号',
      dataIndex: '',
      align: 'center',
      render: (_, row, index) => <>{index + 1}</>
    },
    {
      title: '明细',
      dataIndex: 'detail',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '单价',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '合作工人',
      dataIndex: 'worker_name',
      align: 'center',
    },
    {
      title: '费用类别',
      dataIndex: 'reim_type',
      align: 'center',
    },
  ]


  const handleFinish = async (values) => {
    const params = {
      trd_id: currentItem?.id ?? 0,
      seller_name: values?.seller_name ?? '',
      in_amount: values?.in_amount ?? '',
      ex_amount: values?.ex_amount ?? '',
      tax_amount: values?.tax_amount ?? '',
      tax_rate: values?.tax_rate ?? '',
      seller_register_num: values?.seller_register_num ?? '',
      invoice_num: values?.invoice_num ?? '',
      invoice_date: values?.invoice_date ?? '',
      file_ids: values?.files ?? '',
      remark: values?.remark ?? '',
      reim_detail_list: detailList ?? [],
      type: 'fm_vendor_reim',
    }

    try {
      const res = await invoicePqiCostEstimate(params)
      if (res.success) {
        message.success('提交成功')
        handleClosePayment()
        return
      }
      message.error(res.message)
    } catch (error) {
      message.error('提交异常')
    }
  }

  const handleUpload = async (file_id: string) => {
    if (file_id) {
      try {
        const fileList = file_id.split(',')
        const params = {
          file_id: isEmpty(fileList) ? '' : fileList[fileList.length - 1],
          file_type: 'pdf'
        }
        const res = await invoiceOcr(params)

        if (!res.success) {
          message.error('获取发票信息失败')
          return
        }

        form.setFieldsValue({
          seller_name: res.data?.seller_name ? res.data?.seller_name : form.getFieldValue('seller_name'),
          in_amount: res.data?.amount_in_figuers ? res.data?.amount_in_figuers : form.getFieldValue('in_amount'),
          ex_amount: res.data?.total_amount ? res.data?.total_amount : form.getFieldValue('ex_amount'),
          tax_amount: res.data?.total_tax ? res.data?.total_tax : form.getFieldValue('tax_amount'),
          tax_rate: res.data?.tax_rate ? parseFloat(res.data?.tax_rate).toFixed(2) : form.getFieldValue('tax_rate'),
          seller_register_num: res.data?.seller_register_num ? res.data?.seller_register_num : form.getFieldValue('seller_register_num'),
          invoice_num: res.data?.invoice_num ? res.data?.invoice_num : form.getFieldValue('invoice_num'),
          invoice_date: res.data?.invoice_date ? res.data?.invoice_date : form.getFieldValue('invoice_date'),
        })
        message.success('获取发票信息成功')
      } catch (error) {
        message.error('获取发票信息异常')
      }
    }
  }

  useEffect(() => {
    const detailList = []
    reimDetailList.forEach((item: {
      reim_detail_list: []
    }[]) => {
      item[0].reim_detail_list.forEach(element => {
        detailList.push(element)
      });
    })
    setDetailList(detailList)
    setLoading(false)
  }, [])

  return (
    <>
      <Card
        title="开票录入"
        bordered
        style={{ marginBottom: 30 }}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 600 }}
          onFinish={handleFinish}
        >
          <Form.Item label="收款公司" name="seller_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="总金额(含税)" name="in_amount" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="金额(不含税)" name="ex_amount">
            <Input />
          </Form.Item>

          <Form.Item label="税额" name="tax_amount">
            <Input />
          </Form.Item>

          <Form.Item label="税率" name="tax_rate">
            <Input />
          </Form.Item>

          <Form.Item label="税号" name="seller_register_num">
            <Input />
          </Form.Item>

          <Form.Item label="发票号" name="invoice_num">
            <Input />
          </Form.Item>

          <Form.Item label="开票时间" name="invoice_date">
            <StringDatePicker />
          </Form.Item>

          <Form.Item label="附件" name="files">
            <UploadFiles onChange={handleUpload} />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              <SubmitButton form={form} type="primary">提交</SubmitButton>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="开票列表"
        bordered
      >
        <Table
          pagination={false}
          dataSource={detailList}
          columns={columns}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </>
  )
}

export default Payment