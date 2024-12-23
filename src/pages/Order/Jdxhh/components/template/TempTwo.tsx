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

const TempTwo: React.FC<Props> = ({
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
                                  options={tempData.options}
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

export default TempTwo
