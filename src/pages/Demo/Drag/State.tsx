import UploadFiles from "@/components/UploadFiles";
import React, {useState} from 'react';
import {Form, Card, Input, Button, message} from 'antd';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {produce} from "immer";
import SubmitButton from "@/components/Buttons/SubmitButton";

interface Item {
  key: string;
  title: string;
  img_left_file_id: string;
  img_right_file_id: string;
}

const initialItems: Item[] = [
  {key: 'item-1', title: '店铺灯具检查已完成1', img_left_file_id: '498268', img_right_file_id: '498266'},
  {key: 'item-2', title: '店铺灯具检查已完成2', img_left_file_id: '498265', img_right_file_id: '498264'},
];

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const MyForm = () => {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );
    setItems(newItems);
  };

  const addItem = (index: number) => {
    const newItem: Item = {key: `item-${items.length + 1}`, title: '', img_left_file_id: '0', img_right_file_id: '0'};
    setItems(currentState => produce(currentState, draftState => {
      draftState.splice(index + 1, 0, newItem);
    }));
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      message.error('只有一项了，无法删除')
      return
    }
    setItems(currentState => produce(currentState, draftState => {
      draftState.splice(index, 1);
    }));
  };

  const swapImages = (idx: number) => {
    setItems(currentState => produce(currentState, draftState => {
      draftState[idx]['img_left_file_id'] = currentState[idx].img_right_file_id
      draftState[idx]['img_right_file_id'] = currentState[idx].img_left_file_id
    }));
  };

  const handleChange = (value, idx, type) => {
    setItems(currentState => produce(currentState, draftState => {
      draftState[idx][type] = value
    }));
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card style={{marginBottom: '10px'}}>
                      <Form.Item label="Title">
                        <Input value={item.title} onChange={(e) => handleChange(e.target.value, index, 'title')}/>
                      </Form.Item>
                      <Form.Item>
                        <UploadFiles
                          fileLength={1}
                          value={item.img_left_file_id}
                          onChange={(value) => handleChange(value, index, 'img_left_file_id')}
                        />
                      </Form.Item>
                      <Form.Item>
                        <UploadFiles
                          fileLength={1}
                          value={item.img_right_file_id}
                          onChange={(value) => handleChange(value, index, 'img_right_file_id')}
                        />
                      </Form.Item>
                      <Button onClick={() => swapImages(index)}>Swap Images</Button>
                      <Button onClick={() => removeItem(index)}>Remove</Button>
                      <Button onClick={() => addItem(index)}>Add Below</Button>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <SubmitButton onConfirm={async () => console.log("submit:", items)}>提交</SubmitButton>
    </DragDropContext>
  );
};

export default MyForm;

