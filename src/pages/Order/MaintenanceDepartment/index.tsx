import React, { useRef, useReducer, useCallback, useEffect } from "react"
import { PageContainer } from '@ant-design/pro-components'
import { isEmpty } from "lodash";
import { message } from "antd";
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { getFinanceCollListPage } from "@/services/ant-design-pro/maintenanceDepartment";

const MaintenanceDepartment: React.FC = () => {

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
      department: params['department'] ?? '',
      coll_yes_or_no: params['type'] ?? '',
    };
    try {
      const response = await getFinanceCollListPage(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data;
      data.list.map(item => {
        item.key = item.id
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

export default MaintenanceDepartment