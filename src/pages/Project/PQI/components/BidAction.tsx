import React, { useEffect, useState } from "react"
import { getChoiceList, getContractProfitRate, switchProjectStatus } from "@/services/ant-design-pro/project"
import { Button, Divider, Form, Input, Select, Space, Typography } from "antd"
import { isUndefined } from "lodash"

interface ItemListProps {
  currentMsg: {
    id: number
    cost_price: number
    project_status: number
  },
  vat: number
  success: (text: string) => void
  error: (text: string) => void
}

const BidAction: React.FC<ItemListProps> = ({
  currentMsg,
  vat,
  success,
  error
}) => {
  const [form] = Form.useForm()
  const [profitRate, setProfitRate] = useState([])
  const [rate, setRate] = useState('')
  const [showSelect, setShowSelect] = useState(true)
  const [exVat, setExVat] = useState('')
  const [vatPrice, setVatPrice] = useState('')
  const [profit, setProfit] = useState('')
  const [inVat, setInVat] = useState('')
  const [contractProfitRate, setContractProfitRate] = useState('')

  const handleFinish = (values) => {
    const params = {
      project_id: currentMsg.id ?? '',
      project_status: currentMsg.project_status ?? '',
      contract_profit_rate: values?.rate ?? '',
      profit: values?.profit ?? '',
      contract_total_price: values?.inVat ?? '',
      totalAmountExPrice: values.exVat ?? '',
      totalAmountInPrice: values?.inVat ?? '',
      vat: values.vat ?? '',
    }
    switchProjectStatus(params).then(res => {
      if (res.success) {
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleChangeRate = (e) => {
    setShowSelect(true)
    setRate(e)
    const exVat = (Number(currentMsg.cost_price) / (1 - Number(e) / 100)).toFixed(2)
    const vatPrice = (Number(exVat) * Number(vat)).toFixed(2)
    const profit = (Number(exVat) - Number(currentMsg.cost_price)).toFixed(2)
    const inVat = (Number(exVat) + Number(vatPrice)).toFixed(2)
    setExVat(exVat)
    setVatPrice(vatPrice)
    setProfit(profit)
    setInVat(inVat)
    form.setFieldsValue({
      rate: e ?? '',
      exVat: exVat ?? '',
      vat: vatPrice ?? '',
      profit: profit ?? '',
      inVat: inVat ?? '',
    })
  }

  useEffect(() => {
    console.log(currentMsg);

    if (!currentMsg) {
      return
    }

    getContractProfitRate({ project_id: currentMsg.id }).then(res => {
      if (res.success) {
        console.log(res.data);
        handleChangeRate(res.data)
        setRate(res.data)

        if (!res.data) {
          setShowSelect(false)
        }
      }
    })

    getChoiceList({ project_id: currentMsg.id }).then(res => {
      if (res.success) {
        const rate: any = []
        res.data.map(item => {
          if (item.profit_rate) {
            const row = {
              value: item.profit_rate,
              label: item.profit_rate
            }
            rate.push(row)
          }
        })
        setProfitRate(rate)
      }
    })
  }, [])

  return (
    <div style={{ marginTop: 50 }}>
      <Typography.Title level={4}>中标操作</Typography.Title>

      <Divider />

      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item label="中标利润率" name='rate'>
          {
            (!rate || showSelect) ?
              <Select options={profitRate} allowClear onChange={handleChangeRate} style={{ width: 150 }} /> :
              <>
                <Input value={rate} readOnly bordered={false} style={{ width: 150 }} />
                <span>%</span>
              </>
          }
        </Form.Item>

        {
          (rate || showSelect) &&
          <>
            <Form.Item label="Profit" name='profit'>
              <Input value={profit} readOnly bordered={false} style={{ width: 150 }} />RMB
            </Form.Item>

            <Form.Item label="Total Amount(In. VAT)" name='inVat'>
              <Input value={inVat} readOnly bordered={false} style={{ width: 150 }} />RMB
            </Form.Item>

            <Form.Item label="Total Amount(Ex. VAT)" name='exVat'>
              <Input value={exVat} readOnly bordered={false} style={{ width: 150 }} />RMB
            </Form.Item>

            <Form.Item label="VAT" name='vat'>
              <Input value={vatPrice} readOnly bordered={false} style={{ width: 150 }} />RMB
            </Form.Item>
          </>
        }

        <Form.Item label=" " colon={false}>
          <Space>
            <Button type="primary" htmlType="submit">提交</Button>
          </Space>
        </Form.Item>

      </Form>
    </div>
  )
}

export default BidAction