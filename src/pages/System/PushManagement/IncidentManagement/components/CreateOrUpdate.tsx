import React, { useEffect, RefObject, useState } from "react";
import type { SelectProps } from 'antd';
import { Button, DatePicker, Form, Input, Select, Space, Switch, Typography } from 'antd';
import { addIncident, updateIncident } from "@/services/ant-design-pro/pushManagement";
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { isUndefined } from "lodash";
import { getBrandList, getShopList } from "@/services/ant-design-pro/report";

interface ItemListProps {
  currentMsg
  actionRef: RefObject<ActionType>;
  onDrawerStateClean: () => void
  events
  methods
  success: (text: string) => void
  error: (text: string) => void
}

const CreateOrUpdate: React.FC<ItemListProps> = ({
  currentMsg,
  actionRef,
  onDrawerStateClean,
  events,
  methods,
  success,
  error
}) => {
  const [form] = Form.useForm();

  const [brands, setBrands]: any = useState([])
  const [shops, setShops]: any = useState([])

  const handleFinish = async (values) => {
    console.log(values);
    const params = {
      id: currentMsg ? currentMsg.id : '',
      name: values.name,
      type: values.type.value ?? values.type,
      method: values.method.value ?? values.method,
      shop_id: values.shop.value ?? values.shop
    }
    if (isUndefined(currentMsg)) {
      const res = await addIncident(params)
      if (res.success) {
        onDrawerStateClean()
        actionRef.current?.reload()
        success('添加成功')
        return
      }
      error(res.message)
      return
    }
    const res = await updateIncident(params)
    if (res.success) {
      onDrawerStateClean()
      actionRef.current?.reload()
      success('修改成功')
      return
    }
    error(res.message)
  }



  const getBrands = async () => {
    const { data } = await getBrandList()
    const result = Object.keys(data).map(key => data[key])
    setBrands(result)
  }

  const handleChangeBrand = (id) => {
    getShop(id)
  }

  const getShop = async (id) => {
    const { data } = await getShopList({ brand_id: id })
    setShops(data)
  }

  const optionsEvents: SelectProps['options'] = events.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })

  const optionsMethods: SelectProps['options'] = methods.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })

  const optionsBrands: SelectProps['options'] = brands.map((item) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const optionsShops: SelectProps['options'] = shops.map((item) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  useEffect(() => {
    const getSelectList = async () => {
      await getBrands()
    }
    getSelectList()
    form.setFieldsValue({
      name: currentMsg?.name ?? '',
      type: {
        value: currentMsg?.type.id,
        label: currentMsg?.type.name
      } ?? {},
      method: {
        value: currentMsg?.method.id,
        label: currentMsg?.method.name
      } ?? {},
      shop: {
        value: currentMsg?.shop.id,
        label: currentMsg?.shop.name
      } ?? {},
    })
  }, [currentMsg])
  return (
    <>
      <Typography.Title level={2}>{currentMsg ? '修改' : '新建'}</Typography.Title>
      <Form
        // actionRef={actionRef}
        form={form}
        name="user_id"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >

        <Form.Item
          label="名称"
          name="name"
        >
          <Input placeholder="请输入名称" />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
        >
          <Select placeholder="请选择类型" allowClear options={optionsEvents} />
        </Form.Item>

        <Form.Item
          label="推送方式"
          name="method"
        >
          <Select placeholder="请选择方式" allowClear options={optionsMethods} />
        </Form.Item>

        <Form.Item
          label="品牌"
          name="brand"
        >
          <Select placeholder="请选择品牌" allowClear options={optionsBrands} onChange={handleChangeBrand} />
        </Form.Item>

        <Form.Item
          label="店铺"
          name="shop"
        >
          <Select placeholder="请选择店铺" allowClear options={optionsShops} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button onClick={onDrawerStateClean}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateOrUpdate
