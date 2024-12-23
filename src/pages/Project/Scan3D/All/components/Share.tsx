import React, { useState } from "react"
import { Typography, Form, Radio, Space, Button, Input, message } from 'antd'
import { createShareLink } from "@/services/ant-design-pro/project"
import copy from "copy-to-clipboard";

interface ItemListProps {
  scanId: number,
  onCloseShareModel: () => void
}
/**
 * 3DScan 组件分享按钮
 * @constructor
 */
const Share: React.FC<ItemListProps> = ({
  scanId,
  onCloseShareModel
}) => {

  const [form] = Form.useForm();
  const [date, setDate] = useState(1);
  const [link, setLink] = useState('')
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();

  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  const onChange = (e) => {
    console.log(scanId, e.target.value);
    setDate(e.target.value)
  }

  const createShareSrc = async () => {
    const params = {
      source_id: scanId,
      expire_day: date
    }
    const res = await createShareLink(params)
    if (!res.success) {
      error(res.msg)
      return
    }
    setLink(res.data.url)
  }

  const onCopy = () => {
    if (!link) {
      error("请先获取链接！")
      return
    }
    copy(link);
    success('复制成功')
  }

  return (
    <>
      {contextHolder}
      <Typography.Title level={3}>分享链接</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600,height: 200, marginTop: 50, position: "relative" }}
        onFinish={createShareSrc}
      >
        <Form.Item label="有效期">
          <Radio.Group onChange={onChange} value={date}>
            <Radio value={1}>1天</Radio>
            <Radio value={7}>7天</Radio>
            <Radio value={30}>30天</Radio>
            <Radio value={0}>永久有效</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="分享链接" className="linkForm">
          <Input disabled value={link}/>
          <Button type="primary" className="copy" onClick={onCopy}>复制</Button>
        </Form.Item>

        <Form.Item style={{position: "absolute", right: -100, bottom: 0}}>
          <Space>
            <Button type="primary" htmlType="submit">
              获取链接
            </Button>
            <Button onClick={onCloseShareModel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default Share
