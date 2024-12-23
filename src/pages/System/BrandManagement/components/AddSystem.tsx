import React, {useEffect, useState} from "react"
import {Button, Form, Input, Select, InputNumber, Radio, Space} from 'antd';
import GkUpload from "@/components/UploadImage/GkUpload";
import {getInitData} from "@/services/ant-design-pro/project";
import type {SelectProps} from 'antd';
import {isEmpty} from "lodash";
import UploadFiles from "@/components/UploadFiles";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {brandsAdd, brandsEdit} from "@/services/ant-design-pro/system";

interface ItemListProps {
  handleClose: () => void
  actionRef
  success
  error,
  currentMsg
}

const AddSystem: React.FC<ItemListProps> = ({
                                              handleClose,
                                              actionRef,
                                              success,
                                              error,
                                              currentMsg
                                            }) => {

  const [form] = Form.useForm()

  const [initData, setInitData] = useState()

  const handleFinish = (values) => {
    let params = {
      brandname: values.brandname ?? '',
      brandname_en: values.brandname_en ?? '',
      brand: values.brand ?? '',
      brand_en_all: values.brand_en_all ?? '',
      brand_en: values.brand_en ?? '',
      address: values.address ?? '',
      address_en: values.address_en ?? '',
      invoice_info: values.invoice_info ?? '',
      manager_id: values.manager_id ?? '',
      administrative_cost_rate: values.administrative_cost_rate ?? '',
      profit_rate_warn: values.profit_rate_warn ?? '',
      logo: values.logo ?? '',
      contacts: values.contacts ?? [],
    }
    if (isEmpty(currentMsg)) {
      brandsAdd(params).then(res => {
        if (res.success) {
          handleClose()
          actionRef.current.reload()
          success('添加成功')
          return
        }
        error(res.message)
      })
      return
    }
    brandsEdit({...params, id: currentMsg.id}).then(res => {
      if (res.success) {
        handleClose()
        actionRef.current.reload()
        success('修改成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      contacts: [{
        contact_user: '',
        contact_tel: ''
      }]
    })
    getInitData().then(res => {
      if (res.success) {
        setInitData(res.data.users.map(item => {
          return {
            value: item.user_id,
            label: item.username
          }
        }))
      }
    })
    if (isEmpty(currentMsg)) {
      return
    }
    form.setFieldsValue({
      brand_id: currentMsg.id ?? '',
      brandname: currentMsg.brandname ?? '',
      brandname_en: currentMsg.brandname_en ?? '',
      brand: currentMsg.brand ?? '',
      brand_en_all: currentMsg.brand_en_all ?? '',
      brand_en: currentMsg.brand_en ?? '',
      address: currentMsg.address ?? '',
      address_en: currentMsg.address_en ?? '',
      invoice_info: currentMsg.invoice_info ?? '',
      manager_id: currentMsg.manager_id ?? '',
      administrative_cost_rate: currentMsg.administrative_cost_rate ?? '',
      profit_rate_warn: currentMsg.profit_rate_warn ?? '',
      logo: currentMsg.logo ?? '',
      contacts: currentMsg.contacts ?? [{contact_user: '', contact_tel: ''}]
    })
  }, [])

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      labelCol={{span: 4}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 800}}
    >
      {
        !isEmpty(currentMsg) &&
        <Form.Item label="品牌ID" name="brand_id">
          <Input readOnly disabled/>
        </Form.Item>
      }
      <Form.Item label="品牌全称" name="brandname">
        <Input/>
      </Form.Item>
      <Form.Item label="英文" name="brandname_en">
        <Input/>
      </Form.Item>
      <Form.Item label="品牌简称" name="brand">
        <Input/>
      </Form.Item>
      <Form.Item label="品牌英文" name="brand_en_all" rules={[{required: true}]}>
        <Input/>
      </Form.Item>
      <Form.Item label="英文缩写" name="brand_en" rules={[{required: true}]}>
        <Input/>
      </Form.Item>
      <Form.Item label="地址" name="address">
        <Input/>
      </Form.Item>
      <Form.Item label="地址英文" name="address_en">
        <Input/>
      </Form.Item>
      <Form.Item label="开票信息" name="invoice_info">
        <Input.TextArea/>
      </Form.Item>
      <Form.Item label="负责人" name="manager_id">
        <Select options={initData} showSearch filterOption={filterOption}></Select>
      </Form.Item>
      <Form.Item label="服务费" name="administrative_cost_rate">
        <InputNumber addonAfter="%"/>
      </Form.Item>
      <Form.Item label="利润率" name="profit_rate_warn">
        <InputNumber addonAfter="%"/>
      </Form.Item>
      <Form.Item label="上传图片" name="logo">
        <UploadFiles fileLength={1}/>
      </Form.Item>

      <Form.Item label="联系人">
        <Form.List name="contacts">
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (
                <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'contact_user']}
                  >
                    <Input placeholder="联系人"/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'contact_tel']}
                  >
                    <Input placeholder="联系电话"/>
                  </Form.Item>
                  <Space>
                    <PlusCircleOutlined style={{fontSize: 22}}
                                        onClick={() => add({contact_user: '', contact_tel: ''}, name + 1)}/>
                    {
                      name !== 0 &&
                      <MinusCircleOutlined style={{fontSize: 22}} onClick={() => remove(name)}/>
                    }
                  </Space>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
        </Space>
      </Form.Item>
    </Form>
  )
}
export default AddSystem
