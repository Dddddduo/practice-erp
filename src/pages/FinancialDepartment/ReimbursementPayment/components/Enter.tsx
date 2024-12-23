import { Card, DatePicker, Form, Input, Select, Space, Table, message } from "antd"
import { isEmpty } from "lodash"
import React, { useEffect, useState } from "react"
import { getCompanyList } from "@/services/ant-design-pro/quotation"
import dayjs from "dayjs"
import { collectionOcr, submitPayment } from "@/services/ant-design-pro/financialReimbursement"
import UploadFiles from "@/components/UploadFiles";
import SubmitButton from "@/components/Buttons/SubmitButton"

interface ItemListProps {
  success: (text: string) => void
  error: (text: string) => void
  handleCloseEnter: () => void
  currentItem: any
  path: string
  selectedRowsState: []
  currentTime: string
}

const Enter: React.FC<ItemListProps> = ({
  success,
  error,
  handleCloseEnter,
  currentItem,
  path,
  selectedRowsState,
  currentTime,
}) => {
  const [form] = Form.useForm()
  const [baseData, setBaseData] = useState([])
  const [company, setCompany] = useState([])
  const [fileIds, setFileIds] = useState('')

  const columns: any = [
    {
      title: "类型",
      dataIndex: "reim_type",
      align: 'center',
    },
    {
      title: "账号",
      dataIndex: "name_cn",
      align: 'center',
    },
    {
      title: "金额",
      dataIndex: "amount",
      align: 'center',
    },
    {
      title: "附件",
      dataIndex: "file_ids",
      align: 'center',
      render: (dom, entity) => {
        return (
          <>
            {
              dom === '' &&
              <div>暂无数据</div>
            }
          </>
        )
      }
    },
    {
      title: "报销时间",
      dataIndex: "create_at",
      align: 'center',
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: 'center',
    },
  ]

  const handleFinish = (values) => {
    let payTime = ''
    if (values.time) {
      payTime = dayjs(values.time).format('YYYY-MM-DD')
    }

    let payment_list: {}[] = []
    let reim_uid_list: number[] = []

    if (isEmpty(currentItem)) {
      selectedRowsState.forEach((item: { detail_list: { id: number, amount: string }[], create_uid: number, create_at: string }) => {
        reim_uid_list.push(item.create_uid);
        if (!isEmpty(item.detail_list)) {
          item.detail_list.forEach((detail) => {
            payment_list.push({ detail_id: detail.id, amount: detail.amount })
          });
        }
      });
    } else {
      reim_uid_list = [currentItem.create_uid]
      payment_list = [{ detail_id: currentItem.id, amount: currentItem.amount }]
    }

    const params = {
      method: 'with_invoice',
      payment_type: "paymentPublic",
      company_id: values.company ?? '',
      department: '对公打款',
      file_ids: fileIds ?? '',
      pay_at: payTime ?? '',
      payment_list: payment_list ?? [],
      reim_uid_list: reim_uid_list ?? [],
      remark: values.remark ?? '',
      office_alone_at: currentTime ?? '',
    }
    submitPayment(params).then(res => {
      if (res.success) {
        handleCloseEnter()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleChangeFileIds = async (files: string) => {
    setFileIds(files)
    if (files) {
      try {
        const fileList = files.split(',')
        const params = {
          file_id: isEmpty(fileList) ? '' : fileList[fileList.length - 1],
          file_type: 'img'
        }
        const res = await collectionOcr(params)

        await form.setFieldsValue({
          company: 0 === res.data.company ? undefined : res.data.company,
          time: "" !== res.data.income_at && dayjs(res.data.income_at),
          _money: res.data?.small ?? ''
        })

        await message.success('发票信息获取成功')

      } catch (error) {
        message.error('发票信息获取异常')
      }
    }
  }

  useEffect(() => {
    const baseData: any = []
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

    if (!isEmpty(currentItem)) {
      baseData.push(currentItem)
      setBaseData(baseData)
      return
    }
    if (!isEmpty(selectedRowsState)) {
      selectedRowsState.map(item => {
        item.detail_list.map(data => {
          const formatData = {
            ...data,
            key: data.id
          }
          baseData.push(formatData)
        })
      })
      setBaseData(baseData)
      return
    }
  }, [])

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

          <Form.Item label="打款金额" name="_money">
            <Input style={{ width: 200 }} />
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
      </Card >
      {
        path !== 'office' &&
        <Card title="申请详情">
          <Table
            // dataSource={isEmpty(currentItem) ? selectedRowsState.detail_list : [currentItem]}
            dataSource={baseData}
            columns={columns}
            pagination={isEmpty(currentItem) ? true : false}
          />
        </Card>
      }
    </>
  )
}

export default Enter
