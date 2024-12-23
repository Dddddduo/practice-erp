import {ActionType, PageContainer, type ParamsType} from '@ant-design/pro-components';
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import { getList } from '@/services/ant-design-pro/report_text';
import { message } from "antd";
import ItemList from "@/pages/Order/Jdxhh/components/ItemList";
import {getReportTeamList, getTeamDetailByUid} from "@/services/ant-design-pro/report";
import {isEmpty} from "lodash";




export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

const Jdxhh: React.FC = () => {
  // 使用useState来管理数据状态
  const [data, setData] = useState<any[]>([]);

  // 第一个参数
  // 表格实体的引用
  const actionRef = useRef<ActionType>();

  // 第二个参数
  // 表格的搜索条件
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
      report_tid: params['report_title'] ?? '',
      report_no: params['report_no'] ?? '',
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      brand_id: params['brand_en'] ?? '',
      ma_type: params['ma_type_cn'] ?? '',
      ma_cate_id: params['ma_cate_cn'] ?? '',
      worker_uid: params['worker'] ?? '',
    };
    try {
      const response = await getList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (error) {
      message.error('数据请求异常');
    }
    console.log(retData);

    return retData;
  }, []);

  // 第三个参数
  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
    // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

  // 当前选中行
  const [currentRow, setCurrentRow] = useState<API.ReportListItem>({});
  // 右侧弹出区域控制
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [appoTaskId, setAppoTaskId] = useState<number>(0);

  // 团队数据详情
  const [teamDetailList, setTeamDetailList] = useState({});

  // 团队列表
  const [teamList, setTeamList] = useState<{ [key: string]: number }>({});

  //第四个
  /**
   * 表格处理查新操作按钮触发
   *
   * @param record
   */

  const handleTableSearchClick = useCallback(async (record: API.ReportListItem) => {
    console.log('handleTableSearchClick:', record);
    setCurrentRow(record);
    setShowDetail(false);
    setAppoTaskId(record.appo_task_id);

    const reportId = record?.id ?? 0;
    let data: { [key: string]: number } = {};
    const params = {
      report_id: reportId
    };

    try {
      const result = await getReportTeamList(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      data = result.data;
      console.log('handleTableSearchClick:', data);
      const defaultKey = data["团队"] || 0;
      const details = await getTeamDetailByUid({
        report_id: reportId,
        worker_uid: defaultKey,
      });
      if (details.success) {
        setTeamDetailList(details.data);
      }
    } catch (error) {
      message.error((error as Error).message);
      setTeamDetailList({});
    } finally {
      setTeamList(data);
    }
  }, []);

  // 初始状态
  const initialSearchForm = {
    brands: [],
    cities: [],
    shops: [],
    markets: [],
    workTypes: [
      {
        type: 'urgent',
        name: '紧急维修'
      },
      {
        type: 'not_urgent',
        name: '固定维保'
      }
    ],
    repairCategories: [],
    templateTypes: [],
    directors: []
  };

  // 第五个
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
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);

  const handleSearchSelectedChild = (type: string, field: string, data: []) => {
    dispatchSearchData({
      type,
      payload: {
        field,
        data
      }
    });
  }







  return (

    //
    <PageContainer>

      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        onRowSelected={handleRowSelection}
        onSearchClick={handleTableSearchClick}
        searchData={searchDataState}
        onSearchSelectedChild={handleSearchSelectedChild}
        selectedRowsState={selectedRowsState}
      />



    </PageContainer>
  );
};

export default Jdxhh;
