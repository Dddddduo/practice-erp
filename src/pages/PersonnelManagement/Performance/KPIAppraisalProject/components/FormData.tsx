import { Button, Form, Input, Space, message, InputNumber } from "antd"
import TableData from "./TableData";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { useEffect, useState } from "react";
import { createOrUpdateKpiItem } from "@/services/ant-design-pro/kpi";

interface FormDataProps {
  currentRecord: {
    kpi_item_id: number
    item: string
    score: string
    remark: string
    info: []
    type: string
  }
  onValueChange: (path: string, value: any) => void
  onClose: () => void
  actionRef: any
}

const FormBaseData: React.FC<FormDataProps> = ({
  currentRecord,
  onValueChange,
  onClose,
  actionRef,
}) => {
  const [form] = Form.useForm();
  const [score, setScore] = useState<number>(1)

  const handleFinish = async (values) => {
    const kpi_info: any = []
    const totalRate = values.info.reduce((rate, currentInfo) => {
      return  Number(rate) + Number(currentInfo.rate)
    }, 0)

    if (Number(totalRate) !== Number(values.score)) {
      message.error('权重之和必须等于分数')
      return
    }

    if (values.info.length > 0) {
      values.info.map(item => {
        kpi_info.push({
          content: item.content,
          rate: item.rate,
          score_index: item.score_index,
          weight: parseInt(item.rate) / 100,
        })
      })
    }

    const params = {
      kpi_item_id: values?.kpi_item_id ?? undefined,
      use_for: 'hr',
      kpi_item: values.item ?? '',
      kpi_score: values.score ?? '',
      remark: values.remark ?? '',
      kpi_info: kpi_info ?? [],
    }

    const hide = message.loading('loading...');
    try {
      const result = await createOrUpdateKpiItem(params)
      if (result.success) {
        message.success('处理成功')
        return
      }

      message.error('处理失败');
    } catch (err) {
      message.error('处理异常：' + (err as Error).message);
    } finally {
      hide();
      onClose()
      actionRef.current.reload()
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      kpi_item_id: currentRecord?.kpi_item_id ?? undefined,
      use_for: currentRecord?.type ?? 'hr',
      item: currentRecord?.item ?? '',
      score: currentRecord?.score ?? '',
      remark: currentRecord?.remark ?? '',
      info: currentRecord?.info
    })
  }, [currentRecord])

  return (
    <Form
      form={form}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: '100%' }}
      onValuesChange={(changedValues, value) => onValueChange('baseData', value)}
      onFinish={handleFinish}
    >
      <Form.Item name="kpi_item_id" hidden={true}>
        <Input />
      </Form.Item>

      <Form.Item name="use_for" hidden={true}>
        <Input />
      </Form.Item>
      {/*<input value={currentRecord?.kpi_item_id} type="hidden"/>*/}
      <Form.Item label="考核项目" name="item" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="分数"
        name="score"
        rules={[
          { required: true }
        ]}
      >
        <InputNumber
          min={1}
          max={99}
          style={{ width: '100%' }}
          onChange={(e) => {
            setScore(e)
          }}
        />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <Input />
      </Form.Item>

      <Form.Item label="指标" name="info">
        <TableData
          currentRecord={currentRecord}
          onValueChange={onValueChange}
          score={score}
        />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
          <Button danger onClick={onClose}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FormBaseData
