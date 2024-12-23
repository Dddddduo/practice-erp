import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { marketsAdd, marketsEdit } from "@/services/ant-design-pro/system";
import { SelectProps } from "antd/lib";
import SubmitButton from "@/components/Buttons/SubmitButton";
interface ItemListProps {
    handleClose: () => void
    actionRef
    success
    error
    currentMsg
    cityList
}
const Addsystem: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    currentMsg,
    cityList,
}) => {

    const [form] = Form.useForm()

    const optionsCity: SelectProps['options'] = cityList.map((item) => {
        return {
            value: item.id,
            label: item.city_cn,
        };
    });

    const handleFinish = (values) => {
        let params
        cityList?.map(item => {
            if (item.id === values.city) {
                values.city = item.city_cn
            }
        })

        if (!currentMsg) {
            params = {
                city: values.city ?? '',
                market: values.market ?? '',
                market_en: values.market_en ?? '',
                address: values.address ?? '',
                address_en: values.address_en ?? '',
            }
            marketsAdd(params).then(res => {
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
            city: values.city ?? '',
            market: values.market ?? '',
            market_en: values.market_en ?? '',
            address: values.address ?? '',
            address_en: values.address_en ?? '',
            id: currentMsg.id ?? '',
            district_code: '',
            province: '',
            district: '',
            lng: '',
            lat: '',
            created_at: currentMsg.created_at ?? '',
            updated_at: currentMsg.updated_at ?? '',
        }
        marketsEdit(params).then(res => {
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
            city: currentMsg.city ?? '',
            market: currentMsg.market ?? '',
            market_en: currentMsg.market_en ?? '',
            address: currentMsg.address ?? '',
            address_en: currentMsg.address_en ?? '',
        })
    })
    return (
        <Form
            form={form}
            onFinish={handleFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="城市" name="city">
                <Select options={optionsCity}></Select>
            </Form.Item>
            <Form.Item label="商场中文名" name="market">
                <Input />
            </Form.Item>
            <Form.Item label="商场英文名" name="market_en">
                <Input />
            </Form.Item>
            <Form.Item label="地址中文" name="address">
                <Input />
            </Form.Item>
            <Form.Item label="地址英文" name="address_en">
                <Input />
            </Form.Item>
            <Form.Item label=" " colon={false}>
                <Space>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                    <SubmitButton type="primary" form={form}>提交</SubmitButton>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default Addsystem