import React, { useReducer, useCallback, useEffect, useRef, useState } from "react"
import { PageContainer } from '@ant-design/pro-components'
import ItemList from "./components/ItemList"
import { message } from "antd"
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { getOrderList, getOrderStatusList, getMaCateLv0List } from "@/services/ant-design-pro/orderList"
import { isEmpty, isUndefined } from "lodash"
import { getCityList, getBrandList, getWorkerList } from '@/services/ant-design-pro/report';

export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  shops: [],
  markets: [],
  workTypes: [],
  repairCategories: [],
  orderStatus: [],
  reimStatus: [
    {
      type: 'create',
      value: '待审核'
    },
    {
      type: 'agree_submit',
      value: '已审核',
    },
    {
      type: 'reject_submit',
      value: '已驳回'
    }
  ],
  isHasSign: [
    {
      type: 'n',
      name: '无'
    },
    {
      type: 'y',
      name: '有'
    }
  ],
  isQuoStatus: [
    {
      type: 'n',
      name: '无'
    },
    {
      type: 'y',
      name: '有'
    }
  ],
  searchEvent: [
    {
      type: '0',
      name: '所有'
    },
    {
      type: '1',
      name: '仅活动'
    }
  ],
  directors: [],
  quotationType: [
    {
      type: 'mqi',
      name: '成本入MQI'
    },
    {
      type: 'isMerge',
      name: '已汇总'
    }
  ],
};

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }

  switch (action.type) {
    case SearchType.LoadData:
      return { ...state, [field]: [...Array.from(data)] };
    case SearchType.DeleteData:
      return { ...state, [field]: [] };
    // case UPDATE_EMAIL:
    //   return { ...state, profile: { ...state.profile, email: action.payload } };
    // case UPDATE_ADDRESS:
    //   // payload 应该是一个对象，包含 street, city 和 zip
    //   return { ...state, profile: { ...state.profile, address: { ...state.profile.address, ...action.payload } } };
    default:
      return state;
  }
}

const OrderList: React.FC = () => {
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };
  // 获取订单列表
  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const timeCostStart = isUndefined(params.time_cost) ? '' : params.time_cost[0]
    const timeCostEnd = isUndefined(params.time_cost) ? '' : params.time_cost[1]

    const customParams = {
      page: current,
      page_size: pageSize,
      supplier_order_no: params['supplier_order_no'] ?? '',
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      brand_id: params['brand_en'] ?? '',
      ma_type: params['ma_type_cn'] ?? '',
      ma_cate_id: params['ma_cate_cn'] ?? '',
      appo_task_status: params['orderStatus'] ?? '',
      reim_status: params['reimbursementState'] ?? '',
      has_sign_ids: params['sign_ids'] ?? '', //是否有签单
      quo_status: params['quo_status'] ?? '',
      search_event: params['searchEvent'] ?? '',
      submit_start_at: timeCostStart ?? '',
      submit_end_at: timeCostEnd ?? '',
      leader_id: params['assign'] ?? '',
      class_type:params['quotation_type'] ?? ''
    };
    try {
      const response = await getOrderList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      data.list.map(item => {
        item.key = item.order_id
        return item
      })
      let format
      retData.success = true;
      retData.total = data.total;
      const formatData = data.list.map(dataItem => {
        dataItem.ma_item_list.map(ma => {
          if (ma.cs_list && ma.cs_list.length > 0) {
            ma.cs_list.map(item => {
              format = {
                key: dataItem.order_id,
                store_id: dataItem.store_id,
                ma_type_cn: dataItem.ma_type_cn + (dataItem.appo_at ? '\n' + dataItem.appo_at : ''),
                color_mark: typeof dataItem.color_mark !== 'undefined' ? dataItem.color_mark : '',
                details: ma,
                ma_sub_cate_cn: ma && ma.ma_sub_cate_cn,
                ma_sub_cate_id: ma && ma.ma_sub_cate_id,
                ma_item_id: ma.ma_item_id,
                appo_task_id: item && typeof item.appointed_task !== 'undefined' ?
                  item.appointed_task.appo_task_id : 0,
                assign: item.appointed_task,
                construction: item && typeof item.task_callback !== 'undefined' ?
                  item.task_callback : {},
                report: item && typeof item.construction_report !== 'undefined' ?
                  item.construction_report : {},
                reim_info: item && typeof item.reim_info !== 'undefined' ?
                  item.reim_info : {},
                report_list: item && typeof item.report_list !== 'undefined' ?
                  item.report_list : {},
                reimbursementAndQuote: { quote: {} },
                order_supplier_id: dataItem.supplier_order_id,
                quo_status: dataItem.status,
                quo_status_color: dataItem.status_color,
                quo_status_value: dataItem.status_value
              }
            })
          } else {
            format = {
              key: dataItem.order_id,
              store_id: dataItem.store_id,
              color_mark: typeof dataItem.color_mark !== 'undefined' ? dataItem.color_mark : '',
              ma_type_cn: dataItem.ma_type_cn + (dataItem.appo_at ? '\n' + dataItem.appo_at : ''),
              details: ma,
              assign: {},
              report: {},
              construction: {},
              reimbursementAndQuote: { quote: {} },
              report_list: [],
              quo_status: dataItem.status,
              order_supplier_id: dataItem.supplier_order_id,
              quo_status_color: dataItem.status_color,
              quo_status_value: dataItem.status_value,
              ma_sub_cate_cn: ma && ma.ma_sub_cate_cn,
              ma_sub_cate_id: ma && ma.ma_sub_cate_id,
            }
          }
        })
        dataItem = { ...dataItem, ...format }
        return dataItem
      })
      retData.data = formatData

      // const list = data.list;
      // for (const i in list) {
      //   for (const j in list[i].ma_item_list) {
      //     let value = {}
      //     if (
      //       list[i].ma_item_list[j].cs_list &&
      //       list[i].ma_item_list[j].cs_list.length > 0
      //     ) {
      //       for (const k in list[i].ma_item_list[j].cs_list) {
      //         value = {
      //           supplier_order_no: list[i].supplier_order_no,
      //           company_en: list[i].company_en,
      //           order_id: list[i].order_id,
      //           order_no: list[i].order_no,
      //           order_status: list[i].order_status,
      //           appo_at: list[i].appo_at,
      //           order_status_cn: list[i].order_status_cn,
      //           store_id: list[i].order_id,
      //           brand_en: list[i].brand_en,
      //           city_cn: list[i].city_cn,
      //           market_cn: list[i].market_cn,
      //           store_cn: list[i].store_cn,
      //           color_mark: typeof list[i].color_mark !== 'undefined' ? list[i].color_mark : '',
      //           ma_type_cn:
      //             list[i].ma_type_cn +
      //             (list[i].appo_at && list[i].appo_at !== '0000-00-00'
      //               ? '\n' + list[i].appo_at
      //               : ''),
      //           ma_type: list[i].ma_type,
      //           create_at: list[i].create_at,
      //           submit_at: list[i].submit_at,
      //           order_ma_reim_total_price:
      //             list[i].order_ma_reim_total_price,
      //           details: list[i].ma_item_list[j],
      //           ma_sub_cate_cn:
      //             list[i].ma_item_list[j] &&
      //             list[i].ma_item_list[j].ma_sub_cate_cn,
      //           ma_sub_cate_id:
      //             list[i].ma_item_list[j] &&
      //             list[i].ma_item_list[j].ma_sub_cate_id,
      //           ma_item_id: list[i].ma_item_list[j].ma_item_id,
      //           appo_task_id:
      //             list[i].ma_item_list[j].cs_list[k] &&
      //               typeof list[i].ma_item_list[j].cs_list[k]
      //                 .appointed_task !== 'undefined'
      //               ? list[i].ma_item_list[j].cs_list[k].appointed_task
      //                 .appo_task_id
      //               : 0,
      //           assign: list[i].ma_item_list[j].cs_list[k].appointed_task,
      //           construction:
      //             list[i].ma_item_list[j].cs_list[k] &&
      //               typeof list[i].ma_item_list[j].cs_list[k]
      //                 .task_callback !== 'undefined'
      //               ? list[i].ma_item_list[j].cs_list[k].task_callback
      //               : {},
      //           report:
      //             list[i].ma_item_list[j].cs_list[k] &&
      //               typeof list[i].ma_item_list[j].cs_list[k]
      //                 .construction_report !== 'undefined'
      //               ? list[i].ma_item_list[j].cs_list[k].construction_report
      //               : {},
      //           reim_info:
      //             list[i].ma_item_list[j].cs_list[k] &&
      //               typeof list[i].ma_item_list[j].cs_list[k].reim_info !==
      //               'undefined'
      //               ? list[i].ma_item_list[j].cs_list[k].reim_info
      //               : {},
      //           report_list:
      //             list[i].ma_item_list[j].cs_list[k] &&
      //               typeof list[i].ma_item_list[j].cs_list[k].report_list !==
      //               'undefined'
      //               ? list[i].ma_item_list[j].cs_list[k].report_list
      //               : [],
      //           reimbursementAndQuote: { quote: {} },
      //           order_supplier_id: list[i].supplier_order_id,
      //           quo_no: list[i].quo_no,
      //           quo_id: list[i].quo_id,
      //           pre_total_price: list[i].pre_total_price,
      //           total_price: list[i].total_price,
      //           profit_rate: list[i].profit_rate,
      //           quo_status: list[i].status,
      //           quo_status_color: list[i].status_color,
      //           quo_status_value: list[i].status_value,
      //           time_cost: list[i].time_cost
      //         }
      //         retData.data.push(value)
      //       }
      //     } else {
      //       value = {
      //         supplier_order_no: list[i].supplier_order_no,
      //         company_en: list[i].company_en,
      //         order_id: list[i].order_id,
      //         order_no: list[i].order_no,
      //         order_status: list[i].order_status,
      //         order_status_cn: list[i].order_status_cn,
      //         appo_at: list[i].appo_at,
      //         store_id: list[i].order_id,
      //         store_name_cn: list[i].store_name_cn,
      //         ma_type: list[i].ma_type,
      //         color_mark: typeof list[i].color_mark !== 'undefined' ? list[i].color_mark : '',
      //         ma_type_cn:
      //           list[i].ma_type_cn +
      //           (list[i].appo_at ? '\n' + list[i].appo_at : ''),
      //         create_at: list[i].create_at,
      //         order_ma_reim_total_price: list[i].order_ma_reim_total_price,
      //         submit_at: list[i].submit_at,
      //         details: list[i].ma_item_list[j],
      //         assign: {},
      //         report: {},
      //         construction: {},
      //         reimbursementAndQuote: { quote: {} },
      //         report_list: [],
      //         quo_no: list[i].quo_no,
      //         quo_id: list[i].quo_id,
      //         pre_total_price: list[i].pre_total_price,
      //         total_price: list[i].total_price,
      //         profit_rate: list[i].profit_rate,
      //         quo_status: list[i].status,
      //         order_supplier_id: list[i].supplier_order_id,
      //         quo_status_color: list[i].status_color,
      //         quo_status_value: list[i].status_value,
      //         ma_sub_cate_cn:
      //           list[i].ma_item_list[j] &&
      //           list[i].ma_item_list[j].ma_sub_cate_cn,
      //         ma_sub_cate_id:
      //           list[i].ma_item_list[j] &&
      //           list[i].ma_item_list[j].ma_sub_cate_id,
      //         time_cost: list[i].time_cost
      //       }
      //       retData.data.push(value)
      //     }
      //   }
      // }
    } catch (e) {
      error('数据请求异常');
    }
    console.log(retData);

    return retData;
  }, [])

  const fetchSearchInitData = async () => {
    const brandResponse = await getBrandList();
    if (brandResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'brands',
          data: Object.keys(brandResponse.data).map(key => brandResponse.data[key])
        }
      });
    }

    const cityResponse = await getCityList();
    if (cityResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'cities',
          data: cityResponse.data
        }
      });
    }

    const orderStatusResponse = await getOrderStatusList()
    if (orderStatusResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'orderStatus',
          data: orderStatusResponse.data
        }
      });
    }

    const maCateLv0Response = await getMaCateLv0List();
    if (maCateLv0Response.success) {
      const result = Object.entries(maCateLv0Response.data).map(([type, value]) => ({
        type,
        value,
      }));
      console.log(result);

      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'workTypes',
          data: result
        }
      });
    }
    const workerResponse = await getWorkerList();
    if (workerResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'directors',
          data: workerResponse.data
        }
      });
    }
  }

  const handleSearchSelectedChild = (type: string, field: string, data: []) => {
    dispatchSearchData({
      type,
      payload: {
        field,
        data
      }
    });
  }

  /**
 * 处理表格行选中
 * @param _
 * @param selectedRows
 */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

  // 加载选择项
  useEffect(() => {
    const fetchData = async () => {
      await fetchSearchInitData();
    };

    fetchData();
  }, []);

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        searchData={searchDataState}
        onSearchSelectedChild={handleSearchSelectedChild}
        onRowSelected={handleRowSelection}
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default OrderList
