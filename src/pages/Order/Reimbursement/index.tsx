import React, { useEffect, useRef, useState, useCallback, useReducer } from 'react';
import { Button, Drawer, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components'
import ItemList from './components/ItemList';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { getReimList, getReimHistoryList } from '@/services/ant-design-pro/reimbursement';
import { isEmpty, isUndefined } from 'lodash';
import { useLocation } from "umi";
import {
  getCityList,
  getBrandList,
  getMarketList,
  getShopList,
  getWorkerList,
  getMaCateList
} from '@/services/ant-design-pro/report';

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
  reimStatus: [
    {
      type: '',
      name: '全部'
    },
    {
      type: 'wait',
      name: '待审批'
    },
    {
      type: 'agree',
      name: '已通过'
    },
    {
      type: 'reject',
      name: '已驳回'
    },
    {
      type: 'paid',
      name: '已打款'
    },
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
  isCompleted: [
    {
      type: 'n',
      name: '无'
    },
    {
      type: 'y',
      name: '有'
    }
  ],
  isAdvance: [
    {
      type: 'n',
      name: '无'
    },
    {
      type: 'y',
      name: '有'
    }
  ],
  preQuoteStatus: [
    {
      id: 0,
      name: '无'
    },
    {
      id: 1,
      name: '有'
    },
    {
      id: 'all',
      name: '全部'
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

/**
 * 报销单组件主体
 * @constructor
 */
const Reimbursement: React.FC = () => {
  const location = useLocation();
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [exportParams, setExportParams]: any = useState()

  // 获取报销单列表
  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    const reim_no = queryParams.get('reim_no');
    const createStart = isUndefined(params.create_at) ? '' : params.create_at[0]
    const createEnd = isUndefined(params.create_at) ? '' : params.create_at[1]
    const completedStart = isUndefined(params.completed_at) ? '' : params.completed_at[0]
    const completedEnd = isUndefined(params.completed_at) ? '' : params.completed_at[1]
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      user_type: 'brand_admin',
      reim_no: reim_no ?? params['reim_no'] ?? '', // 报销单编号
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      brand_id_list: params['brand_en'] ? params['brand_en'] : [],
      ma_remark: params['ma_remark'] ?? '', // 工作描述
      reim_status: params['reim_status'] ?? '', // 状态
      has_sign_ids: params['sign_ids'] ?? '', //是否有签单
      is_completed: params['is_completed'] ?? '', //是否完工
      is_advance: params['is_advance'] ?? '', //是否预支
      leader_id: params['leader_name'] ?? '', //负责人（id）
      completed_start_at: completedStart ?? '', // 完工时间开始
      completed_end_at: completedEnd ?? '', //完工时间结束
      reim_create_start_at: createStart ?? '', //申请时间开始
      reim_create_end_at: createEnd ?? '', //申请时间结束
      pre_quote_status: params['pre_quote_status'] ?? '', //是否预报价
    };
    setExportParams(customParams)
    try {
      const response = await getReimList(customParams);
      if (!response.success) {
        return retData;
      }
      const data = response.data;
      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (e) {
      console.log(e);
      error('数据请求异常');
    }
    return retData;
  }, [])

  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

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
        exportParams={exportParams}
        onRowSelected={handleRowSelection}
        selectedRowsState={selectedRowsState}
      />
    </PageContainer>
  )
}

export default Reimbursement
