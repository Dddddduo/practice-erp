import React from "react"
import { Form, DatePicker, Space, Button } from "antd"
import {
  exportGucciMonthlyClosingSummaryExcel,
  exportFendiMonthlyClosingSummaryExcel,
  exportMonclerMonthlyClosingSummaryExcel,
  exportDiorMonthlyClosingSummaryExcel
} from "@/services/ant-design-pro/aggregateQuotes"
import dayjs from "dayjs"
import { downloadFile } from "@/utils/utils"


interface ItemListProps {
  title: string
  handleCloseSummary: () => void
  success: (text: string) => void
  error: (text: string) => void
}

const Summary: React.FC<ItemListProps> = ({
  title,
  handleCloseSummary,
  success,
  error
}) => {

  const [form] = Form.useForm()

  const handleFinish = (values) => {
    if (!values.month) {
      error('请选择时间')
      return
    }
    values.month = dayjs(values.month).format('YYYY-MM')
    if (title === 'GUCCI MC汇总') {
      exportGucciMonthlyClosingSummaryExcel({ date: values.month }).then(async (res) => {
        console.log(res);
        if (res.success) {
          if (res.data === '') {
            error('暂无数据')
            return
          }
          await downloadFile(
            res.data.replace("http:", "https:"),
            dayjs().format("YYYYMMDD") + ".xlsx"
          )
          handleCloseSummary()
        }
      })
      return
    } else if (title === 'FENDI MC汇总') {
      exportFendiMonthlyClosingSummaryExcel({ date: values.month }).then(async (res) => {
        if (res.success) {
          if (res.data === '') {
            error('暂无数据')
            return
          }
          await downloadFile(
            res.data.replace("http:", "https:"),
            dayjs().format("YYYYMMDD") + ".xlsx"
          )
          handleCloseSummary()
        }
      })
    } else if (title === 'MONCLER MC汇总') {
      exportMonclerMonthlyClosingSummaryExcel({ date: values.month, type: '' }).then(async (res) => {
        if (res.success) {
          if (res.data === '') {
            error('暂无数据')
            return
          }
          await downloadFile(
            res.data.replace("http:", "https:"),
            dayjs().format("YYYYMMDD") + ".xlsx"
          )
          handleCloseSummary()
        }
      })
    } else if (title === 'Dior MC汇总') {
      exportDiorMonthlyClosingSummaryExcel({ date: values.month, type: "fix" }).then(async (res) => {
        if (res.success) {
          if (res.data === '') {
            error('暂无数据')
            return
          }
          await downloadFile(
            res.data.replace("http:", "https:"),
            dayjs().format("YYYYMMDD") + ".xlsx"
          )
          handleCloseSummary()
        }
      })
    }

  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}
    >
      <Form.Item label="月份" name="month">
        <DatePicker picker="month" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item>
        <Space style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit">确 定</Button>
          <Button type="primary" danger onClick={() => handleCloseSummary()}>取 消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Summary