import React, { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { PageContainer } from '@ant-design/pro-components'
import ItemList from "./components/ItemList"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { message } from "antd";
import { getFinanceReimOfficeAloneList } from "@/services/ant-design-pro/financialReimbursement";
import { getSettlementTypes } from "@/utils/utils";
import { isEmpty } from "lodash";
import {err} from "pino-std-serializers";


const officeReim: React.FC = () => {
  const [settlementTypes, setSettlementTypes] = useState<{}[]>([])
  // const [path, setPath] = useState<string>('')
  const [tableList, setTableList] = useState({})
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
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
    console.log("params", params)

    const customParams = {
      office_alone_at: params['month'] ?? '',
      status: params['status'] ?? ''
    };

    const retData = {
      success: false,
      total: 0,
      data: []
    };

    try {
      const response = await getFinanceReimOfficeAloneList(customParams);
      if (!response.success) {
        error(response.message);
        return retData;
      }

      const data = response.data;
      data.map(item => {
        item.key = item.uid
        return item
      })
      retData.success = true;
      retData.total = data.total;
      retData.data = data ?? [];
    } catch (e) {
      error('数据请求异常');
    }
    setTableList(retData)
    return retData;
  }, [])

  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

  return (
    <PageContainer>
      {contextHolder}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        success={success}
        error={error}
        settlementTypes={settlementTypes}
        onRowSelected={handleRowSelection}
        selectedRowsState={selectedRowsState}
        tableList={tableList}
      />
    </PageContainer>
  )
}

export default officeReim
