import React, { useEffect } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { createOrUpdateVendor, getFileUrlById } from "@/services/ant-design-pro/system";
import GkUpload from "@/components/UploadImage/GkUpload";

interface ItemListProps {
    handleClose: () => void
    actionRef
    currentMsg
    success
    error
}


const Addsystem: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    currentMsg,
    success,
    error

}) => {

    const [form] = Form.useForm()

    const handleFinish = (values) => {
        console.log(values)
        let params
        if (!currentMsg) {
            params = {
                vendor_name: values.vendor_name ?? '',
                vendor_name_en: values.vendor_name_en ?? '',
                mobile: values.mobile ?? '',
                address: values.address ?? '',
                address_en: values.address_en ?? '',
                status: values.status ?? '',
                logo: values.file ? values.file[0].file_id : '',
            }
            console.log(currentMsg)
        } else {
            params = {
                vendor_name: values.vendor_name ?? '',
                vendor_name_en: values.vendor_name_en ?? '',
                mobile: values.mobile ?? '',
                address: values.address ?? '',
                address_en: values.address_en ?? '',
                status: values.status ?? '',
                logo: values.file ? values.file[0].file_id : '',
                create_uid: 1,
                id: currentMsg.id ?? '',
                vendor_id: currentMsg.id ?? '',
            }
        }
        console.log(currentMsg)

        createOrUpdateVendor(params).then((res) => {
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
        console.log(currentMsg);
        form.setFieldsValue({
            vendor_name: currentMsg.vendor_name ?? '',
            vendor_name_en: currentMsg.vendor_name_en ?? '',
            mobile: currentMsg.mobile ?? '',
            address: currentMsg.address ?? '',
            address_en: currentMsg.address_en ?? '',
            status: currentMsg.status ?? '',
        })
        if (currentMsg.logo === '') {
            return
        }
        getFileUrlById({ file_id: currentMsg.logo }).then(res => {
            if (res.success) {
                form.setFieldsValue({
                    file: [
                        {
                            url: res.data.file_url_thumb
                        }
                    ] ?? ''
                })
            }
        })
    }, [])

    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="供应商名称" name="vendor_name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="供应商名称(英)" name="vendor_name_en">
                <Input />
            </Form.Item>
            <Form.Item label="logo" name="file">
                <GkUpload fileLength={1} />
            </Form.Item>
            <Form.Item label="联系电话" name="mobile">
                <Input />
            </Form.Item>
            <Form.Item label="地址" name="address">
                <Input />
            </Form.Item>
            <Form.Item label="地址-英文" name="address_en">
                <Input />
            </Form.Item>
            <Form.Item label="状态" name="status">
                <Radio.Group>
                    <Radio value="disable">禁用</Radio>
                    <Radio value="able">启用</Radio>
                </Radio.Group>
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