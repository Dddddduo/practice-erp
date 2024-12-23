import React, { useEffect } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { createOrUpdateByBrandUser } from "@/services/ant-design-pro/system";
import type { SelectProps } from 'antd';
interface ItemListProps {
    handleClose: () => void
    currentMsg: any
    brandList: any
    actionRef
    success: (text: string) => void
    error: (text: string) => void
}


const AddSystem: React.FC<ItemListProps> = ({
    handleClose,
    currentMsg,
    brandList,
    actionRef,
    success,
    error
}) => {

    const [form] = Form.useForm()

    const handleFinish = (values) => {
        // const brandStr = brandList.map(item => {
        //     values.brand.map(id => {
        //         if (item.id === id) {
        //             return item.brand_en
        //         }
        //         return item.brand_en
        //     })
        //     return item.brand_en
        // })
        let params
        if (!currentMsg) {
            params = {
                username: values.usnername ?? '',
                email: values.email ?? '',
                mobile: values.mobile ?? '',
                status: values.status ?? '',
                vendor_limit: values.vendor_limit ?? '',
                brand_ids: values?.brand ? values?.brand.join(',') : '',
                password: values.password ?? '',
                re_password:values.password ?? '',
                brand_id:values.brand ?? '',
                name: '',
                endpoint_id:'',
            }
        } else {
            params = {
                brand_uid: currentMsg.brand_uid,
                username: values.usnername,
                email: values.email,
                mobile: values.mobile,
                status: values.status,
                vendor_limit: values.vendor_limit,
                brand_ids: values?.brand.join(',') ?? '',
                status_cn: '当前客户端可见',
                brand_list: currentMsg.brand_list,
                brand_list_str: currentMsg.brand_list.map(item => item.brand_en).join(',')
            }
        }

        console.log(!currentMsg)
        createOrUpdateByBrandUser(params).then((res) => {
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
    const optionsBrand: SelectProps['options'] = brandList.map((item) => {
        return {
            value: item.id,
            label: item.brand_en,
        };
    });

    useEffect(() => {
        console.log(currentMsg);
        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            usnername: currentMsg?.usnername ?? '',
            email: currentMsg?.email ?? '',
            mobile: currentMsg?.mobile ?? '',
            vendor_limit: currentMsg?.vendor_limit ?? '',
            status: currentMsg?.status ?? 'n',
            brand: currentMsg?.brand_list.map(item => item.brand_id) ?? [],
        })
    }, [currentMsg])


    return (
        <Form
            name="wrap"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="客户名称" name="usnername" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="客户邮箱" name="email">
                <Input></Input>
            </Form.Item>

            <Form.Item label="客户电话" name="mobile" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="登陆密码" name="password">
                <Input.Password></Input.Password>
            </Form.Item>

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

            <Form.Item label="供应商添加上限" name="vendor_limit">
                <InputNumber  min={0}/>
            </Form.Item>

            <Form.Item label="状态" name="status">
                <Radio.Group>
                    <Radio value="n">禁用</Radio>
                    <Radio value="y">启用</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="管理品牌" name="brand">
                <Select mode="multiple" options={optionsBrand}></Select>
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                    <Button type="primary" htmlType='submit'>提交</Button>
                </Space>
            </Form.Item>


        </Form>
    )
}

export default AddSystem
