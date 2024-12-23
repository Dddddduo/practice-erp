import React, { RefObject, useCallback, useRef } from "react"
import { PageContainer } from '@ant-design/pro-components'
import ItemList from "./components/ItemList"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { message } from "antd";
import { getFinanceReilListPage } from "@/services/ant-design-pro/financialReimbursement";

const FinancialReimbursement: React.FC = () => {
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
    const customParams = {
      page: current,
      page_size: pageSize,
      settlement_type: params['type'] ?? '',
      plat: params['payee'] ?? '',
      uid: params['payeePeople'] ?? '',
      type: params['reimType'] ?? '',
      status: params['status_cn'] ?? '',
      select_date: params['create_at'] ?? [],
      create_start_at: params['create_at'] ? params['create_at'][0] : '',
      create_end_at: params['create_at'] ? params['create_at'][1] : '',
      approve_date: params['approve_at'] ?? [],
      approve_start_at: params['approve_at'] ? params['approve_at'][0] : '',
      approve_end_at: params['approve_at'] ? params['approve_at'][1] : '',
    };
    try {
      const response = await getFinanceReilListPage(customParams);
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

export default FinancialReimbursement