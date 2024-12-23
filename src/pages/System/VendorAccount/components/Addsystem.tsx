import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { getVendorListPage } from "@/services/ant-design-pro/system";
import { SelectProps } from "antd/lib";
import { createOrUpdateVendorAccount } from "@/services/ant-design-pro/system";
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
        console.log(values.other_vendor_name)
        let params
        if (!currentMsg) {
            params = {
                username: values.username ?? '',
                password: values.password ?? '',
                re_password: values.dobelPwd ?? '',
                status: values.status ?? '',
                vendor_uid: '',
                other_vendor_id: values.other_vendor_name ?? '',
            }
            console.log(params)
        } else {
            params = {
                username: values.username ?? '',
                other_vendor_name: currentMsg.other_vendor_name ?? '',
                other_vendor_id: values.other_vendor_name ?? '',
                status: values.status ?? '',
                id: currentMsg.id ?? '',
                vendor_uid: currentMsg.id ?? '',
                create_at: currentMsg.create_at ?? '',
                update_at: currentMsg.update_at ?? '',
            }
        }
        console.log(params)
        createOrUpdateVendorAccount(params).then((res) => {
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
    console.log(currentMsg);

    const [vendor, setVendor] = useState([])

    const optionsVendor: SelectProps['options'] = vendor?.map((item) => {
        return {
            value: item.id,
            label: item.vendor_name,
        };
    });
    useEffect(() => {
        getVendorListPage().then(res => {
            setVendor(res.data.list)
        })
        if (!currentMsg) {
            return
        }
        console.log(currentMsg);
        form.setFieldsValue({
            username: currentMsg.username ?? '',
            other_vendor_name: currentMsg.other_vendor_id ?? '',
            status: currentMsg.status ?? '',
        })
    }, [])


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="登录账号" name="username">
                <Input />
            </Form.Item>
            {
                !currentMsg &&
                <Form.Item label="登陆密码" name="password">
                    <Input.Password></Input.Password>
                </Form.Item>
            }

            {
                !currentMsg &&
                <Form.Item label="确定密码" name="dobelPwd" rules={[
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码不一致！'));
                        },
                    }),
                ]}>
                    <Input.Password></Input.Password>
                </Form.Item>
            }




            <Form.Item label="供应商名称" name="other_vendor_name">
                <Select options={optionsVendor}></Select>
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
        </Form >
    )
}
export default Addsystem