// 引入 React, ProTable, request 方法, Modal, message 以及 Button 组件
import React, { useEffect, useRef, useState } from 'react';
import { ProTable, ActionType } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import { deleteKpiItem, getKpiItemListPage } from '@/services/ant-design-pro/kpi';
import { isEmpty, isNumber, isUndefined } from "lodash";
import KpiModal from "@/pages/PersonnelManagement/Performance/KPIAppraisalProject/components/KpiModal";
import { getStateMap, handleParseStateChange, setStateMap } from '@/utils/utils';
import { useLocation } from "@@/exports";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { isNumeric } from "mathjs";

// 定义列表项数据类型
type KpiItem = {
  kpi_item_id: number;
  item: string;
  score: string;
  info: { score_index: string; rate: number; content: string; }[];
  remark: string;
};

const KPIAppraisalProject: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<KpiItem | null>(null);

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 处理编辑按钮点击事件
  const handleEdit = (record: KpiItem) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  function isGreaterThanOrEqualToZero(value: any): boolean {
    // 检查undefined和NaN
    if (isUndefined(undefined) || isNaN(value)) {
      return false;
    }

    // 处理数字和可以转换成数字的字符串
    if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
      const number = Number(value);
      return !isNaN(number) && number >= 0;
    }

    // 其他所有情况
    return false;
  }





  // 定义 ProTable 列
  const columns: any = [
    {
      title: 'ID',
      valueType: 'index',
      dataIndex: 'kpi_item_id',
      width: 50,
      hideInSearch: true,
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'kpi_item_id',
    //   key: 'kpi_item_id',
    //   search: false
    // },
    {
      title: '考核项目',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      search: false
    },
    {
      title: '细分指标',
      dataIndex: 'info',
      key: 'info',
      search: false,
      render: (_, record: KpiItem) => (
        <>

          {record.info.map((item, index) => {
            return <div key={index} style={{ overflow: 'hidden' }}>
              {isEmpty(item) || isGreaterThanOrEqualToZero(item.rate) ? '0%' :
                (<>
                  <div style={{ float: 'left', width: '100px' }}>{item.score_index}</div>
                  <div style={{ float: 'left', width: '50px' }}>{item.rate}%</div>
                  <div style={{ float: 'left', width: '350px' }}>{item.content}</div>
                </>)}
            </div>
          })}

          {/*{record.info.map((info, index) => {*/}
          {/*  */}
          {/*  return <div key={index} style={{overflow: 'hidden'}}>*/}
          {/*        {isEmpty(info) || isEmpty(info.rate) ? '0%' :*/}
          {/*          (<>*/}
          {/*            <div style={{float: 'left', width: '100px'}}>{info.score_index}</div>*/}
          {/*            <div style={{float: 'left', width: '50px'}}>{info.rate}%</div>*/}
          {/*            <div style={{ float: 'left', width: '350px' }}>{info.content}</div>*/}
          {/*          </>) }*/}
          {/*      </div>*/}
          {/*})}*/}
        </>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'operation',
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>编辑</Button>
          <DeleteButton danger onConfirm={() => handleDeleteKpiItem(record)}>删除</DeleteButton>
        </Space>
      ),
    },
    {
      title: "是否删除",
      dataIndex: 'is_del',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: [
          {
            value: 'true',
            label: '已删除',
          },
          {
            value: 'false',
            label: '未删除',
          }
        ],
        defaultValue: 'false'
      },
    }
  ];

  const handleDeleteKpiItem = async (value: any) => {
    try {
      console.log('v', value)
      const res = await deleteKpiItem(value.kpi_item_id ?? 0)
      if (!res.success) {
        message.success('删除失败!' + res.message)
        return
      }
      message.success('删除成功!')
      actionRef?.current?.reload()
    } catch (err) { }
  }

  const handleValueChange: any = (path: string, value: any) => {
    const newData = handleParseStateChange(currentRecord, path, value)
    if (path.indexOf('rate') !== -1 && !newData.baseData.score) {
      message.error('请输入分数')
      return false
    }

    // const totalRate = newData.baseData.info.reduce((rate, currentInfo) => {
    //   return rate + currentInfo.rate
    // }, 0)
    // if (Number(newData.baseData.score) !== Number(totalRate) && path.indexOf('rate') !== -1) {
    //   message.error('权重之和必须等于分数')
    // }

    setCurrentRecord(newData)
  };

  const changeCurrentRecord = (data) => {
    setCurrentRecord(data)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);
  return (
    <>
      <ProTable<KpiItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          params = {
            ...params,
            is_del: params.is_del ?? 'false',
            kpi_item: params.item
          }
          // 调整参数以匹配API期望的格式
          const response = await getKpiItemListPage({
            ...params,
            use_for: 'hr', // 此项固定
            month: new Date().getMonth() + 1, // 当前月份
            year: new Date().getFullYear(), // 当前年份
          });
          if (response.success) {
            return {
              data: response.data.list,
              total: response.data.total,
              success: true,
            };
          } else {
            message.error('获取数据失败');
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
        rowKey="kpi_item_id"
        search={{
          defaultCollapsed: false,
        }}
        toolbar={{
          actions: [
            <Button className="green-button" key="new" type="primary" onClick={() => setIsModalOpen(true)}>
              新增
            </Button>,
          ],
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />
      <KpiModal
        visible={isModalOpen}
        currentRecord={{ ...currentRecord, type: 'hr' }}
        onValueChange={handleValueChange}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentRecord(null)
        }}
        changeCurrentRecord={changeCurrentRecord}
        actionRef={actionRef}
      />
    </>
  );
};

export default KPIAppraisalProject;
