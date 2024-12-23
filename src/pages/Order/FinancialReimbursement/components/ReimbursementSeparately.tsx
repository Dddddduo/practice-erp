import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { Input, Table, Select, InputNumber, Button, DatePicker, Form, Space } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { getFinanceAloneReimTypeListWithCondition, createOrUpdateFinanceReimAlone } from "@/services/ant-design-pro/financialReimbursement";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

const have_invoice = [
  {
    value: 0,
    label: '无'
  },
  {
    value: 1,
    label: '有'
  },
]

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseSeparately: () => void
  currentItem: {
    detail_list: {
      have_invoice: number
      reim_type: string
    }[]
    remark: string
  }
}

const ReimbursementSeparately: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseSeparately,
  currentItem
}) => {
  const [form] = Form.useForm()
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [reimType, setReimType] = useState()
  const [baseData, setBaseData] = useState([{
    key: 1,
    reim_date: "",
    reim_desc: "",
    have_invoice: '',
    reim_type: '',
    invoice_num: '',
    amount: "",
  }])

  const handleFinish = (values) => {
    const params = {
      id: currentItem.id ?? '',
      type: "fm-alone",
      status: "submit",
      detail_list: baseData ?? [],
      remark: values.remark ?? '',
    }
    createOrUpdateFinanceReimAlone(params).then(res => {
      if (res.success) {
        handleCloseSeparately()
        actionRef.current?.reload()
        success('提交成功')
        return
      }
      error(res.message)
    })
  }

  const columns = [
    {
      title: "日期",
      dataIndex: 'reim_date',
      align: 'center',
      render: (dom, entity) => (
        <DatePicker
          style={{ width: 150 }}
          onChange={(e) => handleChangeDate(e, entity)}
        // defaultValue={dayjs(entity.reim_date, 'YYYY-MM-DD')}
        />
      )
    },
    {
      title: "明细",
      dataIndex: 'reim_desc',
      align: 'center',
      render: (dom, entity) => (
        <Input
          style={{ width: 180 }}
          onChange={(e) => handleChangeDetail(e, entity)}
          defaultValue={entity.reim_desc}
        />
      )
    },
    {
      title: "是否有票",
      dataIndex: 'have_invoice',
      align: 'center',
      render: (dom, entity) => (
        <Select
          style={{ width: 150 }}
          options={have_invoice}
          onChange={(e) => handleChangeInvoice(e, entity)}
          defaultValue={entity.have_invoice}
        />
      )
    },
    {
      title: "类型",
      dataIndex: 'reim_type',
      align: 'center',
      render: (dom, entity) => (
        <Form.Item name="reim_type" style={{ marginTop: 24 }}>
          <Select style={{ width: 150 }} options={reimType} />
        </Form.Item>
      )
    },
    {
      title: "发票张数",
      dataIndex: 'invoice_num',
      align: 'center',
      render: (dom, entity) => (
        <InputNumber
          min={0}
          value={invoiceCount}
          style={{ width: 100 }}
          onChange={(e) => handleChangeInvoiceCount(e, entity)}
          defaultValue={entity.invoice_num}
        />
      )
    },
    {
      title: "金额",
      dataIndex: 'amount',
      align: 'center',
      render: (dom, entity) => (
        <InputNumber min={0} defaultValue={entity.amount ?? 1} style={{ width: 100 }} onChange={(e) => handleChangeMoney(e, entity)} />
      )
    },
    {
      title: "操作",
      dataIndex: 'action',
      align: 'center',
      render: (dom, entity) => (
        <>
          <PlusCircleOutlined style={{ fontSize: 20, cursor: 'pointer', marginRight: 5 }} onClick={addData} />
          {
            baseData.length > 1 &&
            <DeleteOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => removeData(entity)} />
          }
        </>
      )
    },
  ]

  const handleChangeDate = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        item.reim_date = dayjs(e).format('YYYY-MM-DD')
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const handleChangeDetail = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        item.reim_desc = e.target.value
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const handleChangeInvoice = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        item.have_invoice = e
        if (e === 0) {
          handleChangeInvoiceCount(0, entity)
        }
        getFinanceAloneReimTypeListWithCondition().then(res => {
          console.log(res);
          if (res.success) {
            if (e === 0) {
              setReimType(res.data.without_invoice)
            }
            if (e === 1) {
              setReimType(res.data.with_invoice)
            }
          }
        })
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const handleChangeInvoiceCount = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        if (entity.have_invoice === 0) {
          setInvoiceCount(0)
          return item
        }
        item.invoice_num = e
        setInvoiceCount(e)
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const handleChangeMoney = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        item.amount = e
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const addData = () => {
    const newData = {
      key: baseData[baseData.length - 1].key + 1,
      reim_date: "",
      reim_desc: "",
      have_invoice: '',
      reim_type: '',
      invoice_num: '',
      amount: "",
    }
    setBaseData(preState => {
      return [
        ...preState,
        newData
      ]
    })
  }

  const removeData = (entity) => {
    setBaseData(baseData.filter(item => item.key !== entity.key))
  }

  useEffect(() => {
    console.log(currentItem);
    if (!isEmpty(currentItem)) {
      setBaseData(currentItem.detail_list)
      form.setFieldsValue({
        remark: currentItem.remark
      })
      currentItem.detail_list.map(item => {
        if (item.have_invoice !== '') {
          getFinanceAloneReimTypeListWithCondition().then(res => {
            console.log(res);
            if (res.success) {
              if (item.have_invoice === 0) {
                setReimType(res.data.without_invoice)
              }
              if (item.have_invoice === 1) {
                setReimType(res.data.with_invoice)
              }
              form.setFieldsValue({
                reim_type: item.reim_type
              })
            }
          })
        }
      })
    }
    form.setFieldsValue({
      table: baseData ?? []
    })
  }, [baseData])

  return (
    <Form
      form={form}
      style={{ maxWidth: 1000 }}
      onFinish={handleFinish}
    >
      <Form.Item name="table">
        <Table
          columns={columns}
          dataSource={baseData}
          scroll={{ x: 'max-content' }}
          pagination={false}
        // summary={() => (
        //   <Table.Summary fixed>
        //     <Table.Summary.Row>
        //       <Table.Summary.Cell index={0}>
        //         备注：
        //       </Table.Summary.Cell>
        //       <Table.Summary.Cell index={1}>
        //         <Input.TextArea />
        //       </Table.Summary.Cell>
        //     </Table.Summary.Row>
        //   </Table.Summary>
        // )}
        />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          {
            !isEmpty(currentItem) &&
            <Button type="primary" ghost >下载</Button>
          }
        </Space>
      </Form.Item>
    </Form>

  )
}

export default ReimbursementSeparately