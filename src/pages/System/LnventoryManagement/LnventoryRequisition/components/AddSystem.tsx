import ItemList from "./ItemList"
import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, DatePicker, Space } from 'antd';
import { operate, apply} from "@/services/ant-design-pro/system";
import type { SelectProps} from 'antd';
import { factorialDependencies } from "mathjs";
import dayjs from "dayjs";
interface ItemListProps {
    brandList: any
    category: any
    warehouse:any,
    handleClose: () => void,
    actionRef:any
    success: (text: string) => void
    error: (text: string) => void
}




const AddSystem: React.FC<ItemListProps> = ({
    brandList,
    category,
    warehouse,
    handleClose,
    actionRef,
    success,
    error
}) => {
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm()
    const [num, setNum]: number = useState()
    let id, warehouse_id

    const handleFinish = (values) => {
        if(values.created) {
            values.start = dayjs(values.created[0].$d).format('YYYY-MM-DD HH:mm:ss')
            values.end = dayjs(values.created[1].$d).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(values);
        const params ={
            category_id:values.category ?? '',
            remark:values.remark ?? '',
            start:values.start ?? '',
            end:values.end ?? '',
            num:values.num ?? '',
            warehouse_id:values.warehouse ?? '',

        }   
        console.log(params);
        apply(params).then((res) => {
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

    const optionscategory: SelectProps['options'] = category.map((item) => {
        return {
            value: item.id,
            label: item.cn_name,
        };
    });
    const optionswarehouse: SelectProps['options'] = warehouse.map((item) => {
        return {
            value: item.id,
            label: item.cn_name,
        };
    });

    const handleChange = (e, type) => {
        if (type === 'category') {
            id = e
        }
        if (type === 'warehouse') {
            warehouse_id = e
        }
        const params = {
            id, warehouse_id
        }
        console.log(params);
        operate(params).then(res => {
            console.log(res);
            if (res.success) {
                if (res.data.length < 1) {
                    setNum(0)
                    return
                }
                setNum(res.data.total_num)
            }
        })
    }

    useEffect(() => {
        form.setFieldsValue({
            total_num: num
        })
    }, [num])

    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="选择产品" name="category">
                <Select options={optionscategory} onChange={(e) => handleChange(e, 'category')}></Select>
            </Form.Item>
            <Form.Item label="使用时间" name="created">
                <RangePicker/>
            </Form.Item>
            {/* options={optionswarehouse} */}
            <Form.Item label="选择仓库" name="warehouse">
                <Select options={optionswarehouse} onChange={(e) => handleChange(e, 'warehouse')}></Select>
            </Form.Item>
            <Form.Item label="操作数量" name="num">
            <InputNumber min={0}/>
            </Form.Item>
            {/* total_num */}
            <Form.Item label="数量" name="total_num">
                <Input readOnly bordered={false} />
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