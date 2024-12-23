import React, { useRef, useCallback } from 'react';
import { message } from 'antd';
import { PageContainer } from '@ant-design/pro-components'
import ItemList from './components/ItemList';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { getSimCardList } from '@/services/ant-design-pro/simCard';

const SimCard = () => {
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
    console.log('查询params✅✅✅', params);
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      name: params['name'] ?? '',
      shop_id: params['shop'] ?? '',
      real_topic: params['real_topic'] ?? '',
      valid_period_start: params['time'] ? params['time'][0] : '',
      valid_period_end: params['time'] ? params['time'][1] : ''
    };

    try {
      const response = await getSimCardList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data.data;

      data.map(item => {
        item.key = item.id
        return item
      })

      retData.success = true;
      retData.total = response.data.total;
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
      />
    </PageContainer>
  )
}

export default SimCard
