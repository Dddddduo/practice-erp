import React, { useRef, useReducer, useCallback, useEffect } from "react"
import { PageContainer } from '@ant-design/pro-components'
import { isEmpty } from "lodash";
import { message } from "antd";
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { getBrandList, getCityList, getWorkerList } from "@/services/ant-design-pro/report";
import { getAppoTaskConstructionReport } from "@/services/ant-design-pro/constructionPersonnelInformation";

export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  markets: [],
  stores: [],
  manager: [],
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

const ConstructionPersonnelInformation: React.FC = () => {
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);

  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
  const actionRef = useRef<ActionType>();
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
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      brand_id: params['brand_en'] ?? '',
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      leader_id: params['leader'] ?? '',
    };
    try {
      const response = await getAppoTaskConstructionReport(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      data.list.map(item => {
        item.key = item.id
        return item
      })
      console.log(data);

      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (e) {
      error('数据请求异常');
    }
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

    const workerResponse = await getWorkerList();
    if (workerResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'manager',
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
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default ConstructionPersonnelInformation