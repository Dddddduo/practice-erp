import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { Table, Radio, Button, Input, DatePicker, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const DynamicFormTable = forwardRef((props, ref) => {
  const [status, setStatus] = useState('n');
  const [tableData, setTableData] = useState([
    { key: 0, description: '', start_at: null, end_at: null },
  ]);

  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  const handleAddRow = () => {
    const newData = [...tableData, { key: tableData.length, description: '', start_at: null, end_at: null }];
    setTableData(newData);
  };

  const handleDeleteRow = key => {
    const newData = tableData.filter(item => item.key !== key);
    setTableData(newData);
  };

  const handleDescriptionChange = (value, key) => {
    const newData = [...tableData];
    const index = newData.findIndex(item => item.key === key);
    newData[index].description = value;
    setTableData(newData);
  };

  // Function to handle date changes
  const handleDateChange = (dateString, key, field) => {
    const newData = [...tableData];
    const index = newData.findIndex(item => item.key === key);
    newData[index][field] = dateString;
    setTableData(newData);
  };

  const columns: any = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: (text, record) => (
        <Input.TextArea
          value={text}
          autoSize
          onChange={e => handleDescriptionChange(e.target.value, record.key)}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: (_, record) => (
        <>
          <DatePicker
            style={{ marginRight: 8 }}
            value={record.start_at ? dayjs(record.start_at) : ''}
            onChange={(date, dateString) => handleDateChange(dateString, record.key, 'start_at')}
          />
          <DatePicker
            value={record.end_at ? dayjs(record.end_at) : ''}
            onChange={(date, dateString) => handleDateChange(dateString, record.key, 'end_at')}
          />
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        />
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    // Method to expose formData to the parent
    getFormData: () => tableData,

    // You can also expose functions to modify the state
    updateFormData: (newData) => setTableData(newData),

    getStatus: () => status,

    updateStatus: (newStatus) => setStatus(newStatus),
  }));


  return (
    <div>
      <Form labelPosition="left">
        <Form.Item label="是否按照计划">
          <Radio.Group value={status} onChange={handleStatusChange}>
            <Radio value="n">N</Radio>
            <Radio value="y">Y</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <Table dataSource={tableData} columns={columns} rowKey="key" pagination={false} />
      <Button type="primary" icon={<PlusOutlined />} style={{width: '100%'}} onClick={handleAddRow}>
        添加新行
      </Button>
    </div>
  );
})

export default DynamicFormTable
