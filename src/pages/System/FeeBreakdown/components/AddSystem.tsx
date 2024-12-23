import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { SelectProps } from "antd/lib";
import { brandDescPricesAdd, brandDescPricesEdit } from "@/services/ant-design-pro/system";


interface ItemListProps {
    handleClose: () => void
    actionRef
    success
    error
    currentMsg
    brandList
}

const AddSystem: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    currentMsg,
    brandList
}) => {
    const [form] = Form.useForm()

    const optionsBrand: SelectProps['options'] = brandList.map((item) => {
        return {
            value: item.id,
            label: item.brand_en,
        };
    });

    const handleFinish = (values) => {
        console.log(values)
        let params
        if (!currentMsg) {
            params = {
                brand_id: values.brand_en ?? '',
                description: values.description ?? '',
                unit: values.unit ?? '',
                unit_price: values.unit_price ?? ''
            }
            brandDescPricesAdd(params).then((res) => {
                if (res.success) {
                    handleClose()
                    actionRef.current.reload()
                    success('添加成功')
                    return
                }
                error(res.message)
            })
            return
        }
        params = {
            id: currentMsg.id ?? '',
            brand_id: values.brand_en.value ?? values.brand_en ?? '',
            description: values.description ?? '',
            unit: values.unit ?? '',
            unit_price: values.unit_price ?? '',
            brand: currentMsg.brand_en ?? '',
            brand_en: currentMsg.brand_en ?? '',
            brand_en_all: currentMsg.brand_en ?? '',
            created_at: currentMsg.created_at ?? '',
            updated_at: currentMsg.updated_at ?? '',
        }
        console.log(params);
        brandDescPricesEdit(params).then((res) => {
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
            id: currentMsg.id ?? '',
            brand_en: {
                value: currentMsg.brand_id,
                label: currentMsg.brand_en
            } ?? '',
            description: currentMsg.description ?? '',
            unit: currentMsg.unit ?? '',
            unit_price: currentMsg.unit_price ?? ''
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
            {
                currentMsg &&
                <Form.Item label="项目ID" name="id">
                    <Input readOnly/ >
                </Form.Item>
            }
            <Form.Item label="品牌" name="brand_en">
                <Select options={optionsBrand}></Select>
            </Form.Item>
            <Form.Item label="项目" name="description" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="单位" name="unit">
                <Input />
            </Form.Item>
            <Form.Item label="单价" name="unit_price" rules={[{ required: true }]}>
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
export default AddSystem