import React, { useEffect } from 'react'
import { Typography, Form, Radio, Input, Button, DatePicker } from "antd";
import dayjs from 'dayjs';
import { updateApproveInfo } from '@/services/ant-design-pro/orderList';

const { RangePicker } = DatePicker;

interface ItemListProps {
  workerRepairInfo: any
  closeWorkerModal: () => void
}
const WorkerSelect: React.FC<ItemListProps> = ({
  workerRepairInfo,
  closeWorkerModal
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const params = {
      appo_task_id: workerRepairInfo.appo_task_id,
      submit_remark: values.submit_remark,
      status: workerRepairInfo.status,
      approve_reason: workerRepairInfo.approve_reason,
      ma_start_at: values.ma_satrt_to_end_time[0] ? dayjs(values.ma_satrt_to_end_time[0].$d).format('YYYY-MM-DD') : '',
      ma_end_at: values.ma_satrt_to_end_time[1] ? dayjs(values.ma_satrt_to_end_time[1].$d).format('YYYY-MM-DD') : '',
    }
    console.log(params);
    updateApproveInfo(params).then(res => {
      if (res.success) {
        closeWorkerModal()
      }
    })

  }

  useEffect(() => {
    form.setFieldsValue({
      ma_satrt_to_end_time: [dayjs(workerRepairInfo.ma_start_at, 'YYYY-MM-DD'), dayjs(workerRepairInfo.ma_end_at, 'YYYY-MM-DD')] ?? [],
      worker_list: workerRepairInfo.worker_list ?? [],
      submit_remark: workerRepairInfo.submit_remark ?? '',
      show_button: workerRepairInfo.show_button ?? 0,
    })
  }, [])
  return (
    <>
      <Typography.Title level={3}>工人选择</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        <Form.Item label="维修日期" name="ma_satrt_to_end_time">
          <RangePicker />
        </Form.Item>

        <Form.Item label="施工工人" name="worker_list">
          {
            workerRepairInfo.worker_list.map(item => {
              return (
                <div key={item.worker_id}>
                  <span>{item.worker}</span>
                  {
                    item.is_leader === 1 &&
                    <span>(施工负责人)</span>
                  }
                </div>
              )
            })
          }
        </Form.Item>

        <Form.Item label="施工负责人备注" name="submit_remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="状态" name="show_button">
          <Radio.Group>
            <Radio value={1}>通过并通知</Radio>
            <Radio value={2}>拒绝并通知</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' style={{ position: 'relative', left: 135 }}>确认</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default WorkerSelect