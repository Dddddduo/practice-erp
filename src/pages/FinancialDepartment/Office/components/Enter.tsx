import { Button, Card, DatePicker, Form, Input, Select, Space, Table, message } from "antd"
import React, { useEffect, useState } from "react"
import {getCompanyList, showPaymentInfo} from "@/services/ant-design-pro/quotation"
import dayjs from "dayjs"
import { collectionOcr, invoiceOcr, submitPaymentOfficeAlone } from "@/services/ant-design-pro/financialReimbursement"
import UploadFiles from "@/components/UploadFiles"
import SubmitButton from "@/components/Buttons/SubmitButton"
import { isEmpty } from "lodash"

interface ItemListProps {
  success: (text: string) => void
  error: (text: string) => void
  handleCloseEnter: () => void
  currentItem: {
    uid: number
    with_invoice_payment_list: []
    without_invoice_payment_list: []
  }
  selectedRowsState: {
    uid: number
    with_invoice_payment_list: []
    without_invoice_payment_list: []
  }[]
  type: string
  isHaveTickets: number
  currentTime: string
  actionRef: any
}

const Enter: React.FC<ItemListProps> = ({
  success,
  error,
  handleCloseEnter,
  currentItem,
  selectedRowsState,
  type,
  isHaveTickets,
  currentTime,
                                          actionRef,
}) => {
  const [form] = Form.useForm()
  const [company, setCompany] = useState([])
  const [fileIds, setFileIds] = useState('')
  const [userList, setUserList]: any = useState([])
  const [paymentList, setPaymentList] = useState([])

  const handleFinish = (values) => {
    let payTime = ''
    let params = {}
    if (values.time) {
      payTime = dayjs(values.time).format('YYYY-MM-DD')
    }
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1

    let method = ''
    if (type === '有票单独打款' || type === '批量有票打款') {
      method = 'with_invoice'
    } else if (type === '无票单独打款' || type === '批量无票打款') {
      method = 'without_invoice'
    }

    // 除掉千分位的逗号
    const amount = values.amount?.replace(/,/g, '');

    params = {
      office_alone_at: currentTime ? currentTime : `${year}-${month}`,
      method: method,
      payment_type: 'officeAloneReim',
      reim_uid_list: userList ?? [],
      company_id: values.company ?? '',
      department: '办公室报销',
      file_ids: fileIds ?? '',
      pay_at: payTime ?? '',
      payment_list: paymentList ?? [],
      remark: values.remark ?? '',
      amount: amount ?? '',
    }

    submitPaymentOfficeAlone(params).then(res => {
      if (res.success) {
        handleCloseEnter()
        success('操作成功')
        actionRef.current.reload()
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {

    console.log('单独打款单独打款', currentItem)

    getCompanyList().then(res => {
      if (res.success) {
        setCompany(res.data.map(item => {
          return {
            value: item.id,
            label: item.company_cn
          }
        }))
      }
    })
    if (type === '有票单独打款') {
      setPaymentList(currentItem.with_invoice_payment_list)
      setUserList([currentItem.uid])

      return
    }
    if (type === '无票单独打款') {
      setPaymentList(currentItem.without_invoice_payment_list)
      setUserList([currentItem.uid])
      return
    }
    if (type === '批量有票打款') {
      setUserList(selectedRowsState.map(item => item.uid))
      let payment_list: any = []
      selectedRowsState.map(item => {
        payment_list.push(...item.with_invoice_payment_list)
      })
      console.log(payment_list);
      setPaymentList(payment_list)
    }
    if (type === '批量无票打款') {
      setUserList(selectedRowsState.map(item => item.uid))
      let payment_list: any = []
      selectedRowsState.map(item => {
        payment_list.push(...item.without_invoice_payment_list)
      })
      console.log(payment_list);
      setPaymentList(payment_list)
    }
  }, [])

  const handleChangeFileIds = async (files: string, isDisplayBack = false) => {
    setFileIds(files)
    if (files) {
      try {
        const fileList = files.split(',')
        const params = {
          file_id: isEmpty(fileList) ? '' : fileList[fileList.length - 1],
          file_type: 'img'
        }
        const res = await collectionOcr(params)

        if (isDisplayBack) {
          await form.setFieldsValue({
            amount: res.data.small ?? '',
          })
        } else {
          await form.setFieldsValue({
            company: 0 === res.data.company ? undefined : res.data.company,
            time: "" !== res.data.income_at && dayjs(res.data.income_at),
            amount: res.data.small ?? '',
          })
        }

        await message.success('发票信息获取成功')

      } catch (error) {
        message.error('发票信息获取异常')
      }
    }
  }

  return (
    <>
      <Card title="打款" style={{ marginBottom: 30 }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 800 }}
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item label="公司" name="company" required={true}>
            <Select options={company} allowClear />
          </Form.Item>

          <Form.Item label="附件" name="annex">
            <UploadFiles onChange={(files) => handleChangeFileIds(files)} />
          </Form.Item>

          <Form.Item label="打款时间" name="time" required={true}>
            <DatePicker style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="打款金额" name="amount">
            <Input style={{ width: 200 }}  />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              <SubmitButton type="primary" form={form}>提交</SubmitButton>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default Enter
