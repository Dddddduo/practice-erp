import React, {useEffect, useState} from 'react';
import TableTest1 from "@/pages/Demo/Container/TableTest1";
import {isEmpty} from "lodash";
import {handleParseStateChange} from "@/utils/utils";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {Button} from "antd";
import BaseContainer, {ModalType} from "@/components/Container";
import {addSortKey} from "@/components/Table/DragTable";
import TableTest2 from "@/pages/Demo/Container/TableTest2";
import FormTest from "@/pages/Demo/Container/FormTest";


const initData = {
  tableTest1: [
    {
      name: 'John Brown',
      age: 55,
      address:
        'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      name: 'Tom Green',
      age: 66,
      address: 'London No. 1 Lake Park',
    },
    {
      name: 'Joe Black',
      age: 77,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  tableTest2: [
    {
      id: 1,
      name: 'John Brown',
      age: 22,
      address:
        'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      id: 2,
      name: 'Tom Green',
      age: 33,
      address: 'London No. 1 Lake Park',
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 44,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  formData: {
    name: 'Anthony',
    age: 43,
    address: 'China Shanghai',
    hobby: 3,
    list: [{item:'hello', fileIds: 0}, {item:'world', fileIds: 0}],
    dragList: [{id: '1', key: '1', item: 100, fileIds: 0}, {id: '2', key: '2', item: 200, fileIds: 0}],
    qtList: [
      {
        test1: 'test1',
        item1: [
          {
            test2: 'test2',
            item2: [{name: 'hello'}]
          }
        ]
      }
    ],
    //{item1: [{item2: [{name: 'hello'}]}
  }
};

const myOptions = {
  hobby: [
    {value: 1, label: 'Reading'},
    {value: 2, label: 'Photography'},
    {value: 3, label: 'Hiking'},
    {value: 4, label: 'Cooking'},
    {value: 5, label: 'Playing musical instruments '},
  ]
}


const Index: React.FC = () => {

  const [dataSource, setDataSource] = useState<{ [key: string]: any }>([]);

  const [options, setOptions] = useState<{ [key: string]: any }>([]);

  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  const handleValueChange: any = (path: string, value: any) => {
    const newData = handleParseStateChange(dataSource, path, value)
    setDataSource(newData);
  };

  useEffect(() => {
    const httpRequestData = {...initData}
    httpRequestData.tableTest1 = addSortKey(httpRequestData.tableTest1)
    setDataSource(httpRequestData)
    setOptions(myOptions)

  }, [containerOpen]);


  const handleSubmit = async () => {
    console.log("submit:", dataSource)
    // 格式化
    // http提交
  }

  const handleClose = (isReload: boolean = false) => {
    setContainerOpen(false)
    if (isReload) {
      // todo... 重新刷新表格
    }
  }


  return (
    <>
      <Button type="primary" onClick={() => setContainerOpen(true)}>打开</Button>
      <BaseContainer
        type={ModalType.Drawer}
        title="test"
        style={{top: 30}}
        width="90%"
        open={containerOpen}
        onCancel={() => handleClose()}
        afterOpenChange={() => console.log('hello')}
        afterClose={() => console.log('closed')}
      >
        <TableTest1
          key="tableTest1"
          onValueChange={handleValueChange}
          sourceKey="tableTest1"
          dataSource={isEmpty(dataSource?.tableTest1) ? [] : dataSource.tableTest1}
        />
        <FormTest
          key="formData"
          sourceKey="formData"
          dataSource={isEmpty(dataSource?.formData) ? {} : dataSource.formData}
          onValueChange={handleValueChange}
          options={options}
        />
        <TableTest2
          key="tableTest2"
          onValueChange={handleValueChange}
          sourceKey="tableTest2"
          dataSource={isEmpty(dataSource?.tableTest2) ? [] : dataSource.tableTest2}
        />
        <SubmitButton style={{marginRight: 15}} type="primary" onConfirm={handleSubmit}>
          提交
        </SubmitButton>
        <Button onClick={() => handleClose()}>取消</Button>
      </BaseContainer>
    </>
  );
};

export default Index;
