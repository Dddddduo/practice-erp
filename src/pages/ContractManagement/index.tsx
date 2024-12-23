import React, { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormDigit, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-form';
import request from 'umi-request';

interface ContractItem {
  id?: number;
  number: string;
  name: string;
  department_id: number;
  department_head_id: number;
  company_a: string;
  company_b: string;
  company_c: string;
  start_date: string;
  end_date: string;
  signing_date: string;
  price: number;
  notes: string;
  path: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
}

const columns: ProColumns<ContractItem>[] = [
  { title: 'Contract Number', dataIndex: 'number', sorter: true },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Department ID', dataIndex: 'department_id' },
  { title: 'Department Head ID', dataIndex: 'department_head_id' },
  { title: 'Company A', dataIndex: 'company_a' },
  { title: 'Company B', dataIndex: 'company_b' },
  { title: 'Company C', dataIndex: 'company_c' },
  { title: 'Start Date', dataIndex: 'start_date', valueType: 'date' },
  { title: 'End Date', dataIndex: 'end_date', valueType: 'date' },
  { title: 'Signing Date', dataIndex: 'signing_date', valueType: 'date' },
  { title: 'Price', dataIndex: 'price' },
  { title: 'Notes', dataIndex: 'notes' },
  { title: 'Contract Path', dataIndex: 'path' },
  { title: 'Created At', dataIndex: 'created_at', valueType: 'dateTime' },
  { title: 'Updated At', dataIndex: 'updated_at', valueType: 'dateTime' },
  { title: 'Deleted At', dataIndex: 'deleted_at', valueType: 'dateTime' },
  { title: 'Actions', valueType: 'option', render: (text, record) => [
      <UpdateOrCreateContract key="edit" record={record} onSuccess={() => actionRef.current?.reload()} />,
      <Button key="delete" onClick={() => handleBatchDelete([record.id])}>Delete</Button>,
    ] },
];

const ContractManagementGpt: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleBatchDelete = async (contractIds: React.Key[]) => {
    await request('/prod-api/open/v1/contract-management-del', {
      method: 'POST',
      data: { contract_ids: contractIds },
    });
    message.success('Contracts deleted successfully');
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<ContractItem>
        headerTitle="Contract Management"
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const res = await request('/prod-api/open/v1/contract-management', {
            params,
          });
          return {
            data: res.data,
            total: res.total,
            success: true,
          };
        }}
        rowSelection={{
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [
          <UpdateOrCreateContract onSuccess={() => actionRef.current?.reload()} />,
          <Button onClick={() => handleBatchDelete(selectedRowKeys)} disabled={selectedRowKeys.length === 0}>Batch Delete</Button>,
        ]}
      />
    </>
  );
};

const UpdateOrCreateContract: React.FC<{ record?: ContractItem; onSuccess: () => void; }> = ({ record, onSuccess }) => {
  return (
    <ModalForm<ContractItem>
      title={record ? 'Edit Contract' : 'New Contract'}
      initialValues={record}
      onFinish={async (values) => {
        await request('/prod-api/open/v1/up-or-create-contract-management', {
          method: 'POST',
          data: values,
        });
        message.success('Contract saved successfully');
        onSuccess();
        return true;
      }}
      trigger={
        <Button type="primary">
          {record ? 'Edit' : <PlusOutlined />}
        </Button>
      }
    >
      <ProFormText name="number" label="Contract Number" required />
      <ProFormText name="name" label="Name" required />
      <ProFormDigit name="department_id" label="Department ID" required />
      <ProFormDigit name="department_head_id" label="Department Head ID" required />
      <ProFormText name="company_a" label="Company A" required />
      <ProFormText name="company_b" label="Company B" />
      <ProFormText name="company_c" label="Company C" />
      <ProFormDatePicker name="start_date" label="Start Date" required />
      <ProFormDatePicker name="end_date" label="End Date" required />
      <ProFormDatePicker name="signing_date" label="Signing Date" required />
      <ProFormDigit name="price" label="Price" required />
      <ProFormTextArea name="notes" label="Notes" />
      <ProFormText name="path" label="Contract Path" />
    </ModalForm>
  );
};

export default ContractManagementGpt;
