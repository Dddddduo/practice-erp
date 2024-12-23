import {Button, Form, Input, Space} from 'antd';
import React, {useEffect, useState} from "react";
import {companies, companiesedit, getFileUrlById} from "@/services/ant-design-pro/system";
import UploadFiles from "@/components/UploadFiles";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {getFileUrlListByIds} from "@/services/ant-design-pro/api";
import GkUpload from "@/components/UploadImage/GkUpload";


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

  const handleFinish = (values) => {
    let param
    console.log(values, currentMsg)
    if (!currentMsg) {
      param = {
        en: values.en ?? '',
        cn: values.cn ?? '',
        logo_id: values.logo ? values.logo[0]?.id : '',
        logo_url: values.logo ? values.logo[0]?.response?.url : '',
        logo_name: values.logo ? values.logo[0]?.name : '',
      }
      companies(param).then((res) => {
        console.log(res)
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
    param = {
      id: values.id ?? '',
      en: values.en ?? '',
      shorter: currentMsg.shorter ?? '',
      bank_name: currentMsg.bank_name ?? '',
      bank_no: currentMsg.bank_no ?? '',
      cn: values.cn ?? '',
      tax_rate: currentMsg.tax_rate ?? '',
      oss_path: currentMsg.oss_path ?? '',
      deg: currentMsg.deg ?? '',
      logo_preview_url: currentMsg.logo_preview_url ?? '',
      logo_id: values.logo ? values.logo[0]?.id : '',
      logo_url: values.logo ? values.logo[0]?.response?.url : '',
      logo_name: values.logo ? values.logo[0]?.name : '',
    }
    companiesedit(param).then(res => {
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
    if (!currentMsg) {
      return
    }
    form.setFieldsValue({
      id: currentMsg.id ?? '',
      en: currentMsg.en ?? '',
      cn: currentMsg.cn ?? '',
      logo: (currentMsg?.logo_id && currentMsg?.logo_url) ? [{
        url: currentMsg?.logo_url,
        id: currentMsg?.logo_id
      }] : []
    })
  })

  return (
    <Form
      form={form}
      labelCol={{span: 4}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 600, marginTop: 30}}
      onFinish={handleFinish}
    >
      {
        currentMsg &&
        <Form.Item label="公司ID" name="id">
          <Input readOnly/>
        </Form.Item>
      }
      <Form.Item label="公司中文名" name="en" rules={[{required: true}]}>
        <Input/>
      </Form.Item>

      <Form.Item label="公司全称" name="cn">
        <Input/>
      </Form.Item>

      <Form.Item label="公司Logo" name="logo">
        <GkUpload fileLength={1} />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
          <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
export default AddSystem
