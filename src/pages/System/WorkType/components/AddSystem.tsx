import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { SelectProps } from "antd";
import { jobTypesAdd } from "@/services/ant-design-pro/system";
import { jobTypesEdit } from "@/services/ant-design-pro/system";

interface ItemListProps {
    handleClose: () => void
    actionRef
    success
    error
    type
    brandList
    currentMsg
}

const AddSystem: React.FC<ItemListProps> = ({
    type,
    brandList,
    handleClose,
    actionRef,
    success,
    error,
    currentMsg
}) => {

    const [form] = Form.useForm()
    const [departmentType, setDepartmentType] = useState('')

    const optionstype: SelectProps['options'] = type.map((item) => {
        return {
            value: item.value,
            label: item.label,
        };
    });
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
                brand_id: values.brand ?? '',
                job: values.job ?? '',
                typename: values.typename ?? '',
                typename_en: values.typename_en ?? '',
                department: values.department ?? '',
                shorter: values.shorter ?? '',
            }
            jobTypesAdd(params).then((res) => {
                console.log(res)
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
            brand_id: currentMsg.brand_id ?? '',
            typename: values.typename ?? '',
            typename_en: values.typename_en ?? '',
            department: values.department ?? '',
            shorter: values.shorter ?? '',
            created_at: currentMsg.created_at ?? '',
            updated_at: currentMsg.updated_at ?? '',
            boss: '',
            job: values.job ?? '',
            brand: currentMsg.brand ?? '',
            brand_en: currentMsg.brand_en ?? '',
            logo: currentMsg.logo ?? '',
            logo_path: currentMsg.logo_path ?? '',
            logo_deg: currentMsg.logo_deg ?? '',
            logo_preview_url: currentMsg.logo_preview_url ?? '',
            logo_url: currentMsg.logo_url ?? '',
        }
        jobTypesEdit(params).then((res) => {
            console.log(res)
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('修改成功')
                return
            }
            error(res.message)
        })
    }

    const handleChangeeDpartment = (e) => {
        setDepartmentType(e)
    }

    useEffect(() => {
        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            id: currentMsg.id ?? '',
            brand: currentMsg.brand ?? '',
            job: currentMsg.job ?? '',
            typename: currentMsg.typename ?? '',
            typename_en: currentMsg.typename_en ?? '',
            department: currentMsg.department ?? '',
            shorter: currentMsg.shorter ?? '',
        })
    })
    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            {
                !currentMsg &&
                <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                    <Select options={optionstype} onChange={handleChangeeDpartment}></Select>
                </Form.Item>
            }
            {
                currentMsg &&
                <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                    <Select options={optionstype} onChange={handleChangeeDpartment} disabled={true}></Select>
                </Form.Item>
            }

            {
                departmentType !== 'project' &&
                <Form.Item label="品牌" name="brand" >
                    <Select options={optionsBrand} ></Select>
                </Form.Item>

            }
            {
                currentMsg &&
                <Form.Item label="工作类型ID" name="id">
                    <Input readOnly/>
                </Form.Item>
            }
            {
                departmentType !== 'project' &&
                <Form.Item label="工作" name="job" >
                    <Radio.Group>
                        <Radio value='定期维护'>定期维护</Radio>
                        <Radio value='紧急维修'>紧急维修</Radio>
                        <Radio value='改造工程'>改造工程</Radio>
                    </Radio.Group>
                </Form.Item>
            }

            <Form.Item label="工作类型" name="typename" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="英文" name="typename_en">
                <Input />
            </Form.Item>
            <Form.Item label="编号" name="shorter">
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
export default AddSystem