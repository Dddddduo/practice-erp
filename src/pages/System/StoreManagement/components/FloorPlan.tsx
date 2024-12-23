import GkUpload from "@/components/UploadImage/GkUploadComm"
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space } from "antd"
import React, { useEffect } from "react"
import { floorPlansByShop, floorPlansCreate } from "@/services/ant-design-pro/system"
import { isEmpty } from "lodash"
import UploadFiles from "@/components/UploadFiles"

interface Props {
  handleClosePlan: () => void
  actionRef: any
  currentItem: any
  success: (text: string) => void
  error: (text: string) => void
}

const FloorPlan: React.FC<Props> = ({
  handleClosePlan,
  actionRef,
  currentItem,
  success,
  error,
}) => {
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    values.floor_img = values.floor_img.map(item => {
      item.image_file_ids = item.image_file_ids ? item.image_file_ids : ''
      item.title = item.title ? item.title : ''
      item.description = item.description ? item.description : ''
      return item
    })

    const params = {
      floor_plans: values.floor_img
    }
    console.log(params);
    floorPlansCreate(params, currentItem.id).then(res => {
      if (res.success) {
        handleClosePlan()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    floorPlansByShop(currentItem.id).then(res => {
      if (res.success && !isEmpty(res.data)) {
        form.setFieldsValue({
          floor_img: res.data
        })
        return
      }
      form.setFieldsValue({
        floor_img: [{}]
      })
    })
  }, [])

  return (
    <Form
      form={form}
      // labelCol={{ span: 3 }}
      // wrapperCol={{ span: 18 }}
      style={{ maxWidth: 800 }}
      onFinish={handleFinish}
    >
      <Form.Item>
        <Form.List name="floor_img">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card style={{ marginBottom: 20 }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'image_file_ids']}
                  >
                    <UploadFiles />
                  </Form.Item>
                  <div
                    style={{
                      width: 80,
                      position: 'relative',
                      top: -100,
                      left: 600,
                      display: 'flex',
                      justifyContent: 'space-around'
                    }}>
                    <PlusCircleOutlined
                      style={{ fontSize: 30, cursor: 'pointer' }}
                      onClick={() => add()}
                    />
                    {
                      name !== 0 &&
                      <MinusCircleOutlined
                        style={{ fontSize: 30, cursor: 'pointer' }}
                        onClick={() => remove(name)}
                      />
                    }
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                  >
                    <Input placeholder="请输入图片标题" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                  >
                    <Input.TextArea placeholder="图片介绍" />
                  </Form.Item>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleClosePlan}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FloorPlan