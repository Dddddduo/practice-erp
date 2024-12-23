import React, {useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import {Button, Form, message, Modal, Select} from 'antd';
import {
  delEmployeeKpi,
  exportEmployeeKpi,
  getEmployeeListPage,
  getKpiTableListAll
} from '@/services/ant-design-pro/kpi';
import {has, isEmpty, unset} from 'lodash';
import BatchAssignModal from './components/BatchAssignModal'; // 调整为正确的导入路径
import DownloadButton from '@/components/Buttons/DownloadButton';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {ActionType} from "@ant-design/pro-components";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

const EmployeeScoreTable: React.FC = () => {
  const {confirm} = Modal;
  const [form] = Form.useForm()
  // 表格的引入
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 假设这些值从高阶搜索或其他逻辑中获取
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<string>('Q4');
  const [currentItem, setCurrentItem] = useState({})
  const [showKpiTableList, setShowKpiTableList] = useState<boolean>(false)
  const [kpiTableList, setKpiTableList] = useState<{}[]>([])
  const [kpiTableItem, setKpiTableItem] = useState<string>('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const yearValueEnum = years.reduce((acc, year) => {
    acc[year] = year.toString();
    return acc;
  }, {})
  const [keyword, setKeyword] = useState<string>('')
  const [mobile, setMobile] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 高阶搜索项
  const searchColumns = [
    {
      title: '姓名/工号',
      dataIndex: 'keyword',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: '就职状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: [
          {value: '在职', label: '在职'},
          {value: '离职', label: '离职'},
        ]
      },
      initialValue: '在职', // 默认在职
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'index',
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '工号',
      dataIndex: 'job_no',
      hideInSearch: true,
    },
    {
      title: '部门',
      dataIndex: 'department_name',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        // todo: 需要替换为实际部门数据
      },
    },
    {
      title: '入职时间',
      dataIndex: 'entry_at',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '岗位',
      dataIndex: 'post',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'full_status',
      hideInSearch: true,
    },

    {
      title: '年份',
      dataIndex: 'year',
      hideInTable: true,
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
      hideInTable: true,
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
      title: '绩效',
      dataIndex: 'level',
      hideInSearch: false,
      valueType: 'select',
      valueEnum: {
        'A+': '卓越',
        A: '优秀',
        B: '良好',
        C: '需改进',
        D: '不达标',
        UN: '未打分',
      },
      render: (_, record) => record?.kpi_score_avg && record?.kpi_score_avg > 0 ? `${record.level}-${record.kpi_score_avg}分(${record.level_cn})` : "未打分",
    },
    {
      title: '打分记录',
      dataIndex: 'kpi_list',
      hideInSearch: true,
      render: (_, record) => !isEmpty(record.kpi_list) ? record.kpi_list.map(item => <div key={item.id}>{item.show_str}
        <a onClick={() => { /* todo: 查看逻辑 */
          if (item.level || item.level_cn) {
            window.open(`/personnelManagement/kpiScore?kpi_id=${item.id}`, '_blank')
            return
          }
          message.error('暂未打分，无法查看')
        }}>
          查看
        </a>{
          record?.can_cancel &&
          <>&nbsp;|&nbsp;</>
        }{
          record?.can_cancel &&
          <a onClick={() => { /* todo: 撤回逻辑 */
            showConfirm(item)
          }}>
            撤回
          </a>
        }
      </div>) : "",
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInSearch: true,
      render: (_, record) => <Button type='primary' onClick={() => { /* todo: 打分逻辑 */
        setShowKpiTableList(true)
        setCurrentItem(record)
      }}>打分</Button>,
    },
    ...searchColumns
  ];

  const handleRequest = async (params: {
    // 分页参数
    pageSize?: number;
    page?: number;
    // 其他API请求参数
    [key: string]: any;
  }) => {
    params.page = params.current;
    setParams(params)
    try {
      const response: any = await getEmployeeListPage({
        ...params,
        kpi: 1, // 固定值
        year: year,
        quarter: quarter,
        // 这里添加其他请求参数
      });
      let data = response.data.data ?? []
      const total = response.data.total ?? 0
      if (!isEmpty(data)) {
        data = data.map(item => {
          if (has(item, 'children')) {
            unset(item, 'children')
          }

          return item
        })
      }

      return {
        data: data,
        total: total,
        success: true,
      };
    } catch (error) {
      const errMsg = (error as Error).message
      message.error(errMsg);
    }

  };

  // 当搜索表单的值改变时，更新年份和季度
  const handleFormSearchSubmit = (values: Record<string, any>) => {
    if (values.keyword) {
      setKeyword(values.keyword)
    }
    if (values.mobile) {
      setMobile(values.mobile)
    }
    if (values.level) {
      setLevel(values.level)
    }
    if (values.year) {
      setYear(values.year);
    }
    if (values.quarter) {
      setQuarter(values.quarter);
    }
  };

  const handleScoreOk = () => {
    if (kpiTableItem) {
      window.open(`/personnelManagement/kpiScore?eid=${currentItem.id}&year=${year}&quarter=${quarter}&kpi_table_id=${kpiTableItem}`, '_blank')
      return
    }
    message.error('请选择绩效考核表')
  }

  const showConfirm = (row) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled/>,
      content: '此操作将撤回该文件, 是否继续?',
      onOk() {
        delEmployeeKpi({kpi_id: row.id}).then(res => {
          if (res.success) {
            actionRef.current?.reload()
            message.success('撤回成功')
            return
          }
          message.error(res.message)
        })
      },
    });
  };

  const handleClear = () => {
    setSelectedRowKeys([])
  }

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
    getKpiTableListAll({is_delete: 0, use_for: 'hr'}).then(res => {
      if (res.success) {
        setKpiTableList(res.data.map(item => {
          return {
            value: item.id,
            label: item.title
          }
        }))
      }
    })
  }, [])

  return (
    <>
      <ProTable
        columns={columns}
        form={{
          form: form,
          onValuesChange: handleFormSearchSubmit,
        }}
        actionRef={actionRef}
        request={handleRequest}
        rowKey="id"
        pagination={{
          pageSize: 20,
        }}
        rowSelection={{
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        scroll={{x: 'max-content'}}
        toolBarRender={() => [
          <Button type='primary' key="batchAssign" onClick={() => {
            if (selectedRowKeys.length > 0) {
              setIsModalVisible(true)
              return
            }
            message.error('请选择人员')
          }}>
            批量分配
          </Button>,
          <DownloadButton type="primary" key="export"
                          onDownload={() =>
                            exportEmployeeKpi({
                              ...params,
                              kpi: 1,
                              year: year,
                              quarter: quarter,
                              keyword: keyword,
                              mobile: mobile,
                              level: level,
                            })
                          }
                          fileName={'员工绩效.xlsx'}>
            导出
          </DownloadButton>,
        ]}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      <BatchAssignModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false)
        }}
        actionRef={actionRef}
        handleClear={handleClear}
        selectedRowKeys={selectedRowKeys}
        year={year} // 这里传递year
        quarter={quarter} // 这里传递quarter
      />

      <Modal
        open={showKpiTableList}
        title="打分"
        onCancel={() => {
          setShowKpiTableList(false)
          setCurrentItem({})
          setKpiTableItem('')
        }}
        onOk={handleScoreOk}
        destroyOnClose={true}
      >
        <Form.Item label="选择绩效考核" style={{marginTop: 20}}>
          <Select options={kpiTableList} allowClear onChange={(e) => setKpiTableItem(e)}/>
        </Form.Item>
      </Modal>
    </>

  );
};

export default EmployeeScoreTable;
