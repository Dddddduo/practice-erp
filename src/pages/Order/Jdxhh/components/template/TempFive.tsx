import UploadFiles from "@/components/UploadFiles"
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space } from "antd"
import React, { useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Props {
  onDragEnd: (result: any) => void
}

const TempFive: React.FC<Props> = ({
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
                                name={[name, 'imageList']}
                              >
                                <UploadFiles />
                              </Form.Item>
                            </Space>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                noStyle
                              >
                                <Input.TextArea style={{ width: 400 }} />
                              </Form.Item>
                              <Space>
                                <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 22, cursor: 'pointer' }} />
                                <PlusCircleOutlined
                                  style={{ fontSize: 22, cursor: 'pointer' }}
                                  onClick={() => add(
                                    {
                                      imageList: '',
                                      title: ''
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
                        imageList: '',
                        title: ''
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

  // return (
  //   <Form.List name="details">
  //     {(fields, { add, remove }) => (
  //       <>
  //         {fields.map(({ key, name, ...restField }) => (
  //           <Card style={{ marginBottom: 20 }}>
  //             <Space key={key} style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
  //               <Form.Item
  //                 {...restField}
  //                 name={[name, 'img']}
  //               >
  //                 <UploadFiles />
  //               </Form.Item>
  //             </Space>
  //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
  //               <Form.Item
  //                 {...restField}
  //                 name={[name, 'remark']}
  //                 noStyle
  //               >
  //                 <Input.TextArea style={{ width: 400 }} />
  //               </Form.Item>
  //               <Space>
  //                 <MenuOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
  //                 <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 20, cursor: 'pointer' }} />
  //               </Space>
  //             </div>
  //           </Card>
  //         ))}
  //         <Form.Item>
  //           <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
  //             添加一项
  //           </Button>
  //         </Form.Item>
  //       </>
  //     )}
  //   </Form.List>

  // )
}

export default TempFive