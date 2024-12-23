import React, {RefObject, useEffect, useRef, useState} from "react";
import {useLocation} from 'umi';
import {ParamsType, ProColumns, ProTable, ActionType} from '@ant-design/pro-components';
import {Button, Drawer, Form, Input, Space, Tag, message, Popconfirm, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage, useIntl} from "@@/exports";
import {
  lockReportStatus,
  getMaCateList,
  getMarketList,
  getShopList, getChooseOrder, getAllIdByOrderId
} from "@/services/ant-design-pro/report";
import {isEmpty} from "lodash";
import {SearchType} from "@/pages/Order/Report";
import CreateReport from "./CreateReport";
import {createPdfFile, getFileOssUrl} from "@/services/ant-design-pro/quotation";
import {downloadFile, getStateMap, LocalStorageService, setStateMap} from "@/utils/utils";
import dayjs from "dayjs";
import DeleteButton from "@/components/Buttons/DeleteButton";
import {approveReport} from "@/services/ant-design-pro/orderList";
import NewTemplateList from "@/pages/Order/Report/components/new_model/newTemplateList";
import {produce} from "immer";
import  ChooseOrder  from "@/pages/Order/Report/components/ChooseOrder";
import BaseContainer, {ModalType} from "@/components/Container";
import OrderDetail from "@/pages/Order/Report/components/OrderDetail";

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleRowSelectionFunc = (keys: any, selectedRows: any[]) => void; // 根据实际情况替换 any

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  onListData: HandleListDataFunc;
  onRowSelected: HandleRowSelectionFunc;
  onSearchClick: (record: API.ReportListItem) => void;
  searchData: any,
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  selectedRowsState: any
}

const ItemList: React.FC<ItemListProps> = ({
                                             actionRef,
                                             onListData,
                                             onRowSelected,
                                             onSearchClick,
                                             searchData,
                                             onSearchSelectedChild,
                                             selectedRowsState
                                           }) => {
  const intl = useIntl();
  const timerId = useRef<any>();
  const [form] = Form.useForm();
  const [showCreateReport, setShowCreateReport] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>({})
  const [downloadLoadings, setDownloadLoadings] = useState<boolean[]>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [createOrUpdateText, setCreateOrUpdateText] = useState('创建报告单')

  // 选择订单开关
  const [chooseOrder , setChooseOrder] = useState(false)


  // 右侧弹出区域控制
  const [newTempData, setNewTempData] = useState<any>({
    report_id: 0,
    report_tid: 0,
    show: false,
    title: '',
    sign_value: 0,
  });

  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city_cn'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };

    let shopData: [] = [];
    if ('' !== shopParams['city_id'] || '' !== shopParams['brand_id'] || '' !== shopParams['market_id']) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city_cn' in changedValues) {
      const marketResponse = await getMarketList({city_id: changedValues.city_cn});
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city_cn' in changedValues || 'market_cn' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }

    // 工作类型切换
    if ('ma_type_cn' in changedValues) {
      form.setFieldsValue({ma_cate_cn: undefined});
      const categoryResponse = await getMaCateList({p_type: changedValues.ma_type_cn});
      if (categoryResponse.success) {
        onSearchSelectedChild(SearchType.LoadData, 'repairCategories', categoryResponse.data);
      }
    }

  }
  // unlocked locked
  const handleLockStatus = (currentRow: API.ReportListItem) => {
    const params = {
      report_id: currentRow?.id ?? 0,
      report_lock_status: (currentRow?.lock_status ?? '') === 'unlocked' ? 'locked' : 'unlocked'
    };

    lockReportStatus(params).then(response => {
      if (actionRef.current) {
        actionRef.current.reload();
      }

    })
  }

  const handleApproveReport = async (type: string, reportId: any) => {
    try {
      const params = {
        report_id: reportId,
        status: type ?? '',
      }
      const res = await approveReport(params)
      if (!res.success) {
        message.error(res.message)
        return
      }

      if (actionRef.current) {
        actionRef.current.reload();
      }
      message.success('操作成功')
    } catch (error) {
      message.error('操作异常')
    }
  }
  const reportTitleMap: { [key: number]: string } = {
    14: '空调维保报告',
    17: '内装巡检报告',
    18: '内装维保报告',
    19: '店铺电气检查报告',
    20: '客户巡检报告',
    21: '店铺电气检查报告',
    22: '内装巡检报告',
    23: '内装维保报告',
    24: '灯具维保报告',
    25: '半年度维保报告',
    26: '年度维保报告',
    27: '现场维修完工报告和检查报告',
    28: '季度维保报告',
  };
  const columns: ProColumns<API.ReportListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="report.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="report.field.no"
          defaultMessage="编号"
        />
      ),
      dataIndex: 'report_no',
      formItemProps: {
        // <FormattedMessage id="search.store" defaultMessage="编号" />
        label: "报告单编号"
      },
      editable: (text, record, index) => {
        return true; // 根据条件返回true或false来控制该行是否可编辑
      },
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              if (record.report_tid === 14 || record.report_tid >= 17) {
                const reportTitleSuffix = reportTitleMap[record.report_tid] || '默认报告标题'; // 默认值
                window.open(`/PDF/ReportPDF?report_id=${record.id}&report_tid=${record.report_tid}&report_title=${record.brand_en}-${record.store_cn}${reportTitleSuffix}`, '_blank');
              } else {
                setCurrentItem(record);
                setShowCreateReport(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '额外搜索项', // 这是你想要添加的额外搜索项标题
      dataIndex: 'extraSearch',
      search: false,
      hideInTable: true, // 在表格中隐藏
      valueType: 'select',
      renderFormItem: (item, {type, defaultRender, ...rest}, form) => {
        // 仅在搜索表单中渲染这个输入框
        return <Input placeholder="请输入"/>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.orderNo"
          defaultMessage="订单编号"
        />
      ),
      dataIndex: "supplier_order_no",
      search: false,
      render: (dom, entity) => {
        // console.log('查看详情--entity', entity);
        return (
          <a>
            <div
            onClick={() => {
              window.open(`/order/orderList?code=${entity.supplier_order_no}`, '_blank');
            }}
            >
              {dom}
            </div>

            {/*<Button*/}
            {/*  type={'primary'}*/}
            {/*  onClick={() => {*/}
            {/*    setShowDetail(true);*/}
            {/*    setCurrentItem(entity);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  创建报告单*/}
            {/*</Button>*/}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: "brand_en",
      valueType: 'select',
      valueEnum: searchData.brands?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          form.setFieldsValue({market_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: "city_cn",
      hideInTable: true, // 在表格中隐藏
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.city_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          form.setFieldsValue({market_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: "market_cn",
      hideInTable: true, // 在表格中隐藏
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.market_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.shop"
          defaultMessage="店铺"
        />
      ),
      dataIndex: "store_cn",
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.name_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.workType"
          defaultMessage="工作类型"
        />
      ),
      dataIndex: "ma_type_cn",
      valueType: 'select',
      valueEnum: searchData.workTypes?.reduce((acc, item) => {
        acc[`${item.type}`] = {text: item.name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ma_cate_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'repairCategories', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.maintenanceCategory"
          defaultMessage="维修类目"
        />
      ),
      dataIndex: "ma_cate_cn",
      valueType: 'select',
      valueEnum: searchData.repairCategories?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: '' === item.cn_name ? item.en_name : item.cn_name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: "status",
      search: false,
      render: (cur) => {
        return (
          <>
            {cur === 'worker_submit' && <Tag color={'warning'}>待审批</Tag>}
            {cur === 'manager_agree' && <Tag color={'success'}>已同意</Tag>}
            {cur === 'manager_reject' && <Tag color={'error'}>已拒绝</Tag>}
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="report.field.creator"
          defaultMessage="创建人"
        />
      ),
      dataIndex: "creator_name",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="report.field.createdAt"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: "create_at",
      sorter: false,
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="report.field.completedAt"
          defaultMessage="完工时间"
        />
      ),
      dataIndex: "completed_at",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="report.field.tplType"
          defaultMessage="模板类型"
        />
      ),
      dataIndex: "report_title",
      valueType: 'select',
      valueEnum: searchData.templateTypes?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.title};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.worker"
          defaultMessage="负责人"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "worker",
      valueType: 'select',
      valueEnum: searchData.directors?.reduce((acc, item) => {
        acc[`${item.worker_id}`] = {text: item.name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.lockType"
          defaultMessage="锁定"
        />
      ),
      dataIndex: "lock_status",
      search: false,
      render: (dom, entity) => {
        return (
          <Tag
            color={entity?.lock_status === 'unlocked' ? 'magenta' : 'green'}>{entity?.lock_status === 'unlocked' ? '未锁定' : '被锁定'}</Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'search',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <Space
          style={{minWidth: 200}}
        >
          {
            (record.report_tid === 14 || record.report_tid >= 17) &&
            <Button
              type="primary"
              key="lock"
              onClick={() => handleLockStatus(record)}
              danger={record?.lock_status === 'unlocked'}
            >
              {
                record?.lock_status === 'unlocked' ? '加锁' : '解锁'
              }
              {/* <FormattedMessage id="report.button.lock" defaultMessage="Lock" /> */}
            </Button>
          }
          <Button
            type="primary"
            key="config"
            onClick={() => {
              if (record.report_tid === 14 || record.report_tid === 25 || record.report_tid === 26 || record.report_tid === 28) {
                onSearchClick(record)
              } else if (record.report_tid >= 17) {
                console.log(record)

                let signValue = ''

                if (!isEmpty(record.sign_file_list)) {
                  signValue = record.sign_file_list.map(item => item.file_id).join(',')
                }

                setNewTempData({
                  report_id: record.id,
                  report_tid: record.report_tid,
                  show: true,
                  title: record.report_title,
                  sign_value: signValue,
                })

              } else {
                setCurrentItem(record);
                setCreateOrUpdateText('修改报告单')
                setShowCreateReport(true);
              }
            }}
          >
            <FormattedMessage id="report.button.search" defaultMessage="Configuration"/>
          </Button>
          {/* https://erp.zhian-design.com/#/report-pdf?report_id=10744&report_tid=14&report_title=GUCCI-%E5%89%8D%E6%BB%A9%E5%A4%AA%E5%8F%A4%E9%87%8C%E7%A9%BA%E8%B0%83%E7%BB%B4%E4%BF%9D20231106 */}
          {
            record.report_tid === 14 &&
            <Button
              type="primary"
              key="pdf"
              // href={`https://erp.zhian-design.com/#/report-pdf?report_id=${record.id}&report_tid=${record.report_tid}&report_title=${record.brand_en + '-' + record.store_cn}空调维保报告` + dayjs().format('YYYY-MM-DD')}
              // target="_blank"
              onClick={() => {
                if (record.brand_id === 9) {
                  window.open(`/PDF/ReportPDF?report_id=${record.id}&report_tid=${record.report_tid}&report_title=${record.brand_en + '-' + (record.abbreviate ?? '') + record.store_cn}空调维保报告`, '_blank')
                } else {
                  window.open(`/PDF/ReportPDF?report_id=${record.id}&report_tid=${record.report_tid}&report_title=${record.brand_en + '-' + record.store_cn}空调维保报告`, '_blank')
                }
              }}
            >
              <FormattedMessage id="report.button.pdf" defaultMessage="PDF"/>
            </Button>
          }

          {/* 将大于模版16的，统一加上PDF预览 */}
          {
            record.report_tid > 16 &&
            <Button
              type={'primary'}
              key={'pdf'}
              onClick={() => {
                const reportTitleSuffix = reportTitleMap[record.report_tid] || '默认报告标题'; // 默认值
                window.open(`/PDF/ReportPDF?report_id=${record.id}&report_tid=${record.report_tid}&report_title=${record.brand_en}-${record.store_cn}${reportTitleSuffix}`, '_blank');

              }}
            >
              <FormattedMessage id="report.button.pdf" defaultMessage="PDF"/>
            </Button>
          }

          {/*  同意和拒绝 */}
          {
            (record.status === 'worker_submit' || record.status === 'manager_reject') && <DeleteButton
              type="primary"
              className="green-button"
              onConfirm={() => handleApproveReport('manager_agree', record.id)}
              title="确认通过吗？"
            >
              通过
            </DeleteButton>
          }

          {
            (record.status === 'worker_submit' || record.status === 'manager_agree') && <DeleteButton
              type="primary"
              danger
              onConfirm={() => handleApproveReport('manager_reject', record.id)}
              title="确认拒绝吗？"
            >
              拒绝
            </DeleteButton>
          }
        </Space>
      ),
    },
  ];

  const handleCloseCreateReport = () => {
    setShowCreateReport(false)
    setCurrentItem({})
  }

  const handleDownload = (index: number) => {
    if (selectedRowsState.length > 0) {
      setDownloadLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
      createPdfFile({
        pdf_type: 'zip_worker_report',
        pdf_info: selectedRowsState.map(item => {
          return {
            file_name: `${item.brand_en}${item.store_cn}${item.report_user_title}`,
            report_id: item.id,
          }
        })
      }).then(res => {
        timerId.current = setInterval(async () => {
          await getFileOssUrl({download_token: res.data}).then(ossResult => {
            console.log(ossResult);
            if (ossResult.data) {
              downloadFile(ossResult.data, dayjs().format('YYYY-MM-DD') + '.zip');
              setDownloadLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
              });
              clearInterval(timerId.current);
              message.success('下载成功');
            }
          })
          if (!downloadLoadings) {
            return false
          }
        }, 1000)
      })
      return
    }
    message.error('请选择报告单')
  }



  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    return () => {
      if (timerId) clearInterval(timerId.current)
    }
  }, [])

  return (
    <>
      <ProTable<API.ReportListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'report.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        //  y: 200
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="primary"
            type="primary"
            onClick={() => {
              setChooseOrder(true);
              setCreateOrUpdateText('选择创建订单');
            }}
          >
            选择并创建订单
          </Button>,
          <Button
            type="primary"
            key="primary"
            loading={downloadLoadings[1]}
            onClick={() => handleDownload(1)}
          >
            批量下载
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowCreateReport(true);
              setCreateOrUpdateText('创建报告单');
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={onListData}
        columnEmptyText={false}
        columns={columns}
        rowSelection={{
          onChange: onRowSelected,
        }}
        form={{
          onValuesChange: handleSearchValuesChange,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState);
            setStateMap(pathname, newState);
          },
        }}
      />

      <Drawer
        open={showCreateReport}
        width={800}
        destroyOnClose={true}
        title={createOrUpdateText}
        onClose={handleCloseCreateReport}
        maskClosable={false}
      >
        <CreateReport
          handleCloseCreateReport={handleCloseCreateReport}
          actionRef={actionRef}
          currentItem={currentItem}
          type="report"
        />
      </Drawer>

      <Drawer
        width={600}
        onClose={() => {
          setNewTempData(
            produce((draft) => {
              draft.show = false;
            }),
          );
        }}
        // closable={false}
        open={newTempData.show}
        destroyOnClose={true}
        title={newTempData.title}
      >
        <NewTemplateList params={newTempData}/>
      </Drawer>

      {/*选择订单*/}
      <BaseContainer
        width={800}
        type={ModalType.Drawer}
        title={createOrUpdateText}
        open={chooseOrder}
        onCancel={() => setChooseOrder(false)}
        destroyOnClose={true}
      >
        <ChooseOrder
          actionRef={actionRef}
          currentItem={currentItem}
          handleCloseOrderDetail={() => {
            setChooseOrder(false);
          }}
        />
      </BaseContainer>

      {/*<BaseContainer*/}
      {/*  title={'订单详情'}*/}
      {/*  type={ModalType.Drawer}*/}
      {/*  open={showDetail}*/}
      {/*  width={800}*/}
      {/*  onClose={() => {*/}
      {/*    setShowDetail(false);*/}
      {/*    setSelectedOrder(null)*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <OrderDetail*/}
      {/*    selectedOrder={selectedOrder}*/}
      {/*    actionRef={actionRef}*/}
      {/*    currentItem={currentItem}*/}
      {/*    handleCloseOrderDetail={() => setShowDetail(false)}*/}
      {/*  />*/}
      {/*</BaseContainer>*/}
    </>
  );

}

export default ItemList;
