import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space} from 'antd';
import type { SelectProps } from 'antd';
import { postCategory } from "@/services/ant-design-pro/system";
import { Switch } from 'antd';
import GkUpload from "@/components/UploadImage/GkUpload";
interface ItemListProps {
    brandList:any,
    handleClose: () => void
    actionRef
    success: (text: string) => void
    error: (text: string) => void
}


const AddSystem: React.FC<ItemListProps> = ({
    brandList,
    handleClose,
    actionRef,
    success,
    error
}) => {

    const [switchValue, setSwitchValue]: any = useState(0)

    const handleFinish = (values) =>{
        console.log(values);
        
        const params ={
            id: 0,
            no: values.no ? values.no : undefined,
            cn_name: values.cn_name ?? '',
            en_name:values.en_name ?? '',
            status:switchValue ?? '',
            brand_id: values.brand ?? '',
            unit:values.unit ?? '',
            images:values.image ?? '',
            imagesList:values.image ?? '',
            remark:values.image ?? ''
        }
        console.log(params);
        
        postCategory(params).then((res) => {
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

    const handleChange = (e) => {
        setSwitchValue(e ? 1 : 0)
    }


    return (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="产品编码" name="no">
                <Input />
            </Form.Item>
            <Form.Item label="产品名称" name="cn_name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="英文名称" name="en_name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="是否立即启用" name="status">
                <Switch onChange={handleChange}/>
            </Form.Item>
            <Form.Item label="所属品牌" name="brand" >
                <Select options={optionsBrand} allowClear></Select>
            </Form.Item>
            <Form.Item label="计量单位" name="unit">
                <Input />
            </Form.Item>
            <Form.Item label="图片" name="Image">
                <GkUpload />
            </Form.Item>
            <Form.Item label="备注" name="remark">
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