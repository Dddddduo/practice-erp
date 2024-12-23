import React, { useEffect, useState, RefObject } from "react"
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from "@@/exports";
import { Button, Tag, Form, Modal, Drawer } from "antd";
import { PlusOutlined, WarningTwoTone } from "@ant-design/icons";
import { getMarketList, getShopList, getWorkerList, getMaCateList } from "@/services/ant-design-pro/report";
import { isEmpty } from "lodash";
import { SearchType } from "..";
import ReimOrderDetail from "../../Reimbursement/components/ReimOrderDetail";
import { getReimInfo } from '@/services/ant-design-pro/reimbursement';
import Assign from "./Assign";
import OrderDetail from "./OrderDetail";
import RepairDetail from "./RepairDetail";
import Operate from "./Operate";
import QuoDetail from "../../Quotation/components/QuoDetail";
import { approveQuo } from "@/services/ant-design-pro/quotation";
import CreateOrder from "./CreateOrder";
import CreateReport from "../../Report/components/CreateReport";
import { useLocation } from "umi";
import {getStateMap, setStateMap} from "@/utils/utils";

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

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;


interface ItemListProps {
  onListData: HandleListDataFunc;
  searchData: {
    brands: Array<any>
    cities: Array<any>
    markets: Array<any>
    shops: Array<any>
    workTypes: Array<any>
    repairCategories: Array<any>
    orderStatus: Array<any>
    reimStatus: Array<any>
    isHasSign: Array<any>
    isQuoStatus: Array<any>
    searchEvent: Array<any>
    directors: Array<any>
    quotationType: any
  }
  onRowSelected
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  onListData,
  searchData,
  onSearchSelectedChild,
  actionRef,
  onRowSelected,
  success,
  error
}) => {
  const [form] = Form.useForm();
  const intl = useIntl()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code') ?? '';
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [currentOrder, setCurrentOrder]: any = useState()
  const [showReportDetail, setShowReportDetail] = useState(false)
  const [currentReport, setCurrentReport] = useState()
  const [currentAssign, setCurrentAssign] = useState('')
  const [repairDetail, setRepairDetail] = useState()
  // 是否显示详情
  const [showReimOrderDetailDrawer, setShowReimOrderDetailDrawer] = useState(false)
  const [currentReimMessage, setCurrentReimMessage] = useState<API.ReimbursementListItem>()
  const [showRepairDetail, setShowRepairDetail] = useState(false)
  const [openOperateDrawer, setOpenOperateDrawer] = useState(false)
  // 工人列表
  const [workerList, setWorkerList] = useState()
  const [showAssign, setShowAssign] = useState(false)
  const [showQuoDetail, setShowQuoDetail] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const handleReset = () => {
    onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
    onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
  }
  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city_cn'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };
    console.log(changedValues);

    let shopData: [] = [];
    if ('' !== shopParams['city_id'] || '' !== shopParams['brand_id'] || '' !== shopParams['market_id']) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city_cn' in changedValues) {
      const marketResponse = await getMarketList({ city_id: changedValues.city_cn });
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city_cn' in changedValues || 'market_cn' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }

    // 工作类型切换
    if ('ma_type_cn' in changedValues) {
      form.setFieldsValue({ ma_cate_cn: undefined });
      const categoryResponse = await getMaCateList({ p_type: changedValues.ma_type_cn });
      if (categoryResponse.success) {
        onSearchSelectedChild(SearchType.LoadData, 'repairCategories', categoryResponse.data);
      }
    }
  }

  const getWorker = async () => {
    const res = await getWorkerList()
    setWorkerList(res.data)
  }

  const columns: ProColumns<API.OrderListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="orderList.field.order_no"
          defaultMessage="订单号"
        />
      ),
      dataIndex: 'supplier_order_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <a onClick={() => openOrderDetail(entity)}>{dom}</a>
        )
      },
      initialValue: code
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.brand_en"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.brands?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.brand_en };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          form.setFieldsValue({ market_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.city_cn"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_cn',
      valueType: 'select',
      align: 'center',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.city_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          form.setFieldsValue({ market_cn: undefined });
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
          id="orderList.field.market_cn"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market_cn',
      valueType: 'select',
      align: 'center',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.market_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.store_cn"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.name_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.company_en"
          defaultMessage="公司"
        />
      ),
      search: false,
      align: 'center',
      dataIndex: 'company_en',
    },
    {
      title: (
        <FormattedMessage
          id="report.field.workType"
          defaultMessage="保修类型"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "ma_type_cn",
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.workTypes?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.value };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          console.log(key, option);
          form.setFieldsValue({ ma_cate_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'repairCategories', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.ma_type"
          defaultMessage="保修类目"
        />
      ),
      dataIndex: 'ma_cate_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.repairCategories?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: '' === item.cn_name ? item.en_name : item.cn_name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          <a onClick={() => openRepairDetailModal(entity)}>{entity?.details?.ma_cate_cn}</a>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.assign"
          defaultMessage="指派施工负责人"
        />
      ),
      dataIndex: 'assign',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.directors?.reduce((acc, item) => {
        acc[`${item.worker_id}`] = { text: item.worker };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      },
      render: (dom, entity) => {
        return (
          <>
            {
              entity?.assign?.value === '/' ? '' :
                <a onClick={() => openAssignModal(entity?.assign, entity?.details?.ma_item_supplier_id)}>{entity?.assign?.value}</a>
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.orderStatus"
          defaultMessage="指派单状态"
        />
      ),
      dataIndex: 'orderStatus',
      align: 'center',
      valueType: 'select',
      hideInTable: true, // 在表格中隐藏
      valueEnum: searchData.orderStatus?.reduce((acc, item) => {
        acc[`${item.k}`] = { text: item.v };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <Button type="primary" onClick={() => showOperate(entity)}>操作</Button>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.supplier_order_no"
          defaultMessage="报销单编号"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <a onClick={() => showReimDetail(entity?.reim_info)}>{entity?.reim_info?.reim_no}</a>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.reimbursementState"
          defaultMessage="报销单状态"
        />
      ),
      dataIndex: 'reimbursementState',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.reimStatus?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.value };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          entity?.reim_info?.value &&
          <Tag color={entity?.reim_info?.color}>{entity?.reim_info?.value}</Tag>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.appo_at"
          defaultMessage="完工时间"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <div>{entity?.reim_info?.completed_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="report.field.isHasSign"
          defaultMessage="是否有签单"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "sign_ids",
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.isHasSign?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="order.field.isQuoStatus"
          defaultMessage="是否有报价"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "quo_status",
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.isQuoStatus?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.quotation_type"
          defaultMessage="报价分类"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'quotation_type',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.quotationType?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.report"
          defaultMessage="报告单"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity?.report_list.map((item, index) => {
                return (
                  <a onClick={() => openReportDetail(entity, item.report_id)}>
                    {item.report_no}<br />
                  </a>
                )
              })
            }
            <div>
              <Button type="primary" onClick={() => openReportDetail(entity, undefined)}>创建报告单</Button>
            </div>
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.reimDetail"
          defaultMessage="报销明细"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          entity?.reim_info && entity?.reim_info?.reim_worker_detail_list &&
          entity?.reim_info?.reim_worker_detail_list.map((item, index) => {
            return (
              <span key={index}>{item.worker_name} | {item.cost_price}</span>
            )
          })
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.reimTotalPrice"
          defaultMessage="报销总价"
        />
      ),
      dataIndex: 'order_ma_reim_total_price',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.quoNo"
          defaultMessage="报价编号"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          entity.quo_no ?
            <a onClick={() => openQuoDetail(entity)}>{entity.quo_no}</a> :
            <Button type="primary" onClick={openQuoDetail}>创建报价单</Button>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.quoStatus"
          defaultMessage="报价审核状态"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.quo_status === ('create' || 'reject_brand') &&
              <Button type="primary" onClick={() => openDialog(entity, 'submit_brand')}>提交给客户端</Button>
            }
            {
              entity.quo_status === ('agree_brand' || 'reject_finance') &&
              <Button type="primary" onClick={() => openDialog(entity, 'submit_finance')}>提交给财务</Button>
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.total_price"
          defaultMessage="报价总金额"
        />
      ),
      dataIndex: 'total_price',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.profit_rate"
          defaultMessage="报价利润率"
        />
      ),
      dataIndex: 'profit_rate',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              dom !== '-' &&
              <span>{dom}%</span>
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="orderList.field.time_cost"
          defaultMessage="报修时间"
        />
      ),
      dataIndex: 'time_cost',
      align: 'center',
      valueType: 'dateRange',
    },
    {
      title: (
        <FormattedMessage
          id="order.field.isEvent"
          defaultMessage="是否活动"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "searchEvent",
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.searchEvent?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
  ]

  // 打开订单
  const openOrderDetail = (entity) => {
    console.log('eneeeee', entity);

    setCurrentOrder(entity)
    setShowOrderDetail(true)
  }

  const closeOrderDetail = () => {
    setCurrentOrder(undefined)
    setShowOrderDetail(false)
  }

  const openRepairDetailModal = (entity) => {
    setRepairDetail(entity)
    setShowRepairDetail(true)
  }

  const closeRepairDetailModal = () => {
    setShowRepairDetail(false)
  }

  const showOperate = (entity) => {
    setCurrentOrder(entity)
    setOpenOperateDrawer(true)
  }

  const onCloseOperateDrawer = () => {
    setCurrentOrder(undefined)
    setOpenOperateDrawer(false)
  }

  const openQuoDetail = (entity) => {
    setCurrentReport(entity)
    setShowQuoDetail(true)
  }

  const onCloseDetail = () => {
    setShowQuoDetail(false)
  }

  // 打开报销单详情
  const showReimDetail = async (entity) => {
    const { data } = await getReimInfo({ reim_id: entity.id })
    if (data && data.reim_detail_list) {
      data.reim_detail_list.map(item => {
        item.key = item.reim_detail_id
        return item
      })
    }
    setCurrentReimMessage(data)
    setShowReimOrderDetailDrawer(true)
  }

  // 关闭报销单详情
  const onCloseReimDetailDrawer = () => {
    setShowReimOrderDetailDrawer(false)
  }

  const openAssignModal = (entity, ma_item_supplier_id) => {
    setCurrentAssign({ ...entity, ma_item_supplier_id })
    setShowAssign(true)
  }

  const closeAssignModal = () => {
    setShowAssign(false)
  }

  const openReportDetail = (entity, report_id) => {
    setCurrentReport({ ...entity, report_id })
    setShowReportDetail(true)
  }

  const handleCloseCreateReport = () => {
    setShowReportDetail(false)
  }

  const openDialog = (entity, status) => {
    console.log(entity);

    setCurrentOrder({ ...entity, status })
    setShowDialog(true)
  }

  const handleOk = () => {
    const params = {
      quo_ids: currentOrder?.quo_id ?? '',
      user_type: 'brand_admin',
      status: currentOrder?.status ?? ''
    }
    approveQuo(params).then(res => {
      if (res.success) {
        setCurrentOrder(undefined)
        setShowDialog(false)
        actionRef.current?.reload()
        success('提交成功')
        return
      }
      error(res.message)
    })
  }

  const handleCloseCreateOrder = () => {
    setShowCreateOrder(false)
  }

  const closeCreateOrderDetail = () => {
    setShowCreateOrder(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getWorker()
  }, [])

  return (
    <>
      <ProTable<API.OrderListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'orderList.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        // rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowCreateOrder(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columnEmptyText={false}
        columns={columns}
        request={onListData}
        rowSelection={{
          onChange: onRowSelected
        }}
        form={{
          form,
          onValuesChange: handleSearchValuesChange
        }}
        onReset={handleReset}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      {/* 创建订单 */}
      <Drawer
        width={800}
        title="创建订单"
        open={showCreateOrder}
        onClose={handleCloseCreateOrder}
      >
        <CreateOrder
          actionRef={actionRef}
          brandList={searchData?.brands}
          cityList={searchData?.cities}
          closeOrderDetail={closeCreateOrderDetail}
        />
      </Drawer>

      {/* 订单号 */}
      <Drawer
        width={600}
        closable={false}
        destroyOnClose={true}
        open={showOrderDetail}
        onClose={closeOrderDetail}
      >
        <OrderDetail
          actionRef={actionRef}
          currentOrder={currentOrder}
          brandList={searchData?.brands}
          cityList={searchData?.cities}
          closeOrderDetail={closeOrderDetail}
        />
      </Drawer>

      {/* 客户保修详情 */}
      <Modal
        open={showRepairDetail}
        onCancel={closeRepairDetailModal}
        width={600}
        footer={null}
        destroyOnClose={true}
      >
        <RepairDetail
          actionRef={actionRef}
          repairDetail={repairDetail}
          closeRepairDetailModal={closeRepairDetailModal}
        />
      </Modal>

      {/* 指派工人 */}
      <Modal
        open={showAssign}
        onCancel={closeAssignModal}
        width={600}
        footer={null}
        destroyOnClose={true}
      >
        <Assign
          actionRef={actionRef}
          workerList={workerList}
          currentAssign={currentAssign}
          closeAssignModal={closeAssignModal}
        />
      </Modal>

      <Drawer
        width={600}
        closable={false}
        destroyOnClose={true}
        open={openOperateDrawer}
        onClose={onCloseOperateDrawer}
      >
        <Operate
          actionRef={actionRef}
          workerList={workerList}
          currentOrder={currentOrder}
        />
      </Drawer>

      {/* 报销单 */}
      <Drawer
        width={600}
        closable={false}
        destroyOnClose={true}
        open={showReimOrderDetailDrawer}
        onClose={onCloseReimDetailDrawer}
      >
        <ReimOrderDetail
          actionRef={actionRef}
          currentReimMessage={currentReimMessage}
          workerList={workerList}
          onCloseReimDetailDrawer={onCloseReimDetailDrawer}
        />
      </Drawer>

      <Drawer
        width={800}
        title="报告单详情"
        destroyOnClose={true}
        open={showReportDetail}
        onClose={handleCloseCreateReport}
        maskClosable={false}
      >
        {/* <ReportDetail
          currentReport={currentReport}
          handleCloseCreateReport={handleCloseCreateReport}
        /> */}
        <CreateReport
          handleCloseCreateReport={handleCloseCreateReport}
          actionRef={actionRef}
          currentItem={currentReport}
        />
      </Drawer>

      <Drawer
        width={1400}
        title="报价单"
        destroyOnClose={true}
        open={showQuoDetail}
        onClose={onCloseDetail}
      >
        <QuoDetail
          currentItem={currentReport}
          onCloseDetail={onCloseDetail}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Drawer>

      <Modal
        open={showDialog}
        onOk={handleOk}
        onCancel={() => setShowDialog(false)}
        destroyOnClose
      >
        <WarningTwoTone twoToneColor="red" />
        <p style={{ height: '50px', lineHeight: '50px' }}>
          确定要提交给
          {
            currentOrder?.quo_status === ('create' || 'reject_brand') &&
            <span style={{ fontWeight: 700, color: 'red' }}>客户端</span>
          }
          {
            currentOrder?.quo_status === ('agree_brand' || 'reject_finance') &&
            <span style={{ fontWeight: 700, color: 'red' }}>财务</span>
          }
          吗？
        </p>
      </Modal>
    </>
  )
}

export default ItemList
