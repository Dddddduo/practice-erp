import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { maintManagersAdd, maintManagersEdit } from "@/services/ant-design-pro/system";

interface ItemListProps {
    handleClose: () => void
    actionRef
    success,
    error
    currentMsg
}
const Addsystem: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    currentMsg
}) => {

    const [form] = Form.useForm()

    const handleFinish = (values) => {
        console.log(values)
        let params
        if (!currentMsg) {
            params = {
                username: values.username ?? '',
                tel: values.tel ?? '',
                id_number: values.id_number ?? ''
            }
            maintManagersAdd(params).then(res => {
                if (res.success) {
                    handleClose()
                    actionRef.current.reload()
                    success('添加成功')
                    return
                }
                error(res.message)
            })
        }
        params = {
            id: currentMsg.id ?? '',
            username: values.username ?? '',
            tel: values.tel ?? '',
            id_number: values.id_number ?? ''
        }
        maintManagersEdit(params).then(res => {
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('修改成功')
                return
            }
            error(res.message)
        })
    }
    useEffect(() => {
        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            username: currentMsg.username ?? '',
            tel: currentMsg.tel ?? '',
            id_number: currentMsg.id_number ?? ''
        })
    })
    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="姓名" name="username" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="手机号" name="tel" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="身份证号" name="id_number" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item style={{ marginLeft: 200 }}>
                <Space>
                    <Button type="primary" htmlType='submit'>提交</Button>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default Addsystem