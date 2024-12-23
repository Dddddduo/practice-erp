import { Button, Form, Input, Space } from "antd";
import { useIntl, FormattedMessage } from "@umijs/max"
import React, { useEffect } from "react"
import dayjs from "dayjs";

interface ItemListProps {
    currentMsg: any
}

const Detail: React.FC<ItemListProps> = ({
    currentMsg
}) => {

    const intl = useIntl()
    const [form] = Form.useForm()

    useEffect(() => {

        form.setFieldsValue({
            id: currentMsg.id ?? '',
            number: currentMsg.number ?? '',
            name: currentMsg.name ?? '',
            department_name: currentMsg.department_name ?? '',
            department_head_name: currentMsg?.department_head_name ?? '',
            company_a: currentMsg.company_a ?? '',
            company_b: currentMsg.company_b ?? '',
            company_c: currentMsg.company_c ?? '',
            company_d: currentMsg.company_d ?? '',
            start_date: currentMsg.start_date ?? '',
            end_date: currentMsg.end_date ?? '',
            price: currentMsg.price ?? '',
            signing_date: currentMsg.signing_date ?? '',
            notes: currentMsg?.notes ?? '',
        })
    }, [])

    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 15 }}
            style={{ maxWidth: 600 }}
        >

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.id',
                    defaultMessage: '序号'
                })
            } name="id">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.number',
                    defaultMessage: '合同编号'
                })
            } name="number">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.name',
                    defaultMessage: '合同名称'
                })
            } name="name">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.department_name',
                    defaultMessage: '负责部门'
                })
            } name="department_name">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.department_head_name',
                    defaultMessage: '负责人'
                })
            } name="department_head_name">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.company_a',
                    defaultMessage: '甲方公司'
                })
            } name="company_a">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.company_b',
                    defaultMessage: '乙方公司'
                })
            } name="company_b">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.company_c',
                    defaultMessage: '丙方公司'
                })
            } name="company_c">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.company_d',
                    defaultMessage: '丁方公司'
                })
            } name="company_d">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.start_date',
                    defaultMessage: '合同开始日期'
                })
            } name="start_date">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.end_date',
                    defaultMessage: '合同结束日期'
                })
            } name="end_date">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.price',
                    defaultMessage: '合同金额'
                })
            } name="price">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.signing_date',
                    defaultMessage: '合同签订日期'
                })
            } name="signing_date">
                <Input bordered={false} readOnly />
            </Form.Item>

            <Form.Item label={
                intl.formatMessage({
                    id: 'contractManagement.field.notes',
                    defaultMessage: '备注'
                })
            } name="notes">
                <Input.TextArea bordered={false} readOnly />
            </Form.Item>

        </Form>
    )
}
export default Detail