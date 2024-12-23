import { Button, Cascader, Form, Input, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { departmentList, saveEmployee } from "@/services/ant-design-pro/system";

interface Props {
  currentItem: any
  handleCloseReassignment: () => void
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
}

const Reassignment: React.FC<Props> = ({
  currentItem,
  handleCloseReassignment,
  success,
  error,
  actionRef,
}) => {
  const [form] = Form.useForm()
  const [department, setDepartment] = useState([])

  const handleFinish = (values) => {
    let departmentIds: number[] = []
    values.department.map(item => {
      departmentIds.push(item[item.length - 1])
    })
    const params = {
      ...currentItem,
      department_id: values.department ?? [],
      post: values.post ?? ''
    }
    saveEmployee(params).then(res => {
      if (res.success) {
        handleCloseReassignment()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    departmentList({ tree: true }).then(res => {
      if (res.success) {
        setDepartment(res.data)
        // let format = currentItem.departments.map((item, index) => {
        //   let departments: number[] = []
        //   if (item.pid) {
        //     departments.push(item.pid)
        //   }
        //   departments.push(item.id)
        //   return departments
        // })
        form.setFieldsValue({
          department: currentItem.department_id ?? [],
          post: currentItem.post ?? ''
        })
      }
    })
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item name='department' label="部门">
        {/* <Cascader multiple options={department} showCheckedStrategy="SHOW_CHILD" /> */}
        <Select mode="multiple" options={department} allowClear />
      </Form.Item>

      <Form.Item name='post' label="岗位">
        <Input />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseReassignment}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Reassignment