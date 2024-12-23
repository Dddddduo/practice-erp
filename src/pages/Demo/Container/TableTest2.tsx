import React from 'react';
import type {ColumnsType} from "antd/es/table";
import {Button, Input} from "antd";
import DragTable from "@/components/Table/DragTable";
import DynamicTable from "@/components/Table/DynamicTable";


interface TableTest2Props {
  sourceKey: string
  dataSource: { [key: string]: any }[]
  onValueChange: (path: string, value: any) => void
}

const emptyDataStruct = {
  name: '',
  age: 0,
  address: ''
}

const TableTest2: React.FC<TableTest2Props> = ({sourceKey, dataSource, onValueChange}) => {

  const columns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, _, index: number) => {
        return <>
          <Input value={text} onChange={(e) => {
            onValueChange(`${sourceKey}:${index}:name`, e.target.value)
          }} />
        </>
      }
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    }
  ];

  const actionColumn = (handleAddRow, handleDeleteRow) => ({
    title: '操作',
    dataIndex: 'operation',
    render: (_, record, index: number) => (
      <>
        <Button type="link" onClick={() => handleAddRow(index)}>新增</Button>
        <Button type="link" danger onClick={() => handleDeleteRow(index)}>删除</Button>
      </>
    ),
  })

  return (
    <DynamicTable
      sourceKey={sourceKey}
      dataSource={dataSource}
      onValueChange={onValueChange}
      columns={columns.map((item, index) => {
        if ('key' in item) {
          return item
        }

        return {
          ...item,
          key: index
        }
      })}
      actionColumn={actionColumn}
      dataStruct={emptyDataStruct}
    />
  );
};

export default TableTest2;
