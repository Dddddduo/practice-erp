import React, { RefObject, useEffect, useState } from "react"
import { Button, Space, Form, Input, Table, InputNumber } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { createOrUpdateKpiItem } from "@/services/ant-design-pro/kpiWorker";
import { isEmpty } from "lodash";

interface ItemListProps {
  handleCloseCreateOrEdit: () => void
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
  currentItem: {
    item: string
    score: string
    remark: string
    info: {}[]
    kpi_item_id: number
  }
}

const CreateOrEdit: React.FC<ItemListProps> = ({
  handleCloseCreateOrEdit,
  success,
  error,
  actionRef,
  currentItem
}) => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource]: any = useState([
    {
      key: 1,
      score_index: "",
      rate: '',
      weight: '',
      content: '',
    }
  ])

  const handleFinish = (values) => {
    const params = {
      kpi_item: values.item ?? '',
      kpi_score: values.score ?? '',
      remark: values.remark ?? '',
      use_for: 'fm',
      kpi_info: dataSource ?? [],
      kpi_item_id: isEmpty(currentItem) ? undefined : currentItem.kpi_item_id
    }
    createOrUpdateKpiItem(params).then(res => {
      if (res.success) {
        handleCloseCreateOrEdit()
        actionRef.current.reload()
        success('处理成功')
      }
    })

  }

  const handleInput = (e, entity, cur) => {
    const format = dataSource.map(item => {
      if (item.key === entity.key) {
        item[cur] = e.target.value
        return item
      }
      return item
    })
    setDataSource(format)
  }

  const columns = [
    {
      title: "细分指标",
      dataIndex: 'score_index',
      width: 250,
      render: (dom, entity) => (
        <Input value={dom} onInput={(e) => handleInput(e, entity, 'score_index')} />
      )
    },
    {
      title: "权重",
      width: 150,
      dataIndex: 'rate',
      render: (dom, entity) => (
        <InputNumber value={dom} onInput={(e) => {
          const format = dataSource.map(item => {
            if (item.key === entity.key) {
              item.rate = e
              item.weight = (Number(e) / 100).toFixed(2)
              return item
            }
            return item
          })
          setDataSource(format)
        }} />
      )
    },
    {
      title: "指标具体内容及定义",
      dataIndex: 'content',
      render: (dom, entity) => (
        <Input.TextArea value={dom} onInput={(e) => handleInput(e, entity, 'content')} />
      )
    },
    {
      title: "操作",
      dataIndex: '',
      width: 80,
      render: (dom, entity, index) => (
        <Space>
          <PlusCircleOutlined
            style={{
              fontSize: 18
            }}
            onClick={addMetricItem}
          />
          {
            index !== 0 &&
            <MinusCircleOutlined
              style={{
                fontSize: 18
              }}
              onClick={() => removeMetricItem(entity)}
            />
          }
        </Space>
      )
    },
  ]

  const addMetricItem = () => {
    const newMetricItem = {
      key: dataSource[dataSource.length - 1].key + 1,
      score_index: "",
      rate: '',
      weight: '',
      content: '',
    }
    setDataSource(preState => {
      return [
        ...preState,
        newMetricItem
      ]
    })
  }

  const removeMetricItem = (entity) => {
    setDataSource(dataSource.filter(item => item.key !== entity.key))
  }

  useEffect(() => {
    if (isEmpty(currentItem)) {
      return
    }
    form.setFieldsValue({
      item: currentItem.item ?? '',
      score: currentItem.score ?? '',
      remark: currentItem.remark ?? '',
      // metric: currentItem.info ?? []
    })
    setDataSource(currentItem.info)
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: 1000 }}
      onFinish={handleFinish}
    >
      <Form.Item label="考核项目" name="item" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="分数" name="score" rules={[{ required: true }]}>
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <Input.TextArea placeholder="请输入" />
      </Form.Item>

      <Form.Item label="指标" name="metric">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type='primary' htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseCreateOrEdit}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrEdit