import React, { useRef, useReducer, useCallback, useEffect, useState } from "react"
import { PageContainer } from '@ant-design/pro-components'
import { isEmpty } from "lodash";
import { message } from "antd";
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { getFinanceCollListPage } from "@/services/ant-design-pro/maintenanceDepartment";
import {bcMath} from "@/utils/utils";

const MaintenanceDepartment: React.FC = () => {
  //选中总金额
  const [total, setTotal] = useState({
    amount: '0.00',
    cost: '0.00',
    excl_amount: '0.00',
    tax: '0.00',
  });
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
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

  const handleFetchListData = useCallback(
    async ({ current, pageSize, ...params }, sort: ParamsType) => {
      console.log(params);

      const retData = {
        success: false,
        total: 0,
        data: [],
      };
      const customParams = {
        page: current,
        page_size: pageSize,
        department: params['department'] ?? '',
        coll_yes_or_no: params['collection'] ?? '',
        select_date: params['create_at'] ?? [],
        create_start_at: params['create_at'] ? params['create_at'][0] : '',
        create_end_at: params['create_at'] ? params['create_at'][1] : '',
        invoice_type:params['type'] ?? '',
        messrs: params['messrs'] ?? '',
        amount_at:params['excl_amount'] ? params['excl_amount'][0] : '',
        amount_end:params['excl_amount'] ? params['excl_amount'][1] : '' ,
      };
      try {
        const response = await getFinanceCollListPage(customParams);
        if (!response.success) {
          return retData;
        }

        const data = response.data;
        data.list.map((item) => {
          item.key = item.id;
          return item;
        });

        retData.success = true;
        retData.total = data.total;
        retData.data = data.list ?? [];
      } catch (e) {
        error('数据请求异常');
      }
      return retData;
    },
    [],
  );

  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
    const amounts = selectedRows.flatMap(item =>
      item.detail_list[0].amount || "0.00"
    );
    const costs = selectedRows.flatMap(item =>
      (item.children_quos || []).map(detail => detail.cost || "0.00")
    );
    const exclAmounts = selectedRows.flatMap(item =>
      item.detail_list[0].excl_amount || "0.00"
    );
    const taxes = selectedRows.flatMap(item =>
      item.detail_list[0].tax || "0.00"
    );

    const totalAmount = amounts.reduce((sum, value) => bcMath.add(sum, value,2), "0.00");
    const totalCost = costs.reduce((sum, value) => bcMath.add(sum, value,2), "0.00");
    const totalExclAmount = exclAmounts.reduce((sum, value) => bcMath.add(sum, value,2), "0.00");
    const totalTax = taxes.reduce((sum, value) => bcMath.add(sum, value,2), "0.00");

    setTotal({
      amount: totalAmount,
      cost:totalCost,
      excl_amount: totalExclAmount,
      tax: totalTax,
    });
  };

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        success={success}
        error={error}
        onRowSelected={handleRowSelection}
        selectedRowsState={selectedRowsState}
        total={total}
      />
    </PageContainer>
  );
}

export default MaintenanceDepartment
