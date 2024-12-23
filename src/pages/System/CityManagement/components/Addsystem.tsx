import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { createOrUpdateCityInfo } from "@/services/ant-design-pro/system";


interface ItemListProps {
    handleClose: () => void
    actionRef
    success
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
        // console.log(currentMsg)
        let params
        if (!currentMsg) {
            params = {
                city: values.city_cn ?? '',
                city_cn: values.city_cn ?? '',
                city_en: values.city_en ?? '',
                country_cn: values.country_cn ?? '',
                country_en: values.country_en ?? '',
                sort_cn: values.sort_cn ?? '',
                sort_en: values.sort_en ?? '',
            }
            console.log(currentMsg);

        } else {
            params = {
                city: values.city_cn ?? '',
                city_cn: values.city_cn ?? '',
                city_en: values.city_en ?? '',
                country_cn: values.country_cn ?? '',
                country_en: values.country_en ?? '',
                sort_cn: values.sort_cn ?? '',
                sort_en: values.sort_en ?? '',
                city_id: currentMsg.id ?? '',
                id: currentMsg.id ?? '',
                search_all: currentMsg.search_all ?? '',
                city_short: currentMsg.city_short ?? '',
            }
        }
        console.log(params);
        createOrUpdateCityInfo(params).then((res) => {
            console.log(res)
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('处理成功')
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
            city: currentMsg.city_cn ?? '',
            city_cn: currentMsg.city_cn ?? '',
            city_en: currentMsg.city_en ?? '',
            country_cn: currentMsg.country_cn ?? '',
            country_en: currentMsg.country_en ?? '',
            sort_cn: currentMsg.sort_cn ?? '',
            sort_en: currentMsg.sort_en ?? '',
        })
    })


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="城市中文名" name="city_cn">
                <Input />
            </Form.Item>
            <Form.Item label="城市英文名" name="city_en">
                <Input />
            </Form.Item>
            <Form.Item label="国家中文名" name="country_cn">
                <Input />
            </Form.Item>
            <Form.Item label="国家英文名" name="country_en">
                <Input />
            </Form.Item>
            <Form.Item label="中文简写" name="sort_cn">
                <Input />
            </Form.Item>
            <Form.Item label="英文简写" name="sort_en">
                <Input />
            </Form.Item>
            <Form.Item style={{ marginLeft: 200 }}>
                <Space>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                    <Button type="primary" htmlType='submit'>提交</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default Addsystem