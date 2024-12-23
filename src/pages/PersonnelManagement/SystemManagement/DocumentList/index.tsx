import React, { useRef, useCallback } from "react"
import { PageContainer } from "@ant-design/pro-components"
import ItemList from "./components/ItemList"
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { message } from "antd";
import { officeDocumentList } from "@/services/ant-design-pro/system";

const Document = () => {
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

  // const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
  //   console.log('handleFetchListData:params:', params);
  //   const retData: { success: boolean, total: number, data: {}[] } = {
  //     success: false,
  //     total: 0,
  //     data: []
  //   };

  //   const customParams: object = {
  //     page: current,
  //     page_size: pageSize,
  //     name: params['name'] ?? ''
  //   };
  //   try {
  //     const response = await officeDocumentList(customParams);
  //     if (!response.success) {
  //       return retData;
  //     }
  //     const data = response.data;
  //     data.map((item: { key: number, id: number }) => {
  //       item.key = item.id
  //     })
  //     retData.success = true;
  //     retData.total = data.total;
  //     retData.data = data ?? [];
  //   } catch (error) {
  //     message.error('Data request exception');
  //   }
  //   console.log(retData);

  //   return retData;
  // }, []);

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        // onListData={handleFetchListData}
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default Document