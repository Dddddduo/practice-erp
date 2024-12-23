import { Button, Card, DatePicker, Form, Input, Select, Space, Table } from "antd"
import {StringNullableChain, isEmpty, flatMap, map} from "lodash"
import React, { useEffect, useState } from "react"
import { getCompanyList } from "@/services/ant-design-pro/quotation"
import GkUpload from "@/components/UploadImage/GkUpload"
import { EyeOutlined } from "@ant-design/icons"
import { createOrUpdateIncome, createOrUpdateInvoice, invoiceOcr } from "@/services/ant-design-pro/financialReimbursement"
import dayjs from "dayjs"

interface ItemListProps {
  success: (text: string) => void
  error: (text: string) => void
  selectedRowsState: any
  handleCloseEnter: () => void
  title: string
}

const Enter: React.FC<ItemListProps> = ({
  success,
  error,
  selectedRowsState,
  handleCloseEnter,
  title,
}) => {
  const [form] = Form.useForm()
  const [baseData, setBaseData] = useState([])

  const handleFinish = (values) => {
    let params = {}
    console.log(selectedRowsState)
    if (title === '开票录入') {
      const lis = selectedRowsState[0].detail_list.map(item => {
        return item.id
      });

      params = {
        department: '',
        // detail_id: selectedRowsState[0].id,
        detail_id_list: lis,
        invoice_list: [{
          amount: selectedRowsState[0].amount ?? '',
          invoice_no: values.no ?? '',
          file_ids: values.annex ? values.annex.map(item => item.file_id).join(',') : "",
          invoice_at: values.time ? dayjs(values.time).format('YYYY-MM-DD') : '',
          remark: values.remark ?? '',
        }]
      }

      createOrUpdateInvoice(params).then(res => {
        if (res.success) {
          success('操作成功')
          handleCloseEnter()
          return
        }
        error(res.message)
      })
      return
    }

    const ids = flatMap(selectedRowsState, item => map(item.detail_list, 'id'));
    params = {
      department: '',
      detail_id_list: ids,
      income_list: [{
        file_ids: values.annex ? values.annex.map(item => item.file_id).join(',') : "",
        income_at: values.time ? dayjs(values.time).format('YYYY-MM-DD') : '',
        remark: values.remark ?? '',
      }]
    }

    createOrUpdateIncome(params).then(res => {
      if (res.success) {
        success('操作成功')
        handleCloseEnter()
        return
      }
      error(res.message)
    })
  }

  const handleUpload = (value) => {
    let params: {[key: string]: any} = {}
    if (title === '开票录入') {
      params = {
        // 原来的代码：file_id: value ? value[value.length - 1].file_id : '',
        file_id: value.length > 0 ? value[value.length - 1].file_id : '',
        file_type: 'pdf',
      }

      if ("" !== params.file_id) {
        invoiceOcr(params).then(res => {
          if (res.success) {
            form.setFieldsValue({
              no: res.data.invoice_num ?? '',
              time: "" !== res.data.invoice_date && dayjs(res.data.invoice_date),
            })
          }
        })
      }

      return
    }
    // params = {
    //   file_id: value.length > 0 ? value[value.length - 1].file_id : '',
    // }

  }

  const columns: any = [
    {
      title: "公司",
      dataIndex: "company_name",
      align: 'center',
    },
    {
      title: "税号",
      dataIndex: "tax_no",
      align: 'center',
    },
    {
      title: "地址",
      dataIndex: "address",
      align: 'center',
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      align: 'center',
    },
    {
      title: "银行",
      dataIndex: "bank_name",
      align: 'center',
    },
    {
      title: "卡号",
      dataIndex: "bank_no",
      align: 'center',
    },
    {
      title: "金额",
      dataIndex: "amount",
      align: 'center',
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: 'center',
    },
    {
      title: "请款时间",
      dataIndex: "create_at",
      align: 'center',
    },
    {
      title: "附件",
      dataIndex: "file_ids",
      align: 'center',
      render: () => {
        return (
          <EyeOutlined />
        )
      }
    },
  ]

  useEffect(() => {
    const details: any = []
    selectedRowsState.map(item => {
      item.detail_list.map(data => {
        const formatData = {
          ...data,
          key: data.id
        }
        details.push(formatData)
      })
    })
    setBaseData(details)
  }, [])

  return (
    <>
      <Card title={title} style={{ marginBottom: 30 }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 800 }}
          form={form}
          onFinish={handleFinish}
        >
          {
            title === '开票录入' &&
            <Form.Item label="发票号" name="no" required={true}>
              <Input />
            </Form.Item>
          }

          <Form.Item label="附件" name="annex">
            <GkUpload onChange={handleUpload} />
          </Form.Item>

          <Form.Item label={title === '开票录入' ? '开票时间' : '收款时间'} name="time" required={true}>
            <DatePicker />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit">提交</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card >

      <Card title="申请详情">
        <Table
          // dataSource={isEmpty(currentItem) ? selectedRowsState.detail_list : [currentItem]}
          dataSource={baseData}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={title === '收款录入'}
        />
      </Card>
    </>
  )
}

export default Enter
