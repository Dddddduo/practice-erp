import SubmitButton from '@/components/Buttons/SubmitButton';
import { getContractProfitRate, switchProjectStatus } from '@/services/ant-design-pro/project';
import { Form, Input, Select, message } from 'antd';
import { difference, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

type MapType = { [key: string]: any };
interface BidderProps {
  rateList: { value: string, label: string }[]
  tableData: MapType
  baseData: MapType
}

const Bidder: React.FC<BidderProps> = ({
  rateList,
  tableData,
  baseData
}) => {
  const [form] = Form.useForm()
  const [rate, setRate] = useState('')
  const [isHasValue, setIsHasValue] = useState(false)

  const handleFinish = (values) => {
    values = { ...values, rate: rateList[rate].label }
    console.log(values);

    const params = {
      project_id: baseData.currentRow.id,
      project_status: 1,
      contract_profit_rate: values.rate ?? '',
      profit: values.profit ?? '',
      contract_total_price: values.InVAT ?? '',
      totalAmountExPrice: values.ExVAT ?? '',
      totalAmountInPrice: values.InVAT ?? '',
      vat: values.VAT ?? ''
    }
    console.log(params);

    switchProjectStatus(params).then(res => {
      if (res.success) {
        message.success('提交成功')
        return
      }
      message.error(res.message)
    })
  }

  const handleChangeRate = (index) => {
    setRate(index)
    if (isEmpty(tableData.top)) {
      return
    }
    let valueList: any = []
    for (const key in tableData.top) {
      if (key === '0') {
        continue
      }
      const value = difference(Object.values(tableData.top[key]), Object.values(tableData.top[key]).splice(0, 2))
      valueList.push(value[index])
    }
    form.setFieldsValue({
      profit: valueList[0] ?? '',
      InVAT: valueList[1] ?? '',
      ExVAT: valueList[2] ?? '',
      VAT: valueList[3] ?? '',
    })
  }

  useEffect(() => {
    if (isEmpty(baseData) && isEmpty(rateList)) {
      return
    }

    getContractProfitRate({ project_id: baseData?.currentRow.id }).then(res => {
      if (res.success) {
        setRate(res.data)
        if (res.data) {
          form.setFieldsValue({
            rate: res.data ?? '',
          })
          setIsHasValue(true)
        }
      }
    })

    const rateIndex = rateList.map(item => item.label).indexOf(baseData?.projectInfo?.contract_profit_rate).toString()

    let valueList: any = []
    for (const key in tableData.top) {
      if (key === '0') {
        continue
      }
      const value = difference(Object.values(tableData.top[key]), Object.values(tableData.top[key]).splice(0, 2))

      valueList.push(value[rateIndex])
    }
    // console.log(valueList);

    form.setFieldsValue({
      profit: valueList[0] ?? '',
      InVAT: valueList[1] ?? '',
      ExVAT: valueList[2] ?? '',
      VAT: valueList[3] ?? '',
    })

  }, [baseData, rateList])

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      style={{ maxWidth: 800 }}
      onFinish={handleFinish}
    >
      <Form.Item name="rate" label="中标利润率">
        {
          !isHasValue ?
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Select options={rateList} allowClear onChange={handleChangeRate} />
              <span style={{ fontSize: 20, marginLeft: 10 }}>%</span>
            </div> :
            <Input value={rate} readOnly bordered={false} suffix="%" />
        }

      </Form.Item>

      {
        rate &&
        <>
          <Form.Item name="profit" label="Profit">
            <Input suffix="RMB" readOnly bordered={false} />
          </Form.Item>

          <Form.Item name="InVAT" label="Total Amount(In. VAT)">
            <Input suffix="RMB" readOnly bordered={false} />
          </Form.Item>

          <Form.Item name="ExVAT" label="Total Amount(Ex. VAT)">
            <Input suffix="RMB" readOnly bordered={false} />
          </Form.Item>

          <Form.Item name="VAT" label="VAT">
            <Input suffix="RMB" readOnly bordered={false} />
          </Form.Item>

          {
            !isHasValue &&
            <Form.Item label=" " colon={false}>
              <SubmitButton
                type='primary'
                children="提交"
                form={form}
              />
            </Form.Item>
          }
        </>
      }
    </Form>
  )
}

export default Bidder