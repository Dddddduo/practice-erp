import React, {useEffect} from 'react';
import {Form, Input, InputNumber, Select, Card, Space, Button} from "antd";
import {isEmpty} from "lodash";
import BaseFormList from "@/components/FormList";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import UploadFiles from "@/components/UploadFiles";
import DragFormList from "@/components/FormList/DragFormList";

interface FormTestProps {
  sourceKey: string
  dataSource?: { [key: string]: any }
  onValueChange: (path: string, value: any) => void
  options?: any
}


const baseStruct = {
  item: '',
  fileIds: 0
}
const FormListItem: React.FC<any> = ({restField, name, remove, add, index}) => {
  return (
    <Space key={restField.key} style={{display: 'flex', marginBottom: 8}} align="baseline">
      <Form.Item
        {...restField}
        key={`formInput-${restField.key}`}
        style={index !== 0 ? {marginLeft: 65} : {}}
        name={[name, 'item']}
        label={index === 0 ? 'ListItem' : ''}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        {...restField}
        key={`formFiles-${restField.key}`}
        name={[name, 'fileIds']}
      >
        <UploadFiles/>
      </Form.Item>
      <MinusCircleOutlined onClick={() => remove(index)}/>
      <PlusCircleOutlined onClick={() => add(baseStruct, index + 1)}/>
    </Space>
  )
}



const DragFormListItem: React.FC<any> = ({restField, name, remove, add, index, dragHandle}) => {
  return (
    <>
      <Space key={restField.fieldKey} style={{display: 'flex', marginBottom: 8}} align="baseline">
        {dragHandle}
        <Form.Item
          {...restField}
          key={`testFormInput-${restField.fieldKey}`}
          style={index !== 0 ? {marginLeft: 65} : {}}
          name={[name, 'item']}
          label={index === 0 ? 'ListItem' : ''}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          {...restField}
          key={`file_${restField.fieldKey}`}
          name={[name, 'fileIds']}
        >
          <UploadFiles/>
        </Form.Item>
        <MinusCircleOutlined onClick={() => remove(index)}/>
        <PlusCircleOutlined onClick={() => add(baseStruct, index + 1)}/>
      </Space>
    </>
  )
}







const QTFormListItem3: React.FC<any> = ({restField, name, remove, add, index, dragHandle}) => {
  return (
    <div key={restField.key} style={{display: 'flex', marginBottom: 8}} align="baseline">
      {dragHandle}
      <Form.Item
        {...restField}
        key={`testFormInput-${restField.key}`}
        style={index !== 0 ? {marginLeft: 65} : {}}
        name={[name, 'name']}
      >
        <Input/>
      </Form.Item>
    </div>
  )
}


const QTFormListItem2: React.FC<any> = ({restField, name, remove, add, index, formRef, parentNames}) => {
  console.log("parentNames:", parentNames)
  return (
    <div>
      <Form.Item
        {...restField}
        key={`testFormInput-${restField.key}`}
        style={index !== 0 ? {marginLeft: 65} : {}}
        name={[name, 'test2']}
      >
        <Input />
      </Form.Item>
      <DragFormList listName={[name, 'item2']} dragHandle={<div>拖动</div>} formRef={formRef} addButton={<Button>添加</Button>} parentNames={parentNames}>
        <QTFormListItem3 key="qt-list-item3" />
      </DragFormList>
    </div>
  )
}

const QTFormItem1: React.FC<any> = ({restField, name, remove, add, index, formRef, parentNames}) => {
  return (
    <Space key={restField.key} style={{display: 'flex', marginBottom: 8}} align="baseline">
      <Form.Item
        {...restField}
        key={`testFormInput-${restField.key}`}
        style={index !== 0 ? {marginLeft: 65} : {}}
        name={[name, 'test1']}
      >
        <Input />
      </Form.Item>
      <BaseFormList listName={[name, 'item1']} formRef={formRef} parentNames={parentNames}>
        <QTFormListItem2 key="qt-list-item2" />
      </BaseFormList>
    </Space>
  )
}



const FormTest: React.FC<FormTestProps> = ({sourceKey, dataSource, onValueChange, options}) => {

  const [formRef] = Form.useForm();

  // const MemoizedChildComponent = React.memo(FormListItem);
  const handleValueChange = (changedValues, value) => {
    console.log("FormTest:handleValueChange", changedValues, value)
    onValueChange(sourceKey, value)
  }

  const filterOptionHandle = (input, option) => (option?.label ?? '').toString().includes(input)
  const filterSortHandle = (optionA, optionB) =>
    (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())

  useEffect(() => {
    if (!isEmpty(dataSource)) {
      formRef.setFieldsValue(dataSource)
    }
  }, [dataSource]);

  return (
    <>
      <div style={{margin: '0 20%', padding: '20px 0'}}> {/* 全局居中，左右留出20%的空隙 */}
        <Card>
          <Form
            form={formRef}
            onValuesChange={(changedValues, value) => handleValueChange(changedValues, value)}
            initialValues={{time_ranges: [{date: ['', '']}]}}
          >
            <Form.Item label="Name" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="Age" name="age">
              <InputNumber min={1} max={100}/>
            </Form.Item>
            <Form.Item label="Hhobby" name="hobby">
              <Select
                options={isEmpty(options?.hobby) ? [] : options.hobby}
                filterOption={filterOptionHandle}
                filterSort={filterSortHandle}
                showSearch
                allowClear
              />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input.TextArea/>
            </Form.Item>

            <h3 style={{marginBottom: 16}}>普通FormList</h3>
            <BaseFormList
              key="list"
              listName="list"
              addButton={<Button type="dashed">Add Row</Button>}
              addStruct={baseStruct}
              disableRemoveLast={false}
            >
              <FormListItem key="list-litem1"/>
            </BaseFormList>

            <h3 style={{marginTop: 20, marginBottom: 16}}>拖拽FormList</h3>
            <DragFormList
              key="dragList"
              listName="dragList"
              addButton={<Button key="addBtn" type="dashed">Add Row</Button>}
              addStruct={baseStruct}
              dragHandle={<div>[推动手柄]</div>}
              formRef={formRef}
            >
              <DragFormListItem key="list-litem2"/>
            </DragFormList>

            <h3 style={{marginTop: 20, marginBottom: 16}}>嵌套FormList</h3>
            <BaseFormList
              listName="qtList"
              formRef={formRef}
            >
              <QTFormItem1 key="qt-list-item1"/>
            </BaseFormList>
          </Form>
        </Card>
      </div>
    </>
  )
};

export default FormTest;
