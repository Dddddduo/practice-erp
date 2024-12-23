import React, {useEffect, RefObject} from "react"
import {Typography, Form, Select, Input, Button, DatePicker} from "antd";
import type { SelectProps } from 'antd';
import { appoTask } from "@/services/ant-design-pro/orderList";
import dayjs from "dayjs";
import { ActionType } from '@ant-design/pro-components';

interface ItemListProps {
  workerList: any
  currentAssign: any
  actionRef: RefObject<ActionType>;
  closeAssignModal: () => void
}

const Assign: React.FC<ItemListProps> = ({
  workerList,
  currentAssign,
  actionRef,
  closeAssignModal
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (values.date && values.date.$d) {
      values.date = dayjs(values.date.$d).format('YYYY-MM-DD')
    }
    console.log(currentAssign);
    
    const params = {
      appo_task_id: currentAssign.appo_task_id ?? 0,
      ma_item_supplier_id: currentAssign.ma_item_supplier_id ?? currentAssign.details.ma_item_supplier_id ?? '',
      worker_id: values.worker.value ?? values.worker,
      appo_remark: values.remark ?? ''
    }
    console.log(params);
    appoTask(params).then(res => {
      if (res.success) {
        closeAssignModal()
        actionRef?.current?.reload();
      }
    })
  }

  // 处理工人
  const optionsWorkers: SelectProps['options'] = workerList.map((item: any) => {
    return {
      value: item.worker_id,
      label: item.name
    }
  })

  useEffect(() => {
    
    form.setFieldsValue({
      worker: {
        value: currentAssign.worker_id,
        label: currentAssign.value
      }
    })
  }, [currentAssign])

  return (
    <>
      <Typography.Title level={3}>负责人指派</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        <Form.Item label="选择施工负责人" name="worker">
          <Select placeholder="请选择" options={optionsWorkers}></Select>
        </Form.Item>

        <Form.Item label="选择日期" name="date">
          <DatePicker />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item style={{position: 'relative', left: 138}}>
          <Button type="primary" htmlType="submit">指派并通知</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Assign