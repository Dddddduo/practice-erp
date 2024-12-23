import UploadFiles from "@/components/UploadFiles"
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons"
import { Button, Card, Form, Select, Space } from "antd"
import React, { useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Props {
  tempData: any
  handleBeforAfterChange: (name: number, temp: number) => void
  onDragEnd: (result: any) => void
}

const Options = [
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
    value: 'Y型过滤器清洗',
    label: 'Y型过滤器清洗',
  },
  {
    value: '清洗分体空调外机',
    label: '清洗分体空调外机',
  },
  {
    value: '排水管疏通',
    label: '排水管疏通',
  },
  {
    value: '检查风管水管，空调阀门',
    label: '检查风管水管，空调阀门',
  },
  {
    value: '检查电机皮带',
    label: '检查电机皮带',
  },
  {
    value: '机电维保：检查配电箱，螺丝紧固，灰尘清理',
    label: '机电维保：检查配电箱，螺丝紧固，灰尘清理',
  },
  {
    value: '机电维保：检查温控面板',
    label: '机电维保：检查温控面板',
  },
  {
    value: '消防检查：检查烟感，消防喷淋，安全出口',
    label: '消防检查：检查烟感，消防喷淋，安全出口',
  },
  {
    value: '消防检查：检查灭火器',
    label: '消防检查：检查灭火器',
  },
  {
    value: '检测店铺卖场及库房温度',
    label: '检测店铺卖场及库房温度',
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
]

const TempFourteen: React.FC<Props> = ({
  tempData,
  handleBeforAfterChange,
  onDragEnd
}) => {

  return (
    <Form.List name="details">
      {(fields, { add, remove }) => (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="details">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Draggable key={key} draggableId={key.toString()} index={index}>
                    {
                      (provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Card style={{ marginBottom: 20 }}>
                            <Space key={key} style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'img_left_file_id']}
                              >
                                <UploadFiles fileLength={1} />
                              </Form.Item>
                              <Form.Item>
                                <SwapOutlined style={{ fontSize: 26, cursor: 'pointer' }} onClick={() => handleBeforAfterChange(name, 2)} />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'img_right_file_id']}
                              >
                                <UploadFiles fileLength={1} />
                              </Form.Item>
                            </Space>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                noStyle
                              >
                                <Select
                                  style={{ width: 400 }}
                                  options={Options}
                                  placeholder="请选择"
                                  allowClear
                                  showSearch
                                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                />
                              </Form.Item>
                              <Space>
                                {/* <MenuOutlined style={{ fontSize: 20, cursor: 'pointer' }} /> */}
                                <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 22, cursor: 'pointer' }} />
                                <PlusCircleOutlined
                                  style={{ fontSize: 22, cursor: 'pointer' }}
                                  onClick={() => add(
                                    {
                                      before_id: '',
                                      after_id: '',
                                      title: undefined
                                    },
                                    index + 1
                                  )}
                                />
                              </Space>
                            </div>
                          </Card>
                        </div>
                      )
                    }
                  </Draggable>
                ))}
                <Form.Item>
                  <Button type="dashed"
                    onClick={() => add(
                      {
                        before_id: '',
                        after_id: '',
                        title: undefined
                      }
                    )}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加一项
                  </Button>
                </Form.Item>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Form.List>
  )
}

export default TempFourteen
