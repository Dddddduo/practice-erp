import React, {useEffect, useState} from "react"
import {Input, Table, Select, InputNumber, Button, Form, Drawer, Modal, message} from "antd";
import {DeleteOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {isEmpty} from "lodash";
import UploadFiles from "@/components/UploadFiles";
import {getCompanyList} from "@/services/ant-design-pro/quotation";
import {getBonusList, invoicePqiCostEstimate} from "@/services/ant-design-pro/pqi";

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
  needData: any,
  listInitData: () => void,
  payeeList: any,
}

const Payee: React.FC<ItemListProps> = ({
                                          needData,
                                          listInitData,
                                          payeeList,
                                        }) => {
  const [form] = Form.useForm()
  const [baseData, setBaseData] = useState([{
    company: "",
    uid: "",
    detail_id: '',
    in_amount: '',
    have_invoice: '',
    invoice_no: '',
    file_ids: '',
    remark: '',
  }])
  const [showAnnex, setShowAnnex] = useState(false)
  const [currentMsg, setCurrentMsg]: any = useState({})
  const [companyList, setCompanyList] = useState([])

  const { confirm } = Modal;

  const [messageApi, contextHolder] = message.useMessage();

  const [isSubmited, setIsSubmited] = useState(false)

  const getCompany = () => {
    try {
      getCompanyList().then(res => {
        if (res.success) {
          setCompanyList(res.data.map((item: {
            id: number
            company_cn: string
          }) => {
            return {
              value: item.id,
              label: item.company_cn,
            }
          }))
        }
      })
    } catch (err) {
    }
  }

  const handleFinish = async (index: any) => {

    const values = baseData[index]

    const employee = payeeList.filter(item => item.value === values.uid)


    const params = {
      company: values?.company ?? 0, // 打款公司
      bank_name: !isEmpty(employee) ? employee[0].bank : '', // 收款银行
      bank_no: !isEmpty(employee) ? employee[0].bank_card_no : '', // 收款银行号
      detail_id: values?.detail_id ?? undefined, // apply下的detail_id
      reim_type: needData?.currentItem?.cost_type_name ?? '', // 成本类型，比如：Carrier
      cost_no: needData?.currentItem?.itemIndex ?? 0, // 成本序列号
      item_id: needData?.currentItem?.Project_final_account_id ?? 0, // 成本项目id
      trd_id: needData?.currentMsg?.id ?? 0, // 项目id
      coll_company_id: !isEmpty(employee) ? employee[0].value : 0, // 收款公司id（员工id）
      coll_name: !isEmpty(employee) ? employee[0].label : '', // 收款公司名称
      in_amount: values?.in_amount ?? '',  // 含税总金额
      ex_amount: values?.in_amount ?? '', // 不含税总金额
      tax_amount: 0, // 税额（默认为0）
      tax_rate: 0, // 税率（默认为0）
      invoice_num: '', // 发票号
      seller_register_num: '', // 税号
      invoice_date: '', // 开票时间
      file_ids: values?.file_ids ?? '', // 附件id
      remark: values?.remark ?? '', // 备注
      uid: values?.uid ?? '', // 员工id
      have_invoice: values?.have_invoice ?? '', // 是否有票
      invoice_no: values?.invoice_no ?? '', // 发票张数
    }

    const res = await invoicePqiCostEstimate(params)

    if (res.success) {
      messageApi.open({
        type: 'success',
        content: '提交成功',
      });

      initData(values.uid) // 刷新当前页面
      listInitData() // 刷新父页面

      setIsSubmited(true)
    } else {
      messageApi.open({
        type: 'error',
        content: res?.message ?? '',
      });
    }
  }

  const handleChangeValue = (value: any, key: any, itemIndex: any) => {
    console.log('value', value, 'key', key, 'itemIndex', itemIndex)

    let list = [...baseData]

    if (key === 'company') {
      list[itemIndex].company = value
    }

    if (key === 'uid') {
      list[itemIndex].uid = value
    }

    if (key === 'remark') {
      list[itemIndex].remark = value
    }

    if (key === 'have_invoice') {
      list[itemIndex]['have_invoice'] = value
    }

    if (key === 'invoice_no') {
      list[itemIndex]['invoice_no'] = value
    }

    if (key === 'in_amount') {
      list[itemIndex]['in_amount'] = value
    }

    if (key === 'file_ids') {
      list[itemIndex]['file_ids'] = value
    }

    setBaseData(list)
  }

  const columns = [
    {
      title: "打款公司",
      dataIndex: 'company',
      align: 'center',
      width: '10vw',
      render: (dom, entity, index) => (
        <Select
          allowClear
          style={{width: '14vw'}}
          options={companyList}
          value={entity?.company ?? undefined}
          onChange={(e) => handleChangeValue(e, 'company', index)}
        > </Select>
      ),
    },
    {
      title: "收款人",
      dataIndex: 'uid',
      align: 'center',
      width: '10vw',
      render: (dom, entity, index) => (
        <Select
          allowClear
          showSearch
          style={{width: '9vw'}}
          options={payeeList}
          value={entity?.uid ?? undefined}
          onChange={(e) => handleChangeValue(e, 'uid', index)}
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          disabled={needData?.currentItem?.uid || isSubmited}
        > </Select>
      ),
      onCell: (_, index) => {
        console.log('什么是index', index)

        if (index === 0) {
          return {
            rowSpan: baseData.length
          }
        }

        if (index !== 0) {
          return {
            rowSpan: 0
          }
        }

        return {}

      },
    },
    {
      title: "明细",
      dataIndex: 'remark',
      align: 'center',
      render: (dom, entity, index) => (
        <Input
          style={{width: 180}}
          onChange={(e) => handleChangeValue(e.target.value, 'remark', index)}
          value={entity.remark}
        />
      )
    },
    {
      title: "是否有票",
      dataIndex: 'have_invoice',
      align: 'center',
      render: (dom, entity, index) => (
        <Select
          style={{width: 150}}
          options={have_invoice}
          onChange={(e) => handleChangeValue(e, 'have_invoice', index)}
          value={entity.have_invoice}
        />
      )
    },
    {
      title: "发票张数",
      dataIndex: 'invoice_no',
      align: 'center',
      render: (dom, entity, index) => (
        <InputNumber
          min={0}
          style={{width: 100}}
          onChange={(e) => handleChangeValue(e, 'invoice_no', index)}
          value={entity.invoice_no}
        />
      )
    },
    {
      title: "金额",
      dataIndex: 'in_amount',
      align: 'center',
      render: (dom, entity, index) => (
        <InputNumber
          min={0}
          style={{width: 100}}
          onChange={(e) => handleChangeValue(e, 'in_amount', index)}
          value={entity.in_amount}
        />)
    },
    {
      title: "附件",
      dataIndex: "file_ids",
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <Button type="primary" onClick={() => {
            setCurrentMsg({
              ...entity,
              itemIndex: index,
            })
            setShowAnnex(true)
          }}>附件</Button>
        )
      }
    },
    {
      title: "操作",
      dataIndex: 'action',
      align: 'center',
      render: (dom, entity, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            entity.canUpdate || !entity.detail_id ? <Button type="primary" onClick={() => {
              confirm({
                title: '提示',
                icon: <ExclamationCircleFilled />,
                content: '您确定要提交吗？',
                onOk() {
                  handleFinish(index)
                }
              });

            }}>提交</Button> : <></>
          }

          {
            baseData.length > 1 && !entity.detail_id &&
            <DeleteOutlined style={{fontSize: 20, cursor: 'pointer', marginLeft: 12}} onClick={() => removeData(index)}/>
          }
        </div>
      )
    },
  ]

  const addData = () => {
    const newData = {
      company: "",
      uid: needData?.currentItem?.uid ?? 0,
      detail_id: '',
      in_amount: '',
      have_invoice: '',
      invoice_no: '',
      file_ids: '',
      remark: '',
    }
    let newList = [...baseData]
    newList.push(newData)
    setBaseData(newList)
  }

  const removeData = (itemIndex: any) => {

    // 不能对state数据直接进行对象操作
    let newList = [...baseData]
    newList.splice(itemIndex, 1);

    setBaseData(newList)
  }

  const handleCloseAnnex = () => {
    setShowAnnex(false)
  }

  const initData = async (uid: any) => {
    const bouns = await getBonusList(needData?.currentItem?.Project_final_account_id ?? 0, uid)

    if (bouns.success) {
      const newList = bouns.data.map(item => {
        return {
          company: item.company_id,
          uid: item.uid,
          detail_id: item.detail_id,
          in_amount: item.amount,
          have_invoice: item.have_invoice,
          invoice_no: item.invoice_num,
          file_ids: item.file_ids,
          remark: item.remark,
          canUpdate: item.canUpdate,
        }
      })

      setBaseData(newList)
    }
  }

  useEffect(() => {
    getCompany()

    if (needData?.currentItem?.uid) {
      initData(needData?.currentItem?.uid)
    }
  }, [])

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={baseData}
        scroll={{x: 'max-content'}}
        pagination={false}
      />

      <Button type={'primary'} onClick={addData} style={{marginTop: 16, marginLeft: 16}}>添加新项</Button>

      <Drawer
        width={600}
        open={showAnnex}
        onClose={handleCloseAnnex}
        destroyOnClose={true}
        title="附件"
      >
        <UploadFiles value={currentMsg.file_ids} onChange={(e) => {
          handleChangeValue(e, 'file_ids', currentMsg.itemIndex)
        }}/>
      </Drawer>
    </>
  )
}

export default Payee
