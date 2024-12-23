import SubmitButton from "@/components/Buttons/SubmitButton"
import { Button, DatePicker, Form, Input, Select, Space } from "antd"
import dayjs from "dayjs"
import { updateResignation } from "@/services/ant-design-pro/system"

const DimissionType = [
  {
    value: "主动离职",
    label: "主动离职",
  },
  {
    value: "被动离职",
    label: "被动离职",
  },
  {
    value: "退休",
    label: "退休",
  },
  {
    value: "协商解除",
    label: "协商解除",
  },
  {
    value: "其他",
    label: "其他",
  },
]

const DimissionQuality = [
  {
    value: "可惜离职",
    label: "可惜离职",
  },
  {
    value: "普通离职",
    label: "普通离职",
  },
  {
    value: "减尾离职",
    label: "减尾离职",
  },
  {
    value: "自动离职",
    label: "自动离职",
  },
]

const DimissionRehiring = [
  {
    value: "优先录用",
    label: "优先录用",
  },
  {
    value: "正常录用",
    label: "正常录用",
  },
  {
    value: "永不录用",
    label: "永不录用",
  },
]

interface Props {
  currentItem: any
  handleCloseDimission: () => void
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
}

const Dimission: React.FC<Props> = ({
  currentItem,
  handleCloseDimission,
  success,
  error,
  actionRef,
}) => {
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    let resignation_time = ''
    let operate_resignation_time = ''
    if (values.time) {
      resignation_time = dayjs(values.time).format('YYYY-MM-DD')
    }
    if (values.time_at) {
      operate_resignation_time = dayjs(values.time_at).format('YYYY-MM-DD')
    }
    const params = {
      employee_id: currentItem.id ?? '',
      resignation_type: values.type ?? '',
      resignation_date: resignation_time ?? '',
      operate_resignation_date: operate_resignation_time ?? '',
      resignation_nature: values.quality ?? '',
      re_employment_suggestion: values.rehiring ?? '',
      resignation_reason: values.dimission_cause ?? '',
      apply_resignation_reason: values.cause ?? '',
    }
    updateResignation(params).then(res => {
      if (res.success) {
        handleCloseDimission()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      onFinish={handleFinish}
    >
      <Form.Item name="type" label="离职类型" rules={[{ required: true }]}>
        <Select allowClear options={DimissionType} placeholder="请选择" />
      </Form.Item>

      <Form.Item name="time" label="离职日期" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="time_at" label="办理离职日期">
        <DatePicker />
      </Form.Item>

      <Form.Item name="quality" label="离职性质">
        <Select allowClear options={DimissionQuality} placeholder="请选择" />
      </Form.Item>

      <Form.Item name="rehiring" label="复聘建议">
        <Select allowClear options={DimissionRehiring} placeholder="请选择" />
      </Form.Item>

      <Form.Item name="dimission_cause" label="离职原因">
        <Input />
      </Form.Item>

      <Form.Item name="cause" label="申请离职原因">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton form={form} type="primary">提交</SubmitButton>
          <Button danger onClick={handleCloseDimission}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Dimission