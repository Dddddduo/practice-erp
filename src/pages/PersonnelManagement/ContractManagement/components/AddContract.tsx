import React, { useEffect, useState } from "react"
import { Form, Input, Space, Button, DatePicker, Select, message } from "antd"
import { createContractManagement, updateContractManageMent, departmentAll, userAll } from "@/services/ant-design-pro/system"
import dayjs from "dayjs";

interface ItemListProps {
    handleClose: () => void
    actionRef
    success,
    error
    currentMsg
}

const AddContract: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    currentMsg
}) => {

    const [form] = Form.useForm()

    const [department, setDepartment] = useState()

    const [use, setUse] = useState()

    const handleFinish = (values) => {
        let params = {
            number: values?.number ?? '',
            name: values?.name ?? '',
            department_id: parseInt(values?.department_name) || 0,
            department_head_id: parseInt(values?.department_head_name) || 0,
            company_a: values?.company_a ?? '',
            company_b: values?.company_b ?? '',
            company_c: values?.company_c ?? '',
            company_d: values?.company_d ?? '',
            start_date: values?.start_date ? values.start_date.format('YYYY-MM-DD') : null,
            end_date: values?.end_date ? values.end_date.format('YYYY-MM-DD') : null,
            price: values?.price ?? '',
            signing_date: values?.signing_date ? values.signing_date.format('YYYY-MM-DD') : null,
            notes: values?.notes ?? '',
            path: values?.path ?? '',
        }
        if (!currentMsg) {
            createContractManagement(params).then(res => {
                if (res.success) {
                    handleClose()
                    actionRef.current.reload()
                    message.success('添加成功')
                    return
                }
                message.error(res.message)

            })
        }
        updateContractManageMent(params, currentMsg.id).then(res => {
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                message.success('修改成功')
                return
            }
            message.error(res.message)
        })
    }

    const handleasset = (e) => {

        form.setFieldsValue({ department_head_name: undefined })

        userAll({ department_id: e }).then(res => {
            setUse(res.data.map((item: any) => {
                return {
                    value: item.id,
                    label: item.username,
                }
            }))
        })
    }

    useEffect(() => {
        console.log(currentMsg);
        departmentAll().then(res => {
            setDepartment(res.data.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            }))
        })

        if (currentMsg && currentMsg.department_id) {
            userAll({ department_id: currentMsg.department_id }).then(res => {
                setUse(res.data.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.username,
                    }
                }))
            })
        }

        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            number: currentMsg.number ?? '',
            name: currentMsg.name ?? '',
            department_name: currentMsg.department_id !== 0 ? currentMsg.department_id : '',
            department_head_name: currentMsg.department_head_id !== 0 ? currentMsg.department_head_id : undefined,
            company_a: currentMsg.company_a ?? '',
            company_b: currentMsg.company_b ?? '',
            company_c: currentMsg.company_c ?? '',
            company_d: currentMsg.company_d ?? '',
            start_date: dayjs(currentMsg.start_date, 'YYYY-MM-DD') ?? '',
            end_date: dayjs(currentMsg.end_date, 'YYYY-MM-DD') ?? '',
            price: currentMsg.price ?? '',
            signing_date: dayjs(currentMsg.signing_date, 'YYYY-MM-DD') ?? '',
            notes: currentMsg?.notes ?? '',
            path: currentMsg?.path ?? '',
        })


    }, [])

    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800 }}
            onFinish={handleFinish}
        >
            <Form.Item label='合同编号' name='number'>
                <Input />
            </Form.Item>

            <Form.Item label='合同名称' name='name'>
                <Input />
            </Form.Item>

            <Form.Item label='负责部门' name='department_name'>
                <Select options={department} onChange={handleasset} allowClear />
            </Form.Item>

            <Form.Item label='负责人' name='department_head_name'>
                <Select options={use} allowClear />
            </Form.Item>

            <Form.Item label='甲方公司' name='company_a'>
                <Input />
            </Form.Item>

            <Form.Item label='乙方公司' name='company_b'>
                <Input />
            </Form.Item>

            <Form.Item label='丙方公司' name='company_c'>
                <Input />
            </Form.Item>

            <Form.Item label='丁方公司' name='company_d'>
                <Input />
            </Form.Item>

            <Form.Item label='开始时间' name='start_date'>
                <DatePicker />
            </Form.Item>

            <Form.Item label='结束时间' name='end_date'>
                <DatePicker />
            </Form.Item>

            <Form.Item label='合同金额' name='price'>
                <Input />
            </Form.Item>

            <Form.Item label='合同签订日期' name='signing_date'>
                <DatePicker />
            </Form.Item>
            {/*  */}
            <Form.Item label='坚果云链接' name='path'>
                <Input />
            </Form.Item>

            <Form.Item label='备注' name='notes'>
                <Input.TextArea />
            </Form.Item>

            <Form.Item label=' ' colon={false}>
                <Space>
                    <Button type="primary" htmlType='submit'>提交</Button>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default AddContract