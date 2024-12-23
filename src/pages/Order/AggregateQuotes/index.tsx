import React, { useRef, useCallback, useState, useEffect, useReducer } from 'react';
import { message } from 'antd';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import ItemList from './components/ItemList';
import { getMergeQuoList } from '@/services/ant-design-pro/aggregateQuotes';
import { getBrandList } from "@/services/ant-design-pro/report";
import { isEmpty } from 'lodash';





export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
  brands: [],
  rollup_type: [
    {
      type: 'non-fix',
      name: '非固定'
    },
    {
      type: 'fix',
      name: '固定'
    }
  ]
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
 * 汇总报价Table列表
 * @constructor
 */
const AggregateQuotes: React.FC = () => {
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);

  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
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

  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    console.log('handleFetchListData:params:', params);
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      quo_merge_no: params['quo_merge_no'] ?? '',
      category: params['rollup_type'] ?? '',
      brand_id: params['brand_en'] ?? '',
      select_date: params['create_at'] ?? '',
      create_start_at: params['create_at'] ? params['create_at'][0] : '',
      create_end_at: params['create_at'] ? params['create_at'][1] : '',
    };
    try {
      const response = await getMergeQuoList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      console.log(data);
      data.list.map(item => {
        item.key = item.quo_merge_id
      })
      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (error) {
      message.error('数据请求异常');
    }
    console.log(retData);

    return retData;
  }, []);

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
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default AggregateQuotes
