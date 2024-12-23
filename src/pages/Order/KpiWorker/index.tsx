import React, { RefObject, useCallback, useRef } from "react"
import { PageContainer } from '@ant-design/pro-components'
import ItemList from "./components/ItemList"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { message } from "antd";
import { getKpiItemListPage } from "@/services/ant-design-pro/kpiWorker";

const KpiWorder: React.FC = () => {
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
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const date = new Date()
    const customParams = {
      page: current,
      page_size: pageSize,
      use_for: 'fm',
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      kpi_item: params['item'] ?? '',
      remark: params['remark'] ?? '',
    };
    try {
      const response = await getKpiItemListPage(customParams);
      if (!response.success) {
        return retData;
      }
      const data = response.data;
      console.log(data);
      data.list.map(item => {
        item.key = item.kpi_item_id
        return item
      })

      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
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
      />
    </PageContainer>
  )
}

export default KpiWorder