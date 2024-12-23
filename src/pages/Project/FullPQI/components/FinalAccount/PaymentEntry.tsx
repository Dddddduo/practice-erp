import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { Input, Table, Select, InputNumber, Button, DatePicker, Form, Space, Drawer } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { getFinanceAloneReimTypeListWithCondition, createOrUpdateFinanceReimAlone } from "@/services/ant-design-pro/financialReimbursement";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import GkUploadComm from "@/components/UploadImage/GkUploadComm";
import UploadFiles from "@/components/UploadFiles";

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
  handlereimbursement: () => void
  currentItem: any
}

const PaymentEntry: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handlereimbursement,
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
    invoice_num: 0,
    amount: 0,
    file_ids: '',
    reim_type_list: [],
  }])
  const [showAnnex, setShowAnnex] = useState(false)
  const [currentMsg, setCurrentMsg]: any = useState({})
  const [ticketedAmount, setTicketedAmount] = useState('0')
  const [unticketedAmount, setUnticketedAmount] = useState('0')
  const [total, setTotal] = useState('0')

  const handleFinish = (values) => {
    console.log(currentItem);

    const params = {
      trd_id: currentItem.id ?? '',
      type: "pqi_alone_reim",
      status: "submit",
      detail_list: baseData ?? [],
      remark: values.remark ?? '',
    }
    createOrUpdateFinanceReimAlone(params).then(res => {
      if (res.success) {
        handlereimbursement()
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
        <Select
          key={entity.key}
          style={{ width: 150 }}
          options={entity.reim_type_list}
          value={entity.reim_type}
          onChange={(e) => handleChangeReimType(e, entity)}
        />
      )
    },
    {
      title: "发票张数",
      dataIndex: 'invoice_num',
      align: 'center',
      render: (dom, entity) => (
        <InputNumber
          min={0}
          value={entity.invoice_num}
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
        <InputNumber
          min={0}
          defaultValue={entity.amount ?? 1}
          style={{ width: 100 }}
          onChange={(e) => handleChangeMoney(e, entity)}
        />)
    },
    {
      title: "附件",
      dataIndex: "",
      align: 'center',
      render: (dom, entity) => {
        return (
          <Button type="primary" onClick={() => {
            setCurrentMsg(entity)
            setShowAnnex(true)
          }}>附件</Button>
        )
      }
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
    getFinanceAloneReimTypeListWithCondition().then(res => {
      if (res.success) {
        let reim_type_list_map = {
          'without_invoice': res.data.without_invoice,
          'with_invoice': res.data.with_invoice,
        }
        let format: any = []
        format = baseData.map(item => {
          if (item.key === entity.key) {
            item.have_invoice = e
            item.reim_type = ''
            item.reim_type_list = reim_type_list_map[(e === 0 ? 'without_invoice' : 'with_invoice')]
            e ? null : item.invoice_num = 0
          }
          return item
        })
        console.log(e, typeof e);

        setBaseData(format)
      }
    })
  }

  const handleChangeInvoiceCount = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        if (entity.have_invoice === 0) {
          // setInvoiceCount(0)
          return item
        }
        item.invoice_num = e
        // setInvoiceCount(e)
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
    colculateAmount(format)
    setBaseData(format)
  }

  const addData = () => {
    const newData = {
      key: baseData[baseData.length - 1].key + 1,
      reim_date: "",
      reim_desc: "",
      have_invoice: '',
      reim_type: '',
      invoice_num: 0,
      amount: 0,
      reim_type_list: []
    }
    setBaseData(preState => {
      return [
        ...preState,
        newData
      ]
    })
  }

  const handleChangeReimType = (e, entity) => {
    console.log(e);
    const format = baseData.map(item => {
      console.log(item.key === entity.key, entity.key);

      if (item.key === entity.key) {
        item.reim_type = e
      }
      return item
    })
    setBaseData(format)
  }

  const colculateAmount = (data) => {
    console.log(data);
    let ticketed = 0
    let unticketed = 0
    let total = 0
    data.map(item => {
      total += Number(item.amount)
      if (item.have_invoice === 1) {
        ticketed += Number(item.amount)
      } else {
        unticketed += Number(item.amount)
      }
    })
    setTicketedAmount(ticketed.toFixed(2))
    setUnticketedAmount(unticketed.toFixed(2))
    setTotal(total.toFixed(2))
  }

  const removeData = (entity) => {
    const formatData = baseData.filter(item => item.key !== entity.key)
    colculateAmount(formatData)
    setBaseData(formatData)
  }

  const handleCloseAnnex = () => {
    setShowAnnex(false)
  }

  const handleUpload = (files) => {
    console.log(files, currentMsg);
    const data: any = baseData
    // data[currentMsg.key].file_ids = files
    const formatData = data.map(item => {
      if (item.key === currentMsg.key) {
        item.file_ids = files
      }
      return item
    })
    console.log(formatData);
    setBaseData(formatData)
  }

  useEffect(() => {
    if (!isEmpty(currentItem)) {
      form.setFieldsValue({
        remark: currentItem.remark
      })

      // getFinanceAloneReimTypeListWithCondition().then(res => {
      //   if (res.success) {
      //     let format: any = []
      //     format = currentItem.detail_list.map(item => {
      //       if (item.have_invoice !== '') {
      //         item.key = item.id
      //         if (item.have_invoice === 0) {
      //           item.reim_type_list = res.data.without_invoice
      //         }
      //         if (item.have_invoice === 1) {
      //           item.reim_type_list = res.data.with_invoice
      //         }
      //       }
      //       return item
      //     })
      //     console.log(format);
      //     colculateAmount(format)
      //     setBaseData(format)
      //   }
      // })

    }
    form.setFieldsValue({
      table: baseData ?? []
    })

  }, [])

  return (
    <>
      <Form
        form={form}
        style={{ maxWidth: 1400 }}
        onFinish={handleFinish}
      >
        <Form.Item name="table">
          <Table
            columns={columns}
            dataSource={baseData}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Form.Item>

        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 60, textAlign: 'justify', textAlignLast: 'justify' }}>
              有票金额
            </div>&nbsp;:&nbsp;&nbsp;
            <div style={{ fontWeight: 700 }}>
              {ticketedAmount}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 60, textAlign: 'justify', textAlignLast: 'justify' }}>
              无票金额
            </div>&nbsp;:&nbsp;&nbsp;
            <div style={{ fontWeight: 700 }}>
              {unticketedAmount}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 60, textAlign: 'justify', textAlignLast: 'justify' }}>
              总计
            </div>&nbsp;:&nbsp;&nbsp;
            <div style={{ fontWeight: 700 }}>
              {total}
            </div>
          </div >
        </div >

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">提交</Button>
          </Space>
        </Form.Item>
      </Form>

      <Drawer
        width={600}
        open={showAnnex}
        onClose={handleCloseAnnex}
        destroyOnClose={true}
        title="附件"
      >
        <UploadFiles value={currentMsg.file_ids} onChange={handleUpload} />
      </Drawer>
    </>
  )
}

export default PaymentEntry
