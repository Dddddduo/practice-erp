import React, { useRef, useReducer, useCallback, useEffect, useState } from "react"
import { PageContainer } from '@ant-design/pro-components'
import { isEmpty } from "lodash";
import { message } from "antd";
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { reimStats } from "@/services/ant-design-pro/reimbursementStatistics";

const ReimbursementStatistics = () => {
  const [params, setParams] = useState<any>({})
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
    console.log(params);
    const time = new Date
    let start = time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
    const end = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    if (time.getMonth() + 1 === 1) {
      start = (time.getFullYear() - 1) + '-' + 12 + '-' + time.getDate()
    }
    const rangeTime = [start, end]
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      brand_id: params['brand'] ?? '',
      city_id: params['city'] ?? '',
      leader_id: params['name'] ?? '',
      detail: params['detail'] ?? '',
      select_date: params['create_at'] ?? rangeTime,
      begin: params['create_at'] ? params['create_at'][0] : start,
      end: params['create_at'] ? params['create_at'][1] : end
    };
    setParams(customParams)

    try {
      const response = await reimStats(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      data.map(item => {
        item.key = item.id
        return item
      })

      retData.success = true;
      retData.total = data.total;
      retData.data = data ?? [];
    } catch (e) {
      error('数据请求异常');
    }
    return retData;
  }, [])

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        success={success}
        error={error}
        params={params}
      />
    </PageContainer>
  )
}

export default ReimbursementStatistics