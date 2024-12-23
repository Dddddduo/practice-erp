import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space, Switch, Cascader } from 'antd';
import { CategoryAll } from "@/services/ant-design-pro/system";
import { SelectProps } from "antd/lib";
import { categoryAdd } from "@/services/ant-design-pro/system";


interface ItemListProps {
    handleClose: () => void
    actionRef
    success,
    error,
    currentMsg
    category
}

const AddSystem: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    currentMsg,
    category
}) => {

    const [form] = Form.useForm()
    // 状态
    const [switchValue, setSwitchValue]: any = useState(0)
    // 上级类别
    // const [category, setCategory] = useState([])

    const handleFinish = (values,currentMsg) =>{
        console.log(values)
        const params = {
            cn_name:values.cn_name ?? '',
            en_name:values.en_name ?? '',
            no:values.no ?? '',
            status:switchValue ?? '',
            remark:values.remark ?? '',
            pid: values.level[values.level.length - 1] ?? '',
            id:0,
            level:0,
        }
        categoryAdd(params).then((res) => {
            // console.log(res)
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('添加成功')
                return
            }
            error(res.message)
        })
        console.log(params)
    }

    const handleChange = (e) => {
        setSwitchValue(e ? 1 : 0)
    }

    
    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="上级类别" name="level">
                <Cascader 
                    options={category}
                    expandTrigger="hover"
                    changeOnSelect
                />
            </Form.Item>
            <Form.Item label="类别编码" name="no" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="中文" name="cn_name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="英文" name="en_name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="是否立即启用" name="status">
                <Switch onChange={handleChange} />
            </Form.Item>
            <Form.Item label="备注" name="remark">
                <Input.TextArea />
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