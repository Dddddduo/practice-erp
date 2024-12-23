import {ProColumns, ProTable} from '@ant-design/pro-components';
import React, {useEffect} from 'react';

const WarningsRecord: React.FC<any> = (props) => {
  const { warningsRecord, getWarningsRecordData } = props;
  const columns: ProColumns<API.SimParams>[] = [
    {
      title: 'id',
      dataIndex: 'shop_id',
      search: false,
      align: 'center',
    },
    {
      title: 'group',
      dataIndex: 'group',
      search: false,
      align: 'center',
    },
    {
      title: 'opt',
      dataIndex: 'opt',
      search: false,
      align: 'center',
    },
    {
      title: 'val',
      dataIndex: 'val',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        const array = JSON.parse(entity.val);
        return <>{array}</>;
      }
    },
    {
      title: 'source',
      dataIndex: 'source',
      search: false,
      align: 'center',
    },
    {
      title: 'create_time',
      dataIndex: 'create_time',
      search: false,
      align: 'center',
    },
  ]

  return (
    <>
      <div>WarningsRecord</div>
      <ProTable<API.SimParams, API.PageParams>
        columns={columns}
        request={getWarningsRecordData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default WarningsRecord;
