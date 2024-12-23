import {useCallback, useEffect, useRef, useState} from "react";
import {getCityList, getShopListNew} from "../../erp/src/services/ant-design-pro/report";
import {getBrandList, getMarketList} from "@/services/ant-design-pro/report";
import {Form, message} from "antd";
import {ActionType, ParamsType} from "@ant-design/pro-components";
import {getReimList} from "@/services/ant-design-pro/reimbursement";
import {produce} from "immer";
import {isUndefined} from "lodash";
import {getOrderList} from "@/services/ant-design-pro/orderList";
import dayjs from "dayjs";
import {getReimInfo} from "../../erp/src/services/ant-design-pro/reimbursement";
import {handleParseStateChange} from "@/utils/utils";
import {useReiDataSource} from "@/hooks/useReiDataSource";

export const useOrderListNew = () => {

  const [dataSource, setDataSource] = useState<any>({
    // 管理创建报销单模态框的状态
    createReiModelStatus:false,
    // 时间数据
    time_cost: undefined,
    // 明细的数据
    detailsDataSource: [],
  });

  // 当前列的数据
  const [currentRecord, setCurrentRecord] = useState<{[key: string]: any}>({});

  // 是否完工
  const [isCompleted, setIsCompleted] = useState(0);

  const onChangeCompletedFinish = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("是否完工:", value);
    setIsCompleted(value);
  };


  // 发起报销的表单数据
  const [handleReiFormData] = Form.useForm();

  // 处理数据变化
  const handleReiFormChange = (changes) => {
    if (changes.application_date) {
      const formattedDate = changes.application_date ? changes.application_date.format('YYYY-MM-DD HH:mm:ss') : null;
      // 更新状态
      setHandleReiFormData({
        ...handleReiFormData,
        application_date: formattedDate,
      });
    }
  };

  // 报销单表格的状态
  const actionRef = useRef<ActionType>();

  // 获取订单列表
  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    console.log("获取列表")
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
    } catch (e) {
      message.error('数据请求异常');
    }
    console.log(retData);
    return retData;
  }, [])

  // 关掉发起报销的模态框
  const closeCreateReiModel = () => {
    setDataSource({
      ...dataSource,
      createReiModelStatus: false,
    })
    setIsCompleted(0);
  }

  // 打开发起报销的模态框 初始化数据
  const showCreateReiModel = async (text, record) => {

    console.log('text', record);
    console.log('record', record);

    const params = {
      appo_task_id: record.appo_task_id,
      reim_id: record.reim_info.reim_id,
    };

    const data = await getReimInfo(params)
    console.log('data', data.data);
    console.log('reim_detail_list', data.data.reim_detail_list);

    handleReiFormData.setFieldsValue(record);
    handleReiFormData.setFieldsValue(data.data);
    setDataSource({
      ...dataSource,
      // time_cost: record.submit_at,
      detailsDataSource: data.data.reim_detail_list,
      createReiModelStatus: true,
    })
    setCurrentRecord(record);
    setCurrentRecord(data.data);
  }

  const handleFullValueChange: any = (path: string, value: any) => {
    console.log("path-value", path, value)
    const newData = handleParseStateChange(dataSource, path, value)
    setDataSource(newData);
  };



  useEffect(() => {
  }, []);

  return {
    dataSource,
    handleFetchListData,
    actionRef,
    handleReiFormData,
    handleReiFormChange,
    showCreateReiModel,
    closeCreateReiModel,
    onChangeCompletedFinish,
    isCompleted,
    currentRecord,
    handleFullValueChange,
  };

}

