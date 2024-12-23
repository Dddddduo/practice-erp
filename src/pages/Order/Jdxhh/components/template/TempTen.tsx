import UploadFiles from "@/components/UploadFiles"
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Card, Form, Select, Space } from "antd"
import React, { useEffect } from "react"

interface Props {
  tempData: any
}

const TempTen: React.FC<Props> = ({
  tempData,
}) => {

  const Options = {
    baseOne: [
      {
        value: '空调出风口百叶清洗',
        label: '空调出风口百叶清洗',
      },
      {
        value: '空调过滤网清洗',
        label: '空调过滤网清洗',
      },
      {
        value: '空调接水盘和接水盘排水口清洗',
        label: '空调接水盘和接水盘排水口清洗',
      },
      {
        value: '空调表冷器清洗',
        label: '空调表冷器清洗',
      },
      {
        value: 'Y型过滤网清洗',
        label: 'Y型过滤网清洗',
      },
      {
        value: '清洗分体空调外机',
        label: '清洗分体空调外机',
      },
      {
        value: '排水管疏通',
        label: '排水管疏通',
      },
    ],
    baseTwo: [
      {
        value: '检查风管水管，空调阀门',
        label: '检查风管水管，空调阀门',
      },
      {
        value: '检查电机皮带',
        label: '检查电机皮带',
      },
      {
        value: '机电维保：检查配电箱，螺丝紧固，灰尘清洗',
        label: '机电维保：检查配电箱，螺丝紧固，灰尘清洗',
      },
      {
        value: '机电维保：检查温控面板',
        label: '机电维保：检查温控面板',
      },
      {
        value: '机电维保：检查烟感，消防喷淋，安全出口',
        label: '机电维保：检查烟感，消防喷淋，安全出口',
      },
      {
        value: '机电维保：检查灭火器',
        label: '机电维保：检查灭火器',
      },
    ],
    baseThree: [
      {
        value: '检测店铺卖场机库房温度',
        label: '检测店铺卖场机库房温度',
      },
      {
        value: '检测店铺进水管和回水管温度',
        label: '检测店铺进水管和回水管温度',
      },
      {
        value: '检测店铺出回风风速',
        label: '检测店铺出回风风速',
      },
      {
        value: '空调维保后留在店铺内观察设备运行是否正常',
        label: '空调维保后留在店铺内观察设备运行是否正常',
      },
      {
        value: '商品保护',
        label: '商品保护',
      },
    ]
  }

  return (
    <>
      <Form.List name="baseOne">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    noStyle
                  >
                    <Select
                      style={{ width: 400 }}
                      options={Options.baseOne}
                      placeholder="请选择"
                      allowClear
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    />
                  </Form.Item>
                </div>
                <Space key={key} style={{ display: 'flex', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'before_id']}
                    label={<div style={{ color: 'red' }}>Before</div>}
                  >
                    <UploadFiles fileLength={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'after_id']}
                    label={<div style={{ color: 'red' }}>After</div>}
                  >
                    <UploadFiles fileLength={1} />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 22 }} />
                      {
                        name !== 0 &&
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 22 }} />
                      }
                    </Space>
                  </Form.Item>
                </Space>
              </Card>
            ))}
          </>
        )}
      </Form.List >

      <Form.List name="baseTwo">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    placeholder="请选择"
                    noStyle
                  >
                    <Select
                      style={{ width: 400 }}
                      options={Options.baseTwo}
                      placeholder="请选择"
                      allowClear
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    />
                  </Form.Item>
                </div>
                <Space key={key} style={{ display: 'flex', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'before_id']}
                  >
                    <UploadFiles fileLength={1} />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 22 }} />
                      {
                        name !== 0 &&
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 22 }} />
                      }
                    </Space>
                  </Form.Item>
                </Space>
              </Card>
            ))}
          </>
        )}
      </Form.List>

      <Form.List name="baseThree">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    noStyle
                  >
                    <Select
                      style={{ width: 400 }}
                      options={Options.baseThree}
                      placeholder="请选择"
                      allowClear
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    />
                  </Form.Item>
                </div>
                <Space key={key} style={{ display: 'flex', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'before_id']}
                  >
                    <UploadFiles fileLength={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'after_id']}
                  >
                    <UploadFiles fileLength={1} />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 22 }} />
                      {
                        name !== 0 &&
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 22 }} />
                      }
                    </Space>
                  </Form.Item>
                </Space>
              </Card>
            ))}
          </>
        )}
      </Form.List>
    </>
  )
}

export default TempTen
