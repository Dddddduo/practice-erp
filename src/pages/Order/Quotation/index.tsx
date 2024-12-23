import React, { useRef, useReducer, useEffect, useCallback, useState } from "react"
import ItemList from './components/ItemList';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { message } from "antd";
import { isEmpty, isUndefined } from "lodash";
import { getCityList, getBrandList, } from '@/services/ant-design-pro/report';
import { getQuoList, getColorMarkList } from "@/services/ant-design-pro/quotation";
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { getMaCateLv0List } from "@/services/ant-design-pro/quotation";

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
  maCates: [],
  maType: [],
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
  quotationType: [
    {
      type: 'monthly',
      name: '月结'
    },
    {
      type: 'not_monthly',
      name: '单结'
    },
    {
      type: 'fix',
      name: '固定'
    },
    {
      type: 'other',
      name: '其他'
    },
    {
      type: 'event',
      name: '活动'
    },
    {
      type: 'mqi',
      name: '成本入MQI'
    },
    {
      type: 'isMerge',
      name: '已汇总'
    }
  ],
  secondQuotationType: [],
  status: [
    {
      type: 'all',
      name: '所有'
    },
    {
      type: '0',
      name: '未报价'
    },
    {
      type: '1',
      name: '已报价'
    },
  ],
  color: [],
  contactsList: []
};

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }
// console.log('field',field,'data',data,'state',state)
  switch (action.type) {
    case SearchType.LoadData:
      return { ...state, [field]: [...Array.from(data ?? [])] };
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

const Quotation: React.FC = () => {
  const intl = useIntl()
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
    const actionRef = useRef<ActionType>(null);
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [customParams, setCustomParams] = useState()
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
    const createStart = isUndefined(params.create_at) ? '' : params.create_at[0]
    const createEnd = isUndefined(params.create_at) ? '' : params.create_at[1]
    const completionStart = isUndefined(params.completion_at) ? '' : params.completion_at[0]
    const completionEnd = isUndefined(params.completion_at) ? '' : params.completion_at[1]
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      user_type: 'brand_admin',
      quo_no: params['quo_no'] ?? '', // 编号
      supplier_order_no: params['order_no'] ?? '', // 编号
      brand_id_list: params['brand_en'] ?? [],
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      has_sign_ids: params['sign_ids'] ?? '', //是否有签单
      ma_type: params['ma_type_cn'] ?? '',
      ma_cate_id: params['ma_type'] ?? '',
      class_type: params['quotation_type'] ?? '',
      class_type_id: params['second_quotation_type'] ?? '',
      show_status: params['status'] ?? '',
      color_mark: params['color'] ? params['color'].join(',') : '',
      create_date: params['create_at'] ?? [],
      select_date: params['completion_at'] ?? [],
      create_start_at: createStart ?? '',
      create_end_at: createEnd ?? '',
      comp_start_at: completionStart ?? '',
      comp_end_at: completionEnd ?? '',
    };
    setCustomParams(customParams)
    try {
      const response = await getQuoList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
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

    const maCateResponse = await getMaCateLv0List()
    if (maCateResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'maCates',
          data: Object.entries(maCateResponse.data).map(([value, label]) => ({ value, label }))
        }
      });
    }

    const colorResponse = await getColorMarkList()
    if (colorResponse.success) {
      colorResponse.data.unshift('all', 'unmark')
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'color',
          data: colorResponse.data.map(item => ({ value: item, label: item }))

        }
      });
    }

    // const workerResponse = await getWorkerList();
    // if (workerResponse.success) {
    //   dispatchSearchData({
    //     type: SearchType.LoadData,
    //     payload: {
    //       field: 'directors',
    //       data: workerResponse.data
    //     }
    //   });
    // }
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

  const handleClearSelected = () => {
    setSelectedRows([]);
    actionRef?.current?.clearSelected();
  }

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        onRowSelected={handleRowSelection}
        searchData={searchDataState}
        onSearchSelectedChild={handleSearchSelectedChild}
        selectedRowsState={selectedRowsState}
        success={success}
        error={error}
        customParams={customParams}
        onClearSelected={handleClearSelected}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.cost"
                  defaultMessage="成本"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + Number(item.cost)!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.Yuan" defaultMessage="元" />
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.exTotalPrice"
                  defaultMessage="报价"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + Number(item.ex_total_price)!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.Yuan" defaultMessage="元" />
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.profitPrice"
                  defaultMessage="利润"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + Number(item.profit_price)!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.Yuan" defaultMessage="元" />
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {/* <span>
                <FormattedMessage
                  id="pages.searchTable.exTotalPrice"
                  defaultMessage="报价"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + Number(item.ex_total_price)!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.Yuan" defaultMessage="元" />
              </span> */}
            </div>
          }
        >
        </FooterToolbar>
      )}
    </PageContainer>
  )
}

export default Quotation
