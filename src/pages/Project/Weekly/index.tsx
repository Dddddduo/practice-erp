import React, { useEffect, useRef, useState, useCallback, useReducer } from 'react';
import { Button, Drawer, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components'
import ItemList from './components/ItemList';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { isEmpty, isUndefined } from 'lodash';
import { useLocation } from "umi";
import {
  getCityList,
  getBrandList,
} from '@/services/ant-design-pro/report';
import {getWeeklyReportList} from "@/services/ant-design-pro/weekly";

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
    default:
      return state;
  }
}

/**
 * 周报组件主体
 * @constructor
 */
const Weekly: React.FC = () => {
  const location = useLocation();
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
  const actionRef = useRef<any>();
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

  // 获取周报列表
  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
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
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      brand_id: params['brand_en'] ? params['brand_en'] : [],
      is_delete: 'n'
    };
    try {
      const response = await getWeeklyReportList(customParams);
      console.log('response--response-000',response)
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
        onRowSelected={handleRowSelection}
        selectedRowsState={selectedRowsState}
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default Weekly
