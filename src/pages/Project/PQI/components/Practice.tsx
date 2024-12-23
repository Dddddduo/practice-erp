import { Table } from 'antd';

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 },
  { id: 4, name: 'Alice', age: 25 },
];

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      const rowSpan = data.filter(item => item.name === text).length;
      return {
        children: <span>{text}</span>,
        props: {
          rowSpan: rowSpan,
        },
      };
    },
  },
  { title: 'Age', dataIndex: 'age', key: 'age' },
];

const Apppp = () => {
  return <Table dataSource={data} columns={columns} bordered />;
};

export default Apppp;


