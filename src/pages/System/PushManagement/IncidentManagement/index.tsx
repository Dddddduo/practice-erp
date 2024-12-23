import React, { useCallback, useEffect, useState, useRef } from 'react';
import ItemList from './components/ItemList';
import { PageContainer } from '@ant-design/pro-components';
import { getIncidentList, getEventList, getMethodList } from '@/services/ant-design-pro/pushManagement';
import { message } from 'antd';
import type { ActionType, ParamsType } from '@ant-design/pro-components';

/**
 * 事件推送组件主体
 * @constructor
 */
const IncidentManagement: React.FC = () => {
  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  const [events, setEvents]: any = useState([])
  const [methods, setMethods]: any = useState([])
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

  const getIncidents = useCallback(async ({ current, pageSize, ...params }) => {
    console.log(params);

    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      name: params['name'] ?? ''
    };
    try {
      const eventData = await getEventList()
      let eventResult: any = []
      for (const item in eventData.data) {
        eventResult.push({
          id: item,
          name: eventData.data[item]
        })
      }
      setEvents(eventResult)


      const methodData = await getMethodList()
      let methodResult: any = []
      for (const item in methodData.data) {
        methodResult.push({
          id: item,
          name: methodData.data[item]
        })
      }
      setMethods(methodResult)

      const res = await getIncidentList(customParams)
      if (!res.success) {
        return retData;
      }
      const dataList = res.data;
      dataList.data.map(item => {
        for (const key in eventData.data) {
          if (Number(item.type) === Number(key)) {
            item.type = {
              id: item.type,
              name: eventData.data[key]
            }
          }
        }
        for (const key in methodData.data) {
          if (Number(item.method) === Number(key)) {
            item.method = {
              id: item.method,
              name: methodData.data[key]
            }
          }
        }
      })

      retData.success = true;
      retData.total = dataList.total;
      retData.data = dataList.data ?? [];
    } catch (e) {
      error('数据请求异常');
    }
    console.log(retData);

    return retData;
  }, [])

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={getIncidents}
        success={success}
        error={error}
        events={events}
        methods={methods}
      />
    </PageContainer>
  )
}

export default IncidentManagement