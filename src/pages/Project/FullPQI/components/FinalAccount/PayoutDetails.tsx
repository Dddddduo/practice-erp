import React, { useState, useEffect } from 'react';
import { Button, Divider, Form, Input, Select, Space, Typography, Table, DatePicker } from 'antd';
import GkUpload from '@/components/UploadImage/GkUpload';
import dayjs from 'dayjs';

interface ItemListProps {
    currentItem: {
        id: number
    }
}

const PayoutDetails: React.FC<ItemListProps> = ({
    currentItem
}) => {

    const [form] = Form.useForm()

    const handleFinish = (values) => {
        console.log(values);

    }

    useEffect(() => {
        console.log(currentItem);
        form.setFieldsValue({
            amount: currentItem?.amount ?? '',
            create_at: currentItem?.create_at ? dayjs(currentItem?.create_at, 'YYYY-MM-DD') : "",
            reim_remark: currentItem?.reim_remark ?? ''
            
        })
    }, [])

    return (
        <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={handleFinish}
        >
            <Form.Item label="金额" name="amount">
                <Input />
            </Form.Item>
            <Form.Item label="附件" name="files">
                <GkUpload />
            </Form.Item>
            <Form.Item label="打款时间" name="create_at">
                <DatePicker />
            </Form.Item>
            <Form.Item label="备注" name="reim_remark">
                <Input />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType='submit'>提交</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default PayoutDetails