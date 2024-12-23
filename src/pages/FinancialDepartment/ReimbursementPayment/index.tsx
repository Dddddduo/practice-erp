import React, {RefObject, useCallback, useEffect, useRef, useState} from "react"
import {PageContainer} from '@ant-design/pro-components'
import ItemList from "./components/ItemList"
import type {ActionType, ParamsType} from "@ant-design/pro-components";
import {message} from "antd";
import {getFinanceReilListPage} from "@/services/ant-design-pro/financialReimbursement";
import {bcMath, getSettlementTypes} from "@/utils/utils";
import {isEmpty} from "lodash";

const FinancialReimbursement: React.FC = () => {
  const [settlementTypes, setSettlementTypes] = useState<{}[]>([])
  const [path, setPath] = useState<string>('')
  const [tableList, setTableList] = useState({})
  const [currentTypeDesc, setCurrentTypeDesc] = useState('')
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

  const [selectedTotalAmount, setSelectedTotalAmount] = useState(0)

  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const url = window.location.href.split("/")
    const path = url[url.length - 1]
    const data = getSettlementTypes(path)

    // setPath(path)
    // setSettlementTypes(data)

    let settlement_type
    if (isEmpty(data)) {
      settlement_type = params['type']
    } else {
      settlement_type = params['type'] ? params['type'] : data[0].value
    }
    if (path === 'office') {
      settlement_type = 'office-alone-reim'
    }
    if(path === 'company'){
      settlement_type = 'other-pay-for-business'
    }

    const customParams = {
      page: current,
      page_size: pageSize,
      settlement_type: settlement_type ?? '',
      plat: params['payee'] ?? '',
      uid: params['payeePeople'] ?? '',
      type: params['reimType'] ?? '',
      status: params['status_cn'] ?? '',
      create_start_at: params['create_at'] ?? '',
      // create_end_at: params['create_at'] ? params['create_at'][1] : '',
      approve_date: params['approve_at'] ?? [],
      approve_start_at: params['approve_at'] ? params['approve_at'][0] : '',
      approve_end_at: params['approve_at'] ? params['approve_at'][1] : '',
    };
    try {
      const response = await getFinanceReilListPage(customParams);
      console.log('返回数据', response)
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
    setTableList(retData)
    return retData;
  }, [])

  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    console.log('被点击了',_, selectedRows)
    setSelectedRows(selectedRows);

    let total = 0

    for (let i = 0; i < selectedRows.length; i++) {
      const detailList = selectedRows[i]['detail_list']
      for (let j = 0; j < detailList.length; j++) {

        total = parseFloat(bcMath.add(total, Number(detailList[j]?.amount)))
      }
    }

    console.log('total', total)
    setSelectedTotalAmount(total)
  }

  useEffect(() => {
    const url = window.location.href.split("/")
    const path = url[url.length - 1]
    const data = getSettlementTypes(path)
    console.log(data);
    setPath(path)
    setSettlementTypes(data)
  }, [])

  return (
    <>
      <PageContainer>
        {contextHolder}
        <ItemList
          actionRef={actionRef}
          onListData={handleFetchListData}
          success={success}
          error={error}
          settlementTypes={settlementTypes}
          path={path}
          onRowSelected={handleRowSelection}
          selectedRowsState={selectedRowsState}
          tableList={tableList}
          selectedTotalAmount={selectedTotalAmount}
        />
      </PageContainer>
    </>
  )
}

export default FinancialReimbursement
