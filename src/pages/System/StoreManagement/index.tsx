import React from "react"
import { useCallback, useRef } from "react";
import { message } from "antd";
import { PageContainer, ActionType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { getStoreListPage } from "@/services/ant-design-pro/system";

const StoreManagement = () => {

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
  // 表格的引入 
  const actionRef = useRef<ActionType>();

  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }) => {
    console.log('handleFetchListData:params:', params);

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
      supplier_uid: params['manager_list_str'] ?? '',
      store_name: params['store_name_cn'] ?? '',
    };

    try {
      const response = await getStoreListPage(customParams);

      const data = response.data;
      data.list.map((item, index) => {
        item.key = Number(index) + 1
        return item
      })

      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (error) {
      message.error('数据请求异常');
    }
    return retData;
  }, [])

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        onListData={handleFetchListData}
        actionRef={actionRef}
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default StoreManagement