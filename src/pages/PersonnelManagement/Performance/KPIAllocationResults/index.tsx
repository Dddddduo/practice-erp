import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, message, Space} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {deleteKpi, getEmployeeKpiListPage} from '@/services/ant-design-pro/kpi';
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface EmployeeKpiListItem {
  kpi_id: number;
  kpi_table_id: number;
  kpi_eid: number;
  job_no: string;
  name: string;
  year: string;
  quarter: string;
  score: string;
  level: string;
  create_at: string;
}

const EmployeeKpiList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm()
  const [quarter, setQuarter] = useState<string>('Q4');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  // 将年份转换为valueEnum所需的格式
  const yearValueEnum = years.reduce((acc, year) => {
    acc[year] = year.toString();
    return acc;
  }, {});

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const handleDelete = async (value: any) => {
    try {
      const res = await deleteKpi(value?.kpi_id ?? 0)
      if (!res.success) {
        message.error('删除失败!' + res.message)
        return
      }
      message.success('删除成功!')
      actionRef?.current?.reload()
    } catch (err) {
    }
  }

  const columns: ProColumns<EmployeeKpiListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'index',
      valueType: 'index',
      width: '80px',
      search: false
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: false
    },
    {
      title: '工号',
      dataIndex: 'job_no',
      search: false
    },
    {
      title: '年份',
      dataIndex: 'year',
      valueType: 'select',
      fieldProps: {
        value: year,
        allowClear: false,
        options: [
          {
            value: new Date().getFullYear(),
            label: new Date().getFullYear(),
          },
          {
            value: new Date().getFullYear() - 1,
            label: new Date().getFullYear() - 1,
          },
          {
            value: new Date().getFullYear() - 2,
            label: new Date().getFullYear() - 2,
          },
        ]
      },
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      valueType: 'select',
      fieldProps: {
        value: quarter,
        allowClear: false,
        options: [
          {value: 'Q1', label: 'Q1'},
          {value: 'Q2', label: 'Q2'},
          {value: 'Q3', label: 'Q3'},
          {value: 'Q4', label: 'Q4'},
        ]
      },
    },
    {
      title: '分数',
      dataIndex: 'score',
      search: false
    },
    {
      title: '评级',
      dataIndex: 'level',
      search: false
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      valueType: 'dateTime',
      search: false
    },
    {
      title: '操作',
      dataIndex: 'operation',
      search: false,
      render: (_, record) => {

        console.log('record', record)

      return  <Space>
          <a onClick={() => {
            if (record?.level || record?.level_cn) {
              window.open(`/personnelManagement/kpiScore?kpi_id=${record?.kpi_id}`, '_blank')
              return
            }
            message.error('暂未打分，无法查看')
          }}>查看</a>

          <Button
            type="link"
            // #/kpi-score?kpi_table_id=2&quarter=Q1&year=2024&eid=223
            onClick={() => window.open(`/personnelManagement/kpiScore?kpi_table_id=${record.kpi_table_id}&quarter=${record.quarter}&year=${record.year}&eid=${record.kpi_eid}`, '_blank')}
          >
            {
              record?.score && record.score > 0  ? '重新打分' : '打分'
            }
          </Button>

          <DeleteButton danger onConfirm={() => handleDelete(record)}>删除</DeleteButton>

        </Space>
      },
    },
  ];

  const handleFormSearchSubmit = (values: Record<string, any>) => {
    if (values.year) {
      setYear(values.year);
    }
    if (values.quarter) {
      setQuarter(values.quarter);
    }
  };

  useEffect(() => {
    const curYear = new Date().getFullYear()
    const curMonth = new Date().getMonth() + 1
    if (curMonth >= 1 && curMonth <= 3) {
      setYear(curYear - 1)
      setQuarter('Q4')
    }
    if (curMonth >= 4 && curMonth <= 6) {
      setQuarter('Q1')
    }
    if (curMonth >= 7 && curMonth <= 9) {
      setQuarter('Q2')
    }
    if (curMonth >= 10 && curMonth <= 12) {
      setQuarter('Q3')
    }
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <ProTable<EmployeeKpiListItem>
      columns={columns}
      request={async (params, sorter, filter) => {
        const response = await getEmployeeKpiListPage({
          ...params,
          ...sorter,
          ...filter,
          // year: year,
          // quarter: quarter,
        });
        return {
          data: response.data.list,
          success: true,
          total: response.data.total,
        };
      }}
      rowKey="kpi_id"
      pagination={{
        pageSize: 10,
      }}
      actionRef={actionRef}
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
      }}
      toolBarRender={() => []}
      columnsState={{
        value: columnsStateMap,
        onChange: (newState) => {
          setColumnsStateMap(newState)
          setStateMap(pathname, newState)
        }
      }}
      form={{
        form: form,
        onValuesChange: handleFormSearchSubmit,
      }}
    />
  );
};

export default EmployeeKpiList;
