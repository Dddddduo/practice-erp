import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Form, Input, Table, Checkbox, Switch } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import { DragSortTable } from '@ant-design/pro-components';
import { getKpiTableListPage, updateKpiTableItemIds, getKpiTableInfo, createKpiTable, getKpiItemListAll, delKpiTable, updateKpiShare } from '@/services/ant-design-pro/kpi';
import {isEmpty, isObject} from 'lodash';
import { useLocation } from "@@/exports";
import { getStateMap, setStateMap } from "@/utils/utils";

const { confirm } = Modal;

interface KpiTableListItem {
  kpi_table_id: number;
  title: string;
  remark: string;
  create_at: string;
  is_checked: boolean;
}

interface KpiItemDetail {
  id: number;
  item: string;
  score: string;
  info: { score_index: string; rate: number; content: string }[];
}

/**
 * 绩效考核表Table列表
 * @constructor
 */
const KpiTableList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('view'); // 'view' or 'add'
  const [kpiTableDetails, setKpiTableDetails] = useState<KpiItemDetail[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [switchLoading, setSwitchLoading] = useState<boolean>(false);
  const [kpiId, setKpiId] = useState(0)

  const showDeleteConfirm = (kpi_table_id: number) => {
    confirm({
      title: '确定删除这条记录吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复',
      onOk() {
        delKpiTable({ kpi_table_id })
          .then((res: any) => {
            if (res.success) {
              message.success('删除成功');
              actionRef.current?.reload()
              // 刷新列表
            } else {
              message.error('删除失败');
            }
          })
          .catch(() => {
            message.error('删除失败');
          });
      },
    });
  };

  const showViewModal = (kpi_table_id: number) => {
    setKpiId(kpi_table_id)
    getKpiTableInfo({ kpi_table_id }).then((res: any) => {
      if (res.success) {

        setKpiTableDetails(res.data.kpi_item_list.filter(item => item.id) ?? []);
        setModalType('view');
        setIsModalOpen(true);
        form.setFieldsValue(res.data)

      } else {
        message.error('获取详情失败');
      }
    });
  };

  const showAddModal = () => {
    getKpiItemListAll({ use_for: 'hr' }).then((res: any) => {
      if (res.success) {
        setKpiTableDetails(res.data);
        setModalType('add');
        setIsModalOpen(true);
      } else {
        message.error('获取项目列表失败');
      }
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { title, remark, desc } = values;
      let item_ids = kpiTableDetails
        .filter((item) => form.getFieldValue(`checked_${item.id}`))
        .map((item) => item.id)
        .join(',');

      // 验证分数之和是否为100
      const totalScore = kpiTableDetails
        .filter((item) => form.getFieldValue(`checked_${item.id}`))
        .reduce((sum, item) => sum + Number(item.score), 0);

      if (totalScore !== 100 && modalType === 'add') {
        message.error('所有勾选项对应的score求和必须等于100');
        return;
      }

      if (modalType === 'add') {
        createKpiTable({ title, remark, desc, item_ids, use_for: 'hr' })
          .then((res: any) => {
            if (res.success) {
              message.success('创建成功');
              setIsModalOpen(false);
              form.resetFields();
              actionRef.current?.reload()
              // 刷新列表
            } else {
              message.error('创建失败');
            }
          })
          .catch(() => {
            message.error('创建失败');
          });
        return
      }
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    setKpiId(0)
    setIsModalOpen(false);
    form.resetFields();
  };

  /**
   * 分享Switch切换
   * @param val
   * @param record
   */
  const handleSwitchChange = async (val, record) => {
    const kpiTableId = record?.kpi_table_id ?? 0
    const shareVal = val ? 1 : 0;
    const hide = message.loading('loading...');
    try {
      setSwitchLoading(true);
      const result = await updateKpiShare(kpiTableId, { is_share: shareVal })
      if (result.success) {
        message.success('操作成功');
        return
      }

      message.error('操作失败');
    } catch (err) {
      message.error('操作异常：' + (err as Error).message);
    } finally {
      hide()
      actionRef.current?.reload()
      setSwitchLoading(false)
    }
  }

  const columns: ProColumns<KpiTableListItem>[] = [
    {
      title: 'ID',
      valueType: 'index',
      dataIndex: 'kpi_table_id',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      search: false
    },
    {
      title: '分享',
      dataIndex: '',
      key: 'share',
      search: false,
      render: (text, record) => {
        return <Switch loading={switchLoading} onChange={(val) => handleSwitchChange(val, record)} checked={record.is_checked} />
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Button type='primary' key="view" onClick={() => showViewModal(record.kpi_table_id)}>查看</Button>,
        <Button key="delete" type="primary" danger onClick={() => showDeleteConfirm(record.kpi_table_id)}>删除</Button>,
      ],
    },
  ];

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setKpiTableDetails(newDataSource);

    if (kpiId) {
      try {
        const params = {
          id: kpiId ?? 0,
          item_ids: isEmpty(newDataSource) ? [] : newDataSource?.map(item => item.id)
        }
        updateKpiTableItemIds(params).then(res => {
          if (res.success) {
            message.success('修改顺序成功')
            return
          }
          message.success(res.message)
        })
      } catch (err) {
        message.success('修改顺序异常')
      }
    }
  };

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))

  }, []);

  return (
    <>
      <ProTable<KpiTableListItem>
        columns={columns}
        // request={(params) => getKpiItemListPage(params)}
        request={async (params) => {
          // params = {
          //   ...params,
          //   kpi_item:  params.item
          // }
          // 调整参数以匹配API期望的格式
          const response: any = await getKpiTableListPage({
            ...params,
            is_delete: 0,
            use_for: 'hr', // 此项固定
            month: new Date().getMonth() + 1, // 当前月份
            year: new Date().getFullYear(), // 当前年份
          });
          if (response.success) {
            console.log("response", response)
            return {
              data: response.data.list.map(item => {
                return {
                  ...item,
                  is_checked: 0 !== item.is_share,
                }
              }),
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
        rowKey="kpi_table_id"
        search={{
          labelWidth: 'auto',
        }}
        actionRef={actionRef}
        toolbar={{
          actions: [
            <Button key="add" type="primary" onClick={showAddModal}>
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
      <Modal
        title={modalType === 'view' ? '查看' : '新增'}
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
        width={"80%"}
        destroyOnClose={true}
        style={{ top: 30 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: modalType === 'add', message: '请输入标题' }]}>
            <Input disabled={modalType === 'view'} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input disabled={modalType === 'view'} />
          </Form.Item>
          <Form.Item name="desc" label="说明">
            <Input.TextArea disabled={modalType === 'view'} />
          </Form.Item>

          <DragSortTable
            dataSource={kpiTableDetails}
            columns={[
              {
                title: '排序',
                dataIndex: 'sort',
                width: 60,
                className: 'drag-visible',
              },
              {
                title: '打分项',
                dataIndex: 'item',
                key: 'item',
              },
              {
                title: '分数',
                dataIndex: 'score',
                key: 'score',
              },
              {
                title: '细分指标',
                key: 'info',
                dataIndex: 'info',
                render: (item, record) => {
                  return (
                    record?.info?.map((info) => {
                      let formatInfo
                      formatInfo = !isObject(info) ? JSON.parse(info) : info
                      return (
                        <div
                          key={formatInfo.score_index}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ float: 'left', width: '120px' }}>{formatInfo.score_index ? formatInfo.score_index : ""}</div>
                          <div style={{ float: 'left', width: '80px' }}>{formatInfo.rate ? '(' + formatInfo.rate + '%' + ')' : ''}</div>
                          <div style={{ float: 'left', width: '350px' }}>{formatInfo.content ? formatInfo.content : ''}</div>
                        </div>
                      )
                    })
                  )
                },
              },
              {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
              },
              ...(modalType === 'add'
                ? [
                  {
                    title: '选择',
                    key: 'action',
                    render: (_, record) => (
                      <Form.Item name={`checked_${record.id}`} valuePropName="checked" initialValue={false} noStyle>
                        <Checkbox />
                      </Form.Item>
                    ),
                  },
                ]
                : []),
            ]}
            rowKey="id"
            search={false}
            pagination={false}
            dragSortKey="sort"
            onDragSortEnd={handleDragSortEnd}
            options={false}
          />
        </Form>
      </Modal>
    </>
  );
};

export default KpiTableList;
