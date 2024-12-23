import React, { useEffect, useReducer, useState } from "react"
import { Button, DatePicker, Drawer, Input, Modal, Space, Table } from "antd"
import { getCollectMoneyList, getFileUrlByIds, getVoCostList, addCollectMoneyItem, addVoCostItem } from "@/services/ant-design-pro/project"
import { produce, current } from "immer"
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import GkUpload from "@/components/UploadImage/GkUpload"
import Reimbursement from "./Reimbursement"


interface ItemListProps {
  currentMsg: {
    id: number
  }
  actionRef: any
  success: (text: string) => void
  error: (text: string) => void
}

const FinalInvoice: React.FC<ItemListProps> = ({
  currentMsg,
  actionRef,
  success,
  error,
}) => {
  const baseData = {}
  const [collect, setCollect] = useState<any>([])
  const [voCost, setVoCost] = useState<any>([])
  const [total, setTotal] = useState<any>([])
  const [voCostId, setVoCostId] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [showInvoicing, setShowInvoicing] = useState(false)
  const [currentFiles, setCurrentFiles] = useState([])
  const [currentItem, setCurrentItem] = useState({})

  const initData: any = async () => {
    let collectData: any = [], voCostData: any = [], totalList: any = []
    const result = await getCollectMoneyList({ project_id: currentMsg.id });
    if (!result.success) {
      return [];
    }
    let totalData: any = {
      voCost_no: result.data[0].project_no + '-' + 'VO',
      price: '',
      percent: 100,
      tax_price: '',
      sub_total_price: '',
      cost_price: '',
      profit_price: '',
      profit_rate: '',
    }
    for (let i = 0; i < result.data.length; i++) {
      let tmp = result.data[i];
      if (0 === i) {
        tmp.collect_no = tmp.project_no
        collectData.push(tmp)
        continue;
      }
      if (tmp.estimate_bill_at === '-0001-11-30') {
        tmp.estimate_bill_at = ''
      }
      if (tmp.estimate_collect_at === '-0001-11-30') {
        tmp.estimate_collect_at = ''
      }
      tmp.collect_no = tmp.project_no + '-' + i
      collectData.push(tmp)
    }

    const voCostResult = await getVoCostList({ project_id: currentMsg.id })
    if (!voCostResult.success) {
      return
    }

    voCostData = voCostResult.data.map(item => {
      totalData.price = (Number(totalData.price) + Number(item.price)).toFixed(2)
      totalData.tax_price = (Number(totalData.tax_price) + Number(item.tax_price)).toFixed(2)
      totalData.sub_total_price = (Number(totalData.sub_total_price) + Number(item.sub_total_price)).toFixed(2)
      totalData.cost_price = (Number(totalData.cost_price) + Number(item.cost_price)).toFixed(2)
      totalData.profit_price = (Number(totalData.profit_price) + Number(item.profit_price)).toFixed(2)
      totalData.profit_rate = (
        Number(totalData.profit_price) /
        Number(totalData.price) * 100
      ).toFixed(2)
      let a = item.project_no.split('_')[0]
      let b = item.project_no.split('_')[1]

      item.voCost_no = result.data[0].project_no + '-' + 'VO' + (parseFloat(a) + 1) + '-' + (parseFloat(b) + 1)
      return item
    })

    voCostData.unshift(totalData)

    totalList = [{
      total_no: 'Total Amount:',
      price: (parseFloat(collectData[0].price) + Number(totalData.price)).toFixed(2),
      tax_price: (parseFloat(collectData[0].tax_price) + Number(totalData.tax_price)).toFixed(2),
      sub_total_price: (parseFloat(collectData[0].sub_total_price) + Number(totalData.sub_total_price)).toFixed(2),
      cost_price: (parseFloat(collectData[0].cost_price) + Number(totalData.cost_price)).toFixed(2),
      profit_price: (parseFloat(collectData[0].profit_price) + Number(totalData.profit_price)).toFixed(2),
      profit_rate: (
        (parseFloat(collectData[0].profit_price) + Number(totalData.profit_price)) /
        (parseFloat(collectData[0].price) + Number(totalData.price)) * 100
      ).toFixed(2)
    }]
    setVoCost(voCostData)
    setCollect(collectData)
    setTotal(totalList)
    console.log(collectData)
    return {
      collectData,
      voCostData,
      totalList
    }
  }

  useEffect(() => {
    console.log(currentMsg)
    const init = async () => {
      const { collectData, voCostData, totalList } = await initData()
      console.log(collectData, voCostData, totalList)
      dispatchCompute({
        type: 'init',
        payload: {
          collectData,
          voCostData,
          totalList
        }
      })
    }
    init()
  }, [])

  const collectColumns = [
    {
      title: 'Item',
      dataIndex: 'collect_no',
      align: 'center',
      width: "12%",
    },
    {
      title: 'Price',
      align: 'center',
      dataIndex: 'price',
      width: "6%",
      render: (dom, entity, index) => (
        <>
          {
            index === 0 ?
              <>{dom}</> :
              <Input
                value={dom}
                style={{
                  color: 'red',
                  textAlign: 'center',
                  borderRadius: 0,
                  border: 'none',
                  borderBottom: "1px solid red"
                }}
                onInput={(e) => {
                  console.log(index)
                  dispatchCompute({
                    type: "inputCollect",
                    payload: {
                      value: e.target.value,
                      index: index,
                      type: 'price'
                    }
                  })
                }}
              />
          }
        </>
      )
    },
    {
      title: '%',
      align: 'center',
      dataIndex: 'percent',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
              index === 0 ?
                <div>{dom}</div> :
                <Input
                  value={dom}
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: "1px solid red"
                  }}
                  onInput={(e) => {
                    console.log(index)
                    dispatchCompute({
                      type: "inputCollect",
                      payload: {
                        value: e.target.value,
                        index: index,
                        type: 'percent'
                      }
                    })
                  }}
                />
            }%
          </div>
        )
      }
    },
    {
      title: '9%VAT',
      align: 'center',
      dataIndex: 'tax_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {dom}
          </div>
        )
      }
    },
    {
      title: 'Sub-total',
      align: 'center',
      dataIndex: 'sub_total_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>{dom}</>
        )
      }
    },
    {
      title: 'Cost',
      align: 'center',
      dataIndex: 'cost_price',
      width: "6%",
      render: (dom, entity) => {
        return (
          <div>{dom}</div>
        )
      }
    },
    {
      title: 'Profit',
      align: 'center',
      dataIndex: 'profit_price',
      width: "6%",
      render: (dom, entity) => {
        return (
          <div>{dom}</div>
        )
      }
    },
    {
      title: 'Rate',
      align: 'center',
      dataIndex: 'profit_rate',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>
            {dom}%
            {/* {
              dom &&
              <>%</>
            } */}
          </>
        )
      }
    },
    {
      title: '预计开票日期',
      align: 'center',
      width: "8%",
      dataIndex: 'estimate_bill_at',
      render: (dom, entity, index) => {
        return (
          <>
            {
              index !== 0 &&
              <DatePicker defaultValue={dom !== '' ? dayjs(dom, 'YYYY-MM-DD') : ''} />
            }
          </>
        )
      }
    },
    {
      title: '预计收款日期',
      align: 'center',
      width: "8%",
      dataIndex: 'estimate_collect_at',
      render: (dom, entity, index) => {
        return (
          <>
            {
              index !== 0 &&
              <DatePicker disabled defaultValue={dom !== '' ? dayjs(dom, 'YYYY-MM-DD') : ''} />
            }
          </>
        )
      }
    },
    {
      title: '开票日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '开票总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '操作',
      align: 'center',
      width: '12%',
      render: (dom, entity, index) => {
        return (
          <Space>
            <>
              <PlusCircleOutlined
                style={{
                  fontSize: 20,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  dispatchCompute({
                    type: 'addOrDelCollect',
                    payload: {
                      type: 'add',
                      index: index
                    }
                  })
                }} />
              {
                index !== 0 &&
                <>
                  <MinusCircleOutlined
                    style={{
                      fontSize: 20,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      dispatchCompute({
                        type: 'addOrDelCollect',
                        payload: {
                          type: 'del',
                          index: index
                        }
                      })
                    }} />
                  {/* <Button type="primary">附件</Button> */}
                  <Button type="primary" onClick={() => {
                    setShowInvoicing(true)
                    setCurrentItem(entity)
                  }}>开票收款</Button>
                </>
              }
            </>
          </Space>
        )
      }
    },
  ]

  const voCostColumns = [
    {
      title: 'Item',
      dataIndex: 'voCost_no',
      align: 'center',
      width: "12%",
      render: (dom, entity, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {dom}
            {
              index > 0 &&
              <Input
                value={entity.supplier_name}
                style={{
                  color: 'red',
                  width: 50,
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid red',
                }}
              />
            }
          </div>
        )
      }
    },
    {
      title: 'Price',
      align: 'center',
      dataIndex: 'price',
      width: "6%",
      render: (dom, entity, index) => (
        <>
          {
            index === 0 ?
              <>{dom}</> :
              <Input
                value={dom}
                style={{
                  color: 'red',
                  textAlign: 'center',
                  borderRadius: 0,
                  border: 'none',
                  borderBottom: "1px solid red"
                }}
                onInput={(e) => {
                  dispatchCompute({
                    type: 'inputVoCost',
                    payload: {
                      value: e.target.value,
                      index: index,
                      type: 'price',
                    }
                  })
                }}
              />
          }
        </>
      )
    },
    {
      title: '%',
      align: 'center',
      dataIndex: 'percent',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div>{parseFloat(dom).toFixed(0)}%</div>
        )
      }
    },
    {
      title: '9%VAT',
      align: 'center',
      dataIndex: 'tax_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {dom}
          </div>
        )
      }
    },
    {
      title: 'Sub-total',
      align: 'center',
      dataIndex: 'sub_total_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>{dom}</>
        )
      }
    },
    {
      title: 'Cost',
      align: 'center',
      dataIndex: 'cost_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div>
            {
              index === 0 ?
                <div>{dom}</div> :
                <Input
                  value={dom}
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: "1px solid red"
                  }}
                  onInput={(e) => {
                    dispatchCompute({
                      type: 'inputVoCost',
                      payload: {
                        value: e.target.value,
                        index: index,
                        type: 'cost_price',
                      }
                    })
                  }}
                />
            }
          </div>
        )
      }
    },
    {
      title: 'Profit',
      align: 'center',
      dataIndex: 'profit_price',
      width: "6%",
      render: (dom, entity) => {
        return (
          <div>{dom}</div>
        )
      }
    },
    {
      title: 'Rate',
      align: 'center',
      dataIndex: 'profit_rate',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>
            {dom}
            {
              dom &&
              <>%</>
            }
          </>
        )
      }
    },
    {
      title: '预计开票日期',
      align: 'center',
      width: "8%",
      dataIndex: 'last_bill_at',
      render: (dom, entity, index) => {
        return (
          <>
            {
              index !== 0 &&
              <DatePicker defaultValue={dom !== '' ? dayjs(dom, 'YYYY-MM-DD') : ''} />
            }
          </>
        )
      }
    },
    {
      title: '预计收款日期',
      align: 'center',
      width: "8%",
      dataIndex: 'last_collect_at',
      render: (dom, entity, index) => {
        return (
          <>
            {
              index !== 0 &&
              <DatePicker disabled defaultValue={(dom !== '') ? dayjs(dom, 'YYYY-MM-DD') : ''} />
            }
          </>
        )
      }
    },
    {
      title: '开票日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '开票总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '操作',
      align: 'center',
      width: '12%',
      render: (dom, entity, index) => {
        return (
          <Space style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <>
              <PlusCircleOutlined
                style={{
                  fontSize: 20,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (index === 0) {
                    dispatchCompute({
                      type: 'addVoCost',
                      payload: {
                        index: index
                      }
                    })
                  } else {
                    dispatchCompute({
                      type: 'addOrDelVoCost',
                      payload: {
                        type: 'add',
                        index: index
                      }
                    })
                  }

                }}
              />
              {
                index !== 0 &&
                <>
                  <MinusCircleOutlined
                    style={{
                      fontSize: 20,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      dispatchCompute({
                        type: 'addOrDelVoCost',
                        payload: {
                          type: 'del',
                          index: index
                        }
                      })
                    }}
                  />
                  <Button type="primary" onClick={() => uploadFileList(entity)}>附件</Button>
                  <Button type="primary" onClick={() => {
                    setShowInvoicing(true)
                    setCurrentItem(entity)
                  }}>开票收款</Button>
                </>
              }
            </>
          </Space>
        )
      }
    },
  ]

  const totalColumns = [
    {
      title: 'Item',
      dataIndex: 'total_no',
      align: 'center',
      width: "12%",
    },
    {
      title: 'Price',
      align: 'center',
      dataIndex: 'price',
      width: "6%",
      render: (dom, entity, index) => (
        <>{dom}</>
      )
    },
    {
      title: '%',
      align: 'center',
      dataIndex: 'percent',
      width: "6%",
    },
    {
      title: '9%VAT',
      align: 'center',
      dataIndex: 'tax_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {dom}
          </div>
        )
      }
    },
    {
      title: 'Sub-total',
      align: 'center',
      dataIndex: 'sub_total_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>{dom}</>
        )
      }
    },
    {
      title: 'Cost',
      align: 'center',
      dataIndex: 'cost_price',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <div>{dom}</div>
        )
      }
    },
    {
      title: 'Profit',
      align: 'center',
      dataIndex: 'profit_price',
      width: "6%",
      render: (dom, entity) => {
        return (
          <div>{dom}</div>
        )
      }
    },
    {
      title: 'Rate',
      align: 'center',
      dataIndex: 'profit_rate',
      width: "6%",
      render: (dom, entity, index) => {
        return (
          <>
            {dom}
            {
              dom &&
              <>%</>
            }
          </>
        )
      }
    },
    {
      title: '预计开票日期',
      align: 'center',
      width: "8%",
    },
    {
      title: '预计收款日期',
      align: 'center',
      width: "8%",
    },
    {
      title: '开票日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '开票总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款日期',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '收款总计',
      align: 'center',
      width: "4.5%",
    },
    {
      title: '操作',
      align: 'center',
      width: '12%',
    },
  ]

  const uploadFileList = (entity) => {
    setShowUpload(true)
    setVoCostId(entity.id)
    if (entity.file_ids.length > 0) {
      getFileUrlByIds({ file_ids: entity.file_ids }).then(res => {
        if (res.success) {
          console.log(res.data)
          setCurrentFiles(res.data)
        }
      })
    }
    setCurrentFiles(entity.file_ids)
  }

  // 添加和删除并且重新排序 Collect
  const addOrDelCollect = (data, type, index) => {
    let i = 0
    let baseData: any = []
    data.map((item, idx) => {
      if (index !== idx || (index === idx && type === 'add')) {
        // item.collect_no = i < 1 ? item.project_no : item.project_no + '-' + i
        const newRow = {
          ...item,
          collect_no: i < 1 ? item.project_no : item.project_no + '-' + i,
          estimate_bill_at: '',
          estimate_collect_at: '',
        }
        baseData.push(newRow)
        i += 1
      }

      if (index === idx && type === 'add') {
        const newRow = {
          collect_no: item.project_no + '-' + i,
          project_no: item.project_no,
          estimate_bill_at: '',
          estimate_collect_at: '',
        }
        baseData.push(newRow)
        i += 1
      }
    })
    // setCollect(baseData)
    return baseData
  }

  // Collect 输入事件
  const inputCollect = (data, value, index, type) => {
    let ret = []
    // data[index]
    data.map((item, idx) => {
      let format = {
        ...item
      }
      if (idx === index) {
        if (type === 'price') {
          format = {
            ...item,
            price: value,
            percent: value ? (parseFloat(value) / parseFloat(data[0].price) * 100).toFixed(2) : 0,
            tax_price: value ? (parseFloat(data[0].tax_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : '',
            sub_total_price: value ? (parseFloat(data[0].sub_total_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : 0,
            cost_price: value ? (parseFloat(data[0].cost_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : 0,
            profit_price: value ? (parseFloat(data[0].profit_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : 0,
            // profit_rate: value ? (parseFloat(data[0].profit_rate) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : 0,
          }
        }
        if (type === 'percent') {
          format = {
            ...item,
            price: value ? (parseFloat(data[0].price) * (parseFloat(value) / 100)).toFixed(2) : 0,
            percent: value,
            tax_price: value ? (parseFloat(data[0].tax_price) / parseFloat(value)).toFixed(2) : '',
            sub_total_price: value ? (parseFloat(data[0].sub_total_price) / parseFloat(value)).toFixed(2) : 0,
            cost_price: value ? (parseFloat(data[0].cost_price) / parseFloat(value)).toFixed(2) : 0,
            profit_price: value ? (parseFloat(data[0].profit_price) / parseFloat(value)).toFixed(2) : 0,
            // profit_rate: value ? (parseFloat(data[0].profit_rate) / parseFloat(value)) * parseFloat(value)).toFixed(2) : 0,
          }
        }
        // ret.push(format)
      }
      ret.push(format)
    })
    console.log(ret)
    return ret
  }

  // 点击 VoCost 第一条
  const addVoCost = (data) => {
    let ret = []
    data.map(item => {
      ret.push(item)
    })
    if (data.length === 1) {
      let newRow = {
        ...data[0],
        voCost_no: data[0].voCost_no + '1-1',
        project_no: '0_0',
        last_bill_at: '',
        last_collect_at: '',
      }
      ret.push(newRow)
    } else {
      let title = data[data.length - 1].project_no.split('_')[0]
      let newRow = {
        ...data[0],
        voCost_no: data[0].voCost_no + `${Number(title) + 2}-1`,
        project_no: `${Number(title) + 1}_0`,
        last_bill_at: '',
        last_collect_at: '',
      }
      ret.push(newRow)
    }
    return ret
  }

  // 添加和删除并且重新排序 VoCost
  const addOrDelVoCost = (data, type, index) => {
    let isDel = false
    let i = 1
    let baseData: any = []
    let baseTitle = data[0].voCost_no
    let x = data[index].project_no.split('_')[0]
    let y = data[index].project_no.split('_')[1]
    data.map((item, idx) => {
      console.log(item.project_no)
      let a = idx !== 0 ? item.project_no.split('_')[0] : ''
      let b = idx !== 0 ? item.project_no.split('_')[1] : ''
      if (a === x && index !== idx || (index === idx && type === 'add')) {
        const newRow = {
          ...item,
          voCost_no: baseTitle + (Number(a) + 1) + '-' + i,
          project_no: a + '_' + (i - 1),
          percent: 100,
          last_bill_at: '',
          last_collect_at: '',
        }
        baseData.push(newRow)
        i += 1
      }

      if (a === x && index === idx && type === 'add') {
        const newRow = {
          voCost_no: baseTitle + (Number(a) + 1) + '-' + i,
          project_no: a + '_' + (i - 1),
          percent: 100,
          last_bill_at: '',
          last_collect_at: '',
        }
        baseData.push(newRow)
        i += 1
      }

      if (
        type === 'del' &&
        index === idx &&
        data[index + 1] &&
        data[index + 1].project_no.split('_')[0] !== a
      ) {
        isDel = true
      }

      if (a !== x) {
        let newA = a
        if (idx === 0) {
          baseData.push(item)
          return
        }
        if (isDel) {
          newA = Number(a) - 1
        }
        const newRow = {
          ...item,
          voCost_no: baseTitle + (Number(newA) + 1) + '-' + (Number(b) + 1),
          project_no: newA + '_' + b,
          percent: 100,
          last_bill_at: '',
          last_collect_at: '',
        }
        baseData.push(newRow)
      }
    })
    return baseData
  }

  // VoCost 输入事件
  const inputVoCost = (data, value, index, type) => {
    let ret = []
    let totalData: any = {
      price: '',
      percent: 100,
      tax_price: '',
      sub_total_price: '',
      cost_price: '',
      profit_price: '',
      profit_rate: '',
    }
    data.map((item, idx) => {
      let format = {
        ...item
      }
      if (idx === index) {
        if (type === 'price') {
          format = {
            ...item,
            price: value,
            percent: 100,
            // tax_price: value ? (parseFloat(data[0].tax_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : '',
            tax_price: value ? (parseFloat(value) * 0.09).toFixed(2) : '',
            // sub_total_price: value ? (parseFloat(data[0].sub_total_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : '',
            sub_total_price: value ? ((parseFloat(value) * 1.09)).toFixed(2) : '',
            // cost_price: value ? (parseFloat(data[0].cost_price) / parseFloat(data[0].price) * parseFloat(value)).toFixed(2) : 0,
            profit_price: value ? (parseFloat(value) - parseFloat(item.cost_price || 0)).toFixed(2) : 0 - parseFloat(item.cost_price),
            profit_rate: item.cost ? (Number(parseFloat(value) - parseFloat(item.cost_price)) / Number(value) * 100).toFixed(2) : 100,
          }
        }
        if (type === 'cost_price') {
          format = {
            ...item,
            cost_price: value,
            profit_price: value ? (parseFloat(item.price) - parseFloat(value)).toFixed(2) : item.price,
            profit_rate: value ? (Number(parseFloat(item.price) - parseFloat(value)) / Number(item.price) * 100).toFixed(2) : '',
          }
        }
      }
      if (idx === 0) {
        format = {
          price: '',
          percent: 100,
          tax_price: '',
          sub_total_price: '',
          cost_price: '',
          profit_price: '',
          profit_rate: '',
        }
      }
      ret.push(format)
    })

    ret.shift()
    ret.map((item: any) => {
      totalData.voCost_no = (data[0].voCost_no).split('-')[0] + '-' + 'VO',
        totalData.price = (Number(totalData.price) + Number(item.price)).toFixed(2)
      totalData.tax_price = (Number(totalData.tax_price) + Number(item.tax_price)).toFixed(2)
      totalData.sub_total_price = (Number(totalData.sub_total_price) + Number(item.sub_total_price)).toFixed(2)
      totalData.cost_price = (Number(totalData.cost_price) + Number(item.cost_price)).toFixed(2)
      totalData.profit_price = (Number(totalData.profit_price) + Number(item.profit_price)).toFixed(2)
      totalData.profit_rate = (
        Number(totalData.profit_price) /
        Number(totalData.price) * 100
      ).toFixed(2)
      return item
    })
    ret.unshift(totalData)
    return ret
  }

  // 重新计算 Total
  const resetTotal = (collect, voCost) => {
    const totalData = [{
      total_no: 'Total Amount:',
      price: (Number(collect[0].price) + Number(voCost[0].price)).toFixed(2),
      tax_price: (Number(collect[0].tax_price) + Number(voCost[0].tax_price)).toFixed(2),
      sub_total_price: (Number(collect[0].sub_total_price) + Number(voCost[0].sub_total_price)).toFixed(2),
      cost_price: (Number(collect[0].cost_price) + Number(voCost[0].cost_price)).toFixed(2),
      profit_price: (Number(collect[0].profit_price) + Number(voCost[0].profit_price)).toFixed(2),
      profit_rate: (
        (Number(collect[0].profit_price) + Number(voCost[0].profit_price)) /
        (Number(collect[0].price) + Number(voCost[0].price)) * 100
      ).toFixed(2)
    }]
    return totalData
  }

  const uploadFile = (voCost, files) => {
    console.log(voCost, files, voCostId)
    let ret = []
    voCost.map(item => {
      let newRow = {
        ...item
      }
      if (item.id === voCostId) {
        newRow = {
          ...item,
          file_ids: [
            ...files.map(file => Number(file.uid))
          ]
        }
      }
      ret.push(newRow)
    })
    return ret
  }

  const [compute, dispatchCompute] = useReducer(
    produce((draft, act) => {
      const { type, payload } = act;
      let collect, collectData, voCost, voCostData, total
      switch (type) {
        case "init":
          draft.collectData = payload.collectData
          draft.voCostData = payload.voCostData
          draft.totalList = payload.totalList
          break;

        case "addOrDelCollect":
          collectData = current(draft.collectData)
          collect = addOrDelCollect(collectData, payload.type, payload.index)
          draft.collectData = collect
          break;

        case "inputCollect":
          collectData = current(draft.collectData)
          collect = inputCollect(collectData, payload.value, payload.index, payload.type)
          draft.collectData = collect
          break;

        case "addVoCost":
          voCostData = current(draft.voCostData)
          voCost = addVoCost(voCostData)
          draft.voCostData = voCost
          break;

        case "addOrDelVoCost":
          voCostData = current(draft.voCostData)
          voCost = addOrDelVoCost(voCostData, payload.type, payload.index)
          draft.voCostData = voCost
          break;

        case "inputVoCost":
          collectData = current(draft.collectData)
          voCostData = current(draft.voCostData)
          voCost = inputVoCost(voCostData, payload.value, payload.index, payload.type)
          draft.voCostData = voCost
          total = resetTotal(collectData, voCost)
          draft.totalList = total
          break;

        case "upload":
          voCostData = current(draft.voCostData)
          voCost = uploadFile(voCostData, payload.files)
          draft.voCostData = voCost
          break;

        default:
          break;
      }
    }), baseData)

  const handleCloseUpload = () => {
    setShowUpload(false)
  }

  const handleCloseInvoicing = () => {
    setShowInvoicing(false)
    setCurrentItem({})
  }

  const handleFileUploadChange = (files) => {
    dispatchCompute({
      type: 'upload',
      payload: {
        files: files
      }
    })
  }


  const handleSave = async () => {
    const collectParams = {
      project_id: currentMsg.id,
      collent_list: compute?.collectData ?? [],
    }
    let voCostData: any = []
    compute.voCostData.map((item, index) => {
      if (index !== 0) {
        const newData = {
          ...item,
          file_ids: item.file_ids ? item.file_ids.join(',') : ''
        }
        voCostData.push(newData)
      }
    })
    const voCostParams = {
      project_id: currentMsg.id,
      vo_cost_list: voCostData ?? []
    }
    const collectRes = await addCollectMoneyItem(collectParams)
    const voCostRes = await addVoCostItem(voCostParams)
    if (collectRes.success && voCostRes.success) {
      success("操作成功")
      return
    }
    error('错误')
  }

  return (
    <>
      <Table
        dataSource={compute.collectData ? compute.collectData : []}
        columns={collectColumns}
        pagination={false}
        bordered={true}
      />
      <Table
        dataSource={compute.voCostData ? compute.voCostData : []}
        showHeader={false}
        columns={voCostColumns}
        bordered={true}
        pagination={false}
      />
      <Table
        dataSource={compute.totalList ? compute.totalList : []}
        showHeader={false}
        columns={totalColumns}
        bordered={true}
        pagination={false}
      />
      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={handleSave}
      >
        保存
      </Button>

      <Modal
        open={showUpload}
        onCancel={handleCloseUpload}
        title="上传附件"
        footer={null}
        destroyOnClose={true}
      >
        <GkUpload value={currentFiles} onChange={handleFileUploadChange} />
      </Modal>

      <Drawer
        width={1200}
        open={showInvoicing}
        onClose={handleCloseInvoicing}
        title="开票收款"
        destroyOnClose={true}
      >
        <Reimbursement
          type="invoicing"
          currentMsg={currentMsg}
          currentItem={currentItem}
          handleCloseInvoicing={handleCloseInvoicing}
        />
      </Drawer>
    </>
  )
}

export default FinalInvoice