import React, { useEffect, useState, RefObject } from "react"
import { Button, Tag, Modal, Drawer, Form, message } from 'antd'
import { DownloadOutlined } from "@ant-design/icons";
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from "@@/exports";
import { getReimHistoryList, getReimInfo, getReimExcelList } from '@/services/ant-design-pro/reimbursement';
import { getMarketList, getShopList } from "@/services/ant-design-pro/report";
import ReimHistory from "./ReimHistory";
import ReimOrderDetail from "./ReimOrderDetail";
import { getWorkerList } from '@/services/ant-design-pro/report';
import { isEmpty } from "lodash";
import { SearchType } from "..";
import Application from "./Application";
import type { SelectProps } from 'antd';
import { getUploadToken } from "@/services/ant-design-pro/quotation";
import { downloadFile, getStateMap, LocalStorageService, setStateMap } from "@/utils/utils";
import OSS from 'ali-oss'
import { useLocation } from 'umi';

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleRowSelectionFunc = (keys: any, selectedRows: any[]) => void; // 根据实际情况替换 any

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  onListData: HandleListDataFunc;
  searchData: [],
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  actionRef: RefObject<ActionType>;
  exportParams
  onRowSelected: HandleRowSelectionFunc;
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
}

/**
 * 报销单组件列表
 * @constructor
 */
const ItemList: React.FC<ItemListProps> = ({
  onListData,
  searchData,
  onSearchSelectedChild,
  actionRef,
  exportParams,
  onRowSelected,
  selectedRowsState,
  success,
  error
}) => {
  const intl = useIntl()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [form] = Form.useForm();
  // 工人列表
  const [workerList, setWorkerList] = useState([])
  // 是否显示历史弹窗
  const [showReimHistoryModel, setShowReimHistoryModel] = useState(false)
  // 历史报销数据
  const [historyList, setHistoryList] = useState([])
  // 是否显示详情
  const [showReimOrderDetailDrawer, setShowReimOrderDetailDrawer] = useState(false)
  const [showApplication, setShowApplication] = useState(false)
  // 当前报销单数据
  const [currentReimMessage, setCurrentReimMessage] = useState<API.ReimbursementListItem>(
    // {
    //   id: 0,
    //   back_id: 0,
    //   reim_status_value: '',
    //   reim_status_color: '',
    //   reim_back_id: 0,
    //   reim_no: '',
    //   create_at: '',
    //   is_completed: '',
    //   update_at: '',
    //   brand_id: 0,
    //   brand_en: '',
    //   city_cn: '',
    //   market_cn: '',
    //   store_cn: '',
    //   ma_type_cn: '',
    //   ma_remark: '',
    //   worker_price: 0,
    //   leader_price: 0,
    //   sub_total: 0,
    //   reim_detail_list: [],
    //   remark: '',
    //   approve_remark: '',
    //   pre_quote_status: 0,
    //   sign_file_list: [
    //     {
    //       id: 0
    //     }
    //   ],
    //   bill_file_list: [
    //     {
    //       id: 0
    //     }
    //   ],
    //   status: ''
    // }
  )

  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const reim_no = queryParams.get('reim_no');

  const handleSearchValuesChange = async (changedValues, allValues) => {
    exportParams.reim_create_start_at = allValues.create_at ? allValues.create_at[0] + " 00:00:00" : ''
    exportParams.reim_create_end_at = allValues.create_at ? allValues.create_at[1] + " 23:59:59" : ''
    exportParams.completed_start_at = allValues.completed_at ? allValues.completed_at[0] + " 00:00:00" : ''
    exportParams.completed_end_at = allValues.completed_at ? allValues.completed_at[1] + " 23:59:59" : ''
    exportParams.reim_no = allValues.reim_no ?? ''
    exportParams.reim_status = allValues.reim_status ?? ''
    exportParams.brand_id_list = allValues.brand_en ? [allValues.brand_en] : []
    exportParams.city_id = allValues.city_cn ?? ''
    exportParams.market_id = allValues.market_cn ?? ''
    exportParams.store_id = allValues.store_cn ?? ''
    exportParams.is_completed = allValues.is_completed ?? ''
    exportParams.ma_remark = allValues.ma_remark ?? ''
    exportParams.leader_id = allValues.leader_name ?? ''
    exportParams.is_advance = allValues.is_advance ?? ''
    exportParams.pre_quote_status = allValues.pre_quote_status ?? ''
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
      const marketResponse = await getMarketList({ city_id: changedValues.city_cn });
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city_cn' in changedValues || 'market_cn' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  }

  const AddZero = (value) => {
    if (value >= 10) {
      return value
    }
    return `0${value}`
  }

  // 获取历史报销
  const showReimHistoryList = async (entity) => {
    setHistoryList([])
    setShowReimHistoryModel(true)
    const res = await getReimHistoryList({ reim_id: entity.id })
    let result: any = []
    for (const item in res.data) {
      res.data[item].key = res.data[item].back_id
      res.data[item].order_no = `Re${AddZero(Number(item) + 1)}-${entity.reim_no}`
      result.push(res.data[item])
    }
    setHistoryList(result)
  }

  // 关闭历史弹窗
  const onCloseReimHistoryModel = () => {
    setShowReimHistoryModel(false)
  }

  // 打开报销单详情
  const showReimOrderDetail = async (entity) => {
    if (!entity.back_id) {
      const { data } = await getReimInfo({ reim_id: entity.id })
      if (data && data.reim_detail_list) {
        data.reim_detail_list.map(item => {
          item.key = item.reim_detail_id
          return item
        })
      }
      setCurrentReimMessage(data)
      setShowReimOrderDetailDrawer(true)
      return
    }
    const { data } = await getReimInfo({ back_id: entity.back_id })
    data.reim_no = entity.order_no
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

  // 删除报销单
  const onDeleteReim = () => {

  }

  const getWorker = async () => {
    const res = await getWorkerList()
    setWorkerList(res.data)
  }

  const exportDetail = (index) => {
    exportParams.user_type = 'brand_admin'
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    // console.log(exportParams);
    try {
      getReimExcelList(exportParams).then(res => {
        console.log(res);
        if (res.success) {
          if (res.data && res.data.filename) {
            getUploadToken({ file_suffix: 'xlsx', only_download: 1 }).then(result => {
              const ossData = res.data
              const client = new OSS({
                region: 'oss-' + ossData.region_id,
                accessKeySecret: ossData.access_secret,
                accessKeyId: ossData.access_id,
                stsToken: ossData.secret_token,
                bucket: ossData.bucket
              })
              const filename = '报价单明细.xlsx'
              const response = {
                'content-disposition': `attachment; filename=${encodeURIComponent(
                  filename
                )}`
              }
              const url = client.signatureUrl(res.data.filename, {
                response
              })
              downloadFile(url, filename)
              setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
              });
            })
          }
        }
      })
    } catch (e: any) {
      error(e.message);
      return;
    }
  }

  const onCloseApplicationModel = () => {
    setShowApplication(false)
  }

  const optionsBrand: SelectProps['options'] = searchData.brands.map((item: any) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const columns: ProColumns<API.ReimbursementListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.reimbursementNo"
          defaultMessage="报销单编号"
        />
      ),
      dataIndex: 'reim_no',
      render: (dom, entity) => {
        return (
          <a onClick={() => showReimOrderDetail(entity)}>{dom !== '-' ? dom : ''}</a>
        )
      },
      initialValue: reim_no,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.no"
          defaultMessage="编号"
        />
      ),
      dataIndex: 'supplier_order_no',
      search: false,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              window.open(`/order/orderList?code=${entity.supplier_order_no}`, '_blank')
              // setCurrentRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.reimbursementHistory"
          defaultMessage="历史报销"
        />
      ),
      dataIndex: 'reim_back_id',
      search: false,
      render: (dom, entity) => {
        return (
          typeof dom === 'number' && <Button type="primary" onClick={() => showReimHistoryList(entity)}>查看</Button>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.state"
          defaultMessage="状态"
        />
      ),
      valueType: 'select',
      dataIndex: 'reim_status',
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          entity?.reim_status_value !== "" && <Tag color={entity?.reim_status_color}>{entity?.reim_status_value}</Tag>
        )
      },
      valueEnum: searchData.reimStatus?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.create"
          defaultMessage="申请日期"
        />
      ),
      dataIndex: 'create_at',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.create_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      valueType: 'select',
      // valueEnum: searchData.brands?.reduce((acc, item) => {
      //   acc[`${item.id}`] = { text: item.brand_en };
      //   return acc;
      // }, {}),
      fieldProps: {
        showSearch: true,
        mode: 'multiple', // 启用多选模式
        options: optionsBrand,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          // form.setFieldsValue({ market_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_cn',
      valueType: 'select',
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
          id="reimbursement.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market_cn',
      valueType: 'select',
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
          id="reimbursement.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store_cn',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.name_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.maintenanceCategory"
          defaultMessage="维修类型"
        />
      ),
      dataIndex: 'ma_type_cn',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.workType"
          defaultMessage="工作类型"
        />
      ),
      dataIndex: 'ma_cate_cn',
      search: false
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
          id="report.field.isCompleted"
          defaultMessage="是否完工"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "is_completed",
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
          id="reimbursement.field.remark"
          defaultMessage="工作描述"
        />
      ),
      dataIndex: 'ma_remark',
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.leaderName"
          defaultMessage="申请人"
        />
      ),
      dataIndex: 'leader_name',
      valueType: 'select',
      valueEnum: searchData.directors?.reduce((acc, item) => {
        acc[`${item.worker_id}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.completed"
          defaultMessage="完工日期"
        />
      ),
      dataIndex: 'completed_at',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.completed_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.totalPrice"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'total_price',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.advance"
          defaultMessage="是否预支"
        />
      ),
      dataIndex: 'is_advance',
      valueType: 'select',
      render: (dom, entity) => {
        return (
          <div style={{ fontWeight: 700 }}>{entity?.is_advance === 'n' ? 'N' : 'Y'}</div>
        )
      },
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
          id="report.field.preQuoteStatus"
          defaultMessage="是否预报价"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "pre_quote_status",
      valueType: 'select',
      valueEnum: searchData.preQuoteStatus?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="reimbursement.field.price"
    //       defaultMessage="已打款金额"
    //     />
    //   ),
    //   dataIndex: 'id',
    //   search: false
    // },
  ]

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getWorker()
  }, [])

  return (
    <>
      <ProTable<API.ReimbursementListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'reimbursement.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => exportDetail(1)}
            loading={loadings[1]}
            icon={<DownloadOutlined />}
          >
            <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
          </Button>,

          <Button
            type="primary"
            key="primary"
            onClick={() => setShowApplication(true)}
            disabled={selectedRowsState.length < 1}
          >
            <FormattedMessage id="pages.searchTable.application" defaultMessage="申请" />
          </Button>,
        ]}
        request={onListData}
        columns={columns}
        rowSelection={{
          onChange: onRowSelected
        }}
        form={{
          form,
          onValuesChange: handleSearchValuesChange
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
        open={showReimHistoryModel}
        footer={null}
        onCancel={onCloseReimHistoryModel}
        width={1000}
      >
        <ReimHistory
          historyList={historyList}
          showReimOrderDetail={showReimOrderDetail}
        />
      </Modal>

      <Drawer
        width={'85%'}
        onClose={onCloseReimDetailDrawer}
        maskClosable={false}
        open={showReimOrderDetailDrawer}
        destroyOnClose={true}
        title="报销单详情"
      >
        <ReimOrderDetail
          actionRef={actionRef}
          currentReimMessage={currentReimMessage}
          workerList={workerList}
          onCloseReimDetailDrawer={onCloseReimDetailDrawer}
          success={success}
          error={error}
          deleteReim={onDeleteReim}
        />
      </Drawer>

      <Modal
        open={showApplication}
        footer={null}
        onCancel={onCloseApplicationModel}
        width={600}
        title="申请"
        maskClosable={false}
        destroyOnClose={true}
      >
        <Application
          actionRef={actionRef}
          selectedRowsState={selectedRowsState}
          onCloseApplicationModel={onCloseApplicationModel}
          success={success}
          error={error}
        />
      </Modal>
    </>
  )
}

export default ItemList
