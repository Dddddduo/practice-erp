import React, { useState, useEffect, useCallback, useRef } from "react"
import { message } from "antd";
import ItemList from "./components/ItemList";
import { PageContainer } from '@ant-design/pro-components';
import { getUserEventList } from "@/services/ant-design-pro/pushManagement";
import type { ActionType, ParamsType } from '@ant-design/pro-components';

/**
 * 用户事件管理组件主体
 * @constructor
 */
const UserEventManagement: React.FC = () => {
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

  const getUserEvent = useCallback(async ({ current, pageSize, ...params }) => {
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      name: params['username'] ?? ''
    };
    try {
      const { data } = await getUserEventList(customParams)
      retData.success = true;
      retData.total = data.total;
      retData.data = data.data ?? [];
    } catch (e) {
      error('数据请求异常！')
    }

    return retData;
  }, [])

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={getUserEvent}
        success={success}
        error={error}
      />
    </PageContainer>
  )
}

export default UserEventManagement