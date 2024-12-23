import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import {deleteOrRollbackReport, getWeeklyReportList} from "@/services/ant-design-pro/weekly";

interface ItemListProps {
  refresh: () => void
}

const Trash: React.FC<ItemListProps> = ({refresh}) => {
  const [trashList, setTrashList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载回收站列表
  const loadTrashList = async () => {
    setLoading(true);
    try {
      const res = await getWeeklyReportList({ is_delete: 'y' });
      if (res?.data) {
        setTrashList(res.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch trash list:', error);
      message.error('Failed to fetch trash list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashList().then(r => {
      console.log(r);
    });
  }, []);

  // 撤销删除
  const handleRollBack = async (record) => {
    setLoading(true);
    try {
      const res = await deleteOrRollbackReport({ weekly_report_id: record.id, is_delete: 'n' });
      if (res.success) {
        message.success('撤销成功')
        await loadTrashList()
        refresh()
      } else {
        message.error('撤销失败');
      }
    } catch (error) {
      message.error('撤销失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '品牌',
      dataIndex: 'brand_en',
      valueType: 'text',
    },
    {
      title: '城市',
      dataIndex: 'city_cn',
      valueType: 'text',
    },
    {
      title: '商场',
      dataIndex: 'city_cn',
      valueType: 'text',
    },
    {
      title: '店铺',
      dataIndex: 'market_cn',
      valueType: 'text',
    },
    {
      title: '创建日期',
      dataIndex: 'create_at',
      valueType: 'text',
    },
    {
      title: '开工日期',
      dataIndex: 'project_start_at',
      valueType: 'text',
    },
    {
      title: '完工日期',
      dataIndex: 'project_end_at',
      valueType: 'text',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Button key="rollBack" type="primary" onClick={() => handleRollBack(record)} loading={loading}>
          撤销
        </Button>,
      ],
    },
  ];

  return (
    <ProTable
      columns={columns}
      dataSource={trashList}
      rowKey="id"
      loading={loading}
      search={false}
      options={false}
      pagination={{
        pageSize: 10,
      }}
    />
  );
};

export default Trash;
