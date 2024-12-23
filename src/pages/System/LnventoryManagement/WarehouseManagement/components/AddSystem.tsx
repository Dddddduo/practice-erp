import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space} from 'antd';
import ItemList from "./ItemList";
import { AddWarehouses } from "@/services/ant-design-pro/system";
import dayjs from "dayjs";


interface ItemListProps {
    handleClose: () => void,
    actionRef,
    currentMsg
    success: (text: string) => void
    error: (text: string) => void
}


const AddSystem: React.FC<ItemListProps> = ({
    actionRef,
    currentMsg,
    handleClose,
    success,
    error
}) =>{

    const [form] = Form.useForm()
    const handleFinish = (values) =>{
        let params
        console.log(currentMsg)
        if (currentMsg){
            params = {
                cn_name:values.cn_name ?? '',
                created_at: dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD HH:mm:ss') ?? '',
                en_name:values.en_name ?? '',
                id:currentMsg.id ?? '',
                images:[],
                remark:values.remark ?? '',
            }
        }else{
            params = {
                cn_name:values.cn_name,
                en_name:values.en_name,
                id:0,
                remark:values.remark ,
                images:[],
            }
            console.log(values)
        }
        

        AddWarehouses(params).then((res) => {
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
        console.log(currentMsg);
        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            cn_name: currentMsg?.cn_name ?? '',
            en_name: currentMsg?.en_name ?? '',
            remark:currentMsg?.remark ?? '',
        })
    }, [currentMsg])



    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="中文名称" name="cn_name">
                <Input />
            </Form.Item>
            <Form.Item label="英文名称" name="en_name">
                <Input />
            </Form.Item>
            <Form.Item label="描述" name="remark">
                <Input.TextArea />
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