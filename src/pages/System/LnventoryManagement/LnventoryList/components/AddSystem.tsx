import ItemList from "./ItemList"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import { categoryAll, warehouseAll } from "@/services/ant-design-pro/system";
import type { SelectProps } from 'antd';
import { useState, useEffect } from "react";
import { operate, } from "@/services/ant-design-pro/system";
import { enter, ex } from "@/services/ant-design-pro/system";

interface ItemListProps {

    handleClose: () => void,
    currentMsg
    actionRef
    success: (text: string) => void
    error: (text: string) => void
}


const AddSystem: React.FC<ItemListProps> = ({
    handleClose,
    currentMsg,
    actionRef,
    success,
    error

}) => {

    const [form] = Form.useForm()
    const [category, setCategory]: any = useState([])
    const [warehouse, setWarehouse]: any = useState([])
    let id, warehouse_id
    const [num, setNum]: number = useState()

    const [type, setType]: any = useState('n')

    const handleFinish = (values) => {
        let params
        console.log(currentMsg)
        if (!currentMsg) {
            params = {
                category_id: values.category ?? '',
                num: values.num ?? '',
                op_mobile: values.op_mobile ?? '',
                warehouse_id: values.warehouse ?? '',
                remark: values.remark ?? '',
                op_name: values.op_name ?? '',
            }
        } else {
            params = {
                category_id: currentMsg.category_id ?? '',
                num: values.num ?? '',
                op_mobile: values.op_mobile ?? '',
                warehouse_id: currentMsg.warehouse_id ?? '',
                remark: values.remark ?? '',
                op_name: values.op_name ?? '',
            }
            console.log(values)
        }

        if (type === 'n') {
            enter(params).then((res) => {
                console.log(res)
                if (res.success) {
                    handleClose()
                    actionRef.current.reload()
                    success('处理成功')
                    return
                }
                error(res.message)
            })
            return
        }
        ex(params).then((res) => {
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

    const changeType = (e) => {
        console.log(e.target.value)
        setType(e.target.value)
    }

    useEffect(() => {
        console.log(currentMsg);

        categoryAll().then(res => {
            setCategory(res.data)
        })
        warehouseAll().then(res => {
            setWarehouse(res.data)
        })

        form.setFieldsValue({
            total_num: num,
        })

        if (!currentMsg) {
            return
        }
        form.setFieldsValue({
            status: 'n',
            no: currentMsg?.category.no ?? '',
            cn_name: currentMsg?.category.cn_name ?? '',
            en_name: currentMsg?.category.en_name ?? '',
            total_num: currentMsg?.total_num ?? '',
            // category: currentMsg?.category_id ?? '',
            // warehouse: currentMsg?.warehouse_id ?? '',
            // op_mobile: currentMsg?.op_mobile ?? '',
            // remark: currentMsg?.remark ?? '',
            // op_name: currentMsg?.op_name ?? '',
        })

    }, [currentMsg, num])


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



    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}

            onFinish={handleFinish}
        >
            {
                currentMsg &&
                <Form.Item label="产品编码" name="no" rules={[{ required: true }]}>
                    <Input readOnly bordered={false} />
                </Form.Item>
            }
            {
                currentMsg &&
                <Form.Item label="中文名称" name="cn_name" rules={[{ required: true }]}>
                    <Input readOnly bordered={false} />
                </Form.Item>
            }
            {
                currentMsg &&
                <Form.Item label="英文名称" name="en_name" rules={[{ required: true }]}>
                    <Input readOnly bordered={false} />
                </Form.Item>
            }
            {
                !currentMsg &&
                <Form.Item label="选择产品" name="category">
                    <Select options={optionscategory} onChange={(e) => handleChange(e, 'category')}></Select>
                </Form.Item>
            }
            {
                currentMsg &&
                <Form.Item label="库存数量" name="total_num">
                    <Input readOnly bordered={false} />
                </Form.Item>
            }
            <Form.Item label="操作类型" name="status">
                <Radio.Group onChange={changeType}>
                    <Radio value="n">入库</Radio>
                    <Radio value="y">出库</Radio>
                </Radio.Group>
            </Form.Item>
            {
                !currentMsg &&
                <Form.Item label="选择仓库" name="warehouse">
                    <Select options={optionswarehouse} onChange={(e) => handleChange(e, 'warehouse')}></Select>
                </Form.Item>
            }


            <Form.Item label="操作数量" name="num">
                <InputNumber min={0} />
            </Form.Item>

            {
                type === 'n' ?
                    <Form.Item label="采购方" name="op_name">
                        <Input />
                    </Form.Item> :
                    <Form.Item label="供应商" name="op_name">
                        <Input />
                    </Form.Item>
            }


            <Form.Item label="联系方式" name="op_mobile">
                <Input />
            </Form.Item>
            {
                !currentMsg &&
                <Form.Item label="库存数量" name="total_num">
                    <Input readOnly bordered={false} />
                </Form.Item>
            }
            <Form.Item label="备注" name="remark">
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Space style={{ marginLeft: 200 }}>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                    <Button type="primary" htmlType='submit'>提交</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default AddSystem