import React, { useEffect, useState } from "react"
import { Button, Form, Input, Select, InputNumber, Radio, Space } from 'antd';
import ItemList from "./ItemList";
import type { SelectProps } from 'antd';
import { createOrUpdate } from "@/services/ant-design-pro/system";
import { getStoreUserInfo } from "@/services/ant-design-pro/system";

import FormItem from "antd/lib/form/FormItem";
import dayjs from "dayjs";
// 店铺
import { getShopList } from "@/services/ant-design-pro/report";


interface ItemListProps {
    brandList: any
    cityList: any
    currentMsg: any
    handleClose: () => void
    actionRef
    success: (text: string) => void
    error: (text: string) => void
}
const AddSystem: React.FC<ItemListProps> = ({
    brandList,
    cityList,
    currentMsg,
    handleClose,
    actionRef,
    success,
    error
}) => {



    const [form] = Form.useForm()
    const [cityId, setCityId]: any = useState()
    const [brandId, setBrandId]: any = useState()

    // 店铺
    const [shopList, setShopList]: any = useState([])
    const optionsBrand: SelectProps['options'] = brandList.map((item) => {
        return {
            value: item.id,
            label: item.brand_en,
        };
    });
    const optionsCiry: SelectProps['options'] = cityList.map((item) => {
        return {
            value: item.id,
            label: item.city_cn,
        };
    });
    const optionsShop: SelectProps['options'] = shopList.map((item) => {
        return {
            value: item.id,
            label: item.name_cn,
        };
    });


    const handleFinish = (values) => {
        console.log(values);
        console.log(currentMsg);
        let brand_list: any = []
        values.shop.map(id => {
            shopList.map(item => {
                if (id === item.name_cn || id === item.id) {
                    brand_list.push(item)
                }
                // if (typeof id === 'number') {
                //     if (id === item.id) {
                //         brand_list.push(item)
                //     }
                // }
                
            })
        })
        // currentMsg.store_list.map(item => item.store_id).map(item => {

        // })
        

        let params
        if (currentMsg) {
            params = {
                account: values.account ?? '',
                brand_id: values.brand ?? '',
                brand_list: brand_list ?? '',
                city_id: values.city ?? '',
                created_at: dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD HH:mm:ss') ?? '',
                email: values.email ?? '',
                mobile: values.mobile ?? '',
                shop_id: brand_list.map(item => item.id) ?? '',
                status: values.status ?? '',
                status_cn: '账户可用',
                store_ids: brand_list.map(item => item.id).join(',') ?? '',
                store_uid: currentMsg?.store_uid ?? '',
                username: values.username ?? ''
            }
        } else {
            params = {
                account: values.account ?? '',
                brand_id: values.brand ?? '',
                city_id: values.city ?? '',
                email: values.email ?? '',
                mobile: values.mobile ?? '',
                password: values.password ?? '',
                re_password: values.re_password ?? '',
                store_ids: values.shop.join(',') ?? '',
                status: values.status ?? '',
                username: values.username ?? '',

            }
        }
        console.log(params);

        createOrUpdate(params).then((res) => {
            // console.log(res)
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('处理成功')
                return
            }
            error(res.message)
        })

    }
    const handleChangeBrand = (e) => {
        setBrandId(e)
        form.setFieldsValue({ shop: undefined })
        getShopList({ brand_id: e, city_id: cityId }).then(res => {
            setShopList(res.data)
            // console.log(res.data)
        })
    }
    const handleChangeCity = (e) => {
        setCityId(e)
        form.setFieldsValue({ shop: undefined })
        getShopList({ brand_id: brandId, city_id: e }).then(res => {
            setShopList(res.data)
            // console.log(res.data)
        })
    }

    useEffect(() => {
        console.log(currentMsg);
        if (!currentMsg) {
            return
        }

        console.log(currentMsg.store_uid)
        getStoreUserInfo({ store_uid: currentMsg.store_uid }).then(res => {
            console.log(res.data);
            form.setFieldsValue({
                username: currentMsg?.usnername ?? '',
                email: currentMsg?.email ?? '',
                mobile: currentMsg?.mobile ?? '',
                status: currentMsg?.status ?? 'n',
                shop: currentMsg.store_list.map(item => item.store_cn),
                brand: res.data.brand_list[0].brand_id ?? '',
                city: res.data.brand_list[0].city_id ?? '',
                account: res.data.account ?? '',
            })
            if (res.data.brand_list[0].city_id || currentMsg?.store_list[0].brand_id) {
                getShopList({ brand_id: currentMsg?.store_list[0].brand_id, city_id: res.data.brand_list[0].city_id }).then(res => {
                    setShopList(res.data)
                })
            }
        })
    }, [])

    return (
        <Form
            // name="wrap"
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="品牌" name="brand" rules={[{ required: true }]}>
                <Select options={optionsBrand} onChange={handleChangeBrand} allowClear></Select>
            </Form.Item>

            <Form.Item label="城市" name="city" rules={[{ required: true }]}>
                <Select options={optionsCiry} onChange={handleChangeCity} allowClear></Select>
            </Form.Item>

            <Form.Item label="店铺" name="shop" rules={[{ required: true }]}>
                <Select mode="multiple" options={optionsShop} allowClear></Select>
            </Form.Item>

            <Form.Item label="姓名" name="username">
                <Input />
            </Form.Item>

            <Form.Item label="登录账号" name="account" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="登陆密码" name="password">
                <Input.Password></Input.Password>
            </Form.Item>

            <Form.Item label="登陆确认密码" name="re_password" rules={[
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

            <Form.Item label="手机号" name="mobile" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="n">禁用</Radio>
                    <Radio value="y">启用</Radio>
                </Radio.Group>
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