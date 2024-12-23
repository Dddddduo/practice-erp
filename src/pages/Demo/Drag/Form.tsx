import React, {useEffect} from 'react';
import { Form, Card, Input, Button, Space } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UploadFiles from "@/components/UploadFiles";
import {StringDatePicker} from "@/components/StringDatePickers";

interface FormValues {
  items: Array<{
    title: string;
    img_left_file_id: number;
    img_right_file_id: number;
  }>;
}

const MyForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  useEffect(() => {
    form.setFieldValue('items', [
      {"type":null,"title":"title_1","img_left_file_id":498268,"img_right_file_id":498267},
      {"type":null,"title":"title_2","img_left_file_id":498266,"img_right_file_id":498265},
      {"type":null,"title":"title_3","img_left_file_id":498261,"img_right_file_id":498260},
      {"type":null,"title":"title_4","img_left_file_id":498259,"img_right_file_id":498258}
    ])
  }, [])

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    form.setFieldsValue({
      items: reorder(form.getFieldValue('items'), sourceIndex, destIndex),
    });
  };


  const swapImages = (items: any[], index: number) => {
    const newItems = [...items];
    [newItems[index].img_left_file_id, newItems[index].img_right_file_id] = [newItems[index].img_right_file_id, newItems[index].img_left_file_id];
    return newItems;
  };

  const onFinish = async (values: any) => {
    console.log('submit:', values)
  };


  return (
    <Form form={form} initialValues={{ items: [] }} onFinish={ onFinish } layout="vertical">
      <Form.List name="items">
        {(fields, { add, remove, move }) => (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Draggable key={key} draggableId={key.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                          <Card>
                            <div style={{background: "#eee", padding: "10px", marginBottom: "10px", cursor: "grab"}}>
                              Drag Handle
                            </div>
                            <Space direction="vertical" style={{width: '100%'}}>
                              <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                rules={[{required: true, message: 'Missing title'}]}
                              >
                                <Input placeholder="Title"/>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'img_left_file_id']}
                                rules={[{required: true, message: 'Missing left image ID'}]}
                              >
                                <UploadFiles fileLength={1}/>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'img_right_file_id']}
                                rules={[{required: true, message: 'Missing right image ID'}]}
                              >
                                <UploadFiles fileLength={1}/>
                              </Form.Item>
                              <Button type="dashed" onClick={() => {
                                const items = form.getFieldValue('items');
                                form.setFieldsValue({items: swapImages(items, index)});
                              }}>Swap Images</Button>
                              <Button onClick={() => remove(name)}>Remove</Button>
                              <Button onClick={() => add({}, index + 1)}>Add Below</Button>
                            </Space>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Form.List>
      {/*<Form.Item>*/}
      {/*  <Button type="dashed" onClick={() => add()}>Add Item</Button>*/}
      {/*</Form.Item>*/}
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
      <StringDatePicker value="2021-01-12" onChange={console.log} />
    </Form>
  );
};

export default MyForm;
