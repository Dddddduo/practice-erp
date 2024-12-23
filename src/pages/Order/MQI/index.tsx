import React, { useCallback, useRef } from "react";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-components";
import { getMqiQuoList } from "@/services/ant-design-pro/MQI";
import { PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ltemList";


const MQI: React.FC = () => {

  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();

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
      quo_no: params['quo_no'] ?? '',
      supplier_order_no: params['orders'] ?? '',
      brand_id: params['brand_en'] ?? '',
      city_id: params['city'] ?? '',
      market_id: params['market'] ?? '',
      store_id: params['store'] ?? '',
      select_date: params['declare'] ?? [],
      comp_start_at: params['declare'] ? params['declare'][0] : '',
      comp_end_at: params['declare'] ? params['declare'][1] : '',
      create_date: params['create'],
      create_start_at: params['create'] ? params['create'][0] : '',
      create_end_at: params['create'] ? params['create'][1] : '',
      class_type: params['typeLv1'] ?? '',
      class_type_id: params['typeLv2'] ?? '',
    };


    try {
      const response = await getMqiQuoList(customParams);

      const data = response.data;
      if (!data.list) {
        return
      }
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
      <ItemList
        onListData={handleFetchListData}
        actionRef={actionRef}
      />
    </PageContainer>
  )
}

export default MQI