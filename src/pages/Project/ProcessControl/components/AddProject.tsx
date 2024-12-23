import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { createOrUpdateProject } from '@/services/ant-design-pro/report';

const type = [
    {
        value: '电气',
        label: '电气'
    },
    {
        value: 'AC',
        label: 'AC'
    },
    {
        value: 'LED',
        label: 'LED'
    }
]

interface ItemListProps {
    handleClose: () => void
    currentMsg: any
    brandList: any
    actionRef
    success: (text: string) => void
    error: (text: string) => void
}

const AddProject: React.FC<ItemListProps> = ({
    handleClose,
    currentMsg,
    brandList,
    actionRef,
    success,
    error
}) => {

    const [form] = Form.useForm()
    const handleFinsh = (values,) =>{
        console.log(values)
        const customParams ={
            brand_id:values['brand_en'] ?? '',
            project_no:values['project_no'] ?? '',
            project_type:values['project_type'] ?? ''
        };
        // console.log(customParams)


          createOrUpdateProject(customParams).then((res)=>{
            console.log(res)
            if(res.success){
                handleClose()
                actionRef.current.reload()
                success('处理成功')
                return
                // console.log(actionRef)
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
            project_no: currentMsg.project_no ?? '',
            project_type: currentMsg.project_type ?? '',
            brand_en: {
                value: currentMsg.brand_id ?? '',
                label: currentMsg.brand_en ?? '',
                


            } ?? {}
        })
    }, [currentMsg])

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={handleFinsh}
        >
            <Form.Item label="编号" name="project_no">
                <Input></Input>
            </Form.Item>
            <Form.Item label="类型" name="project_type">
                <Select placeholder="请选择类型" options={type} />
            </Form.Item>
            <Form.Item label="品牌" name="brand_en">
                <Select placeholder="请选择类型" options={optionsBrand}/>
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

export default AddProject