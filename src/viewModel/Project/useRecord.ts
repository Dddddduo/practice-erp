import React, { useCallback, useRef, useState } from 'react';
import { getOperationRecord, getWarningsRecord } from '@/services/ant-design-pro/project';
import { produce } from "immer";
import { Form } from "antd";
import { ActionType } from "@ant-design/pro-components";

export const useRecord = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const [dataSource, setDataSource] = useState({
    containerStatus: false,
    operationRecord: [],
    warningsRecord: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Update container status
   */
  const toggleContainer = (status: boolean) => {
    setDataSource(
      produce(draft => {
        draft.containerStatus = status;
      })
    );
  };

  const openContainer = () => toggleContainer(true);
  const closeContainer = () => toggleContainer(false);

  /**
   * Fetch records
   * @param {string} type - Type of record to fetch ('operation' or 'warnings')
   * @param {object} params - Pagination and additional parameters
   * @returns {Promise<object>} - The fetched records
   */
  const fetchRecords = useCallback(async (type: 'operation' | 'warnings', { current, pageSize, ...params }) => {
    const retData = {
      success: false,
      total: 0,
      current: 1,
      data: []
    };

    const customParams = {
      shop_id: 1193,
      page: current,
      page_size: pageSize,
    };

    try {
      setLoading(true);
      const response = type === 'operation' ? await getOperationRecord(customParams) : await getWarningsRecord(customParams);

      if (!response.success) {
        return retData;
      }

      const data = response.data.map((item: any) => ({
        ...item,
        shop_id: item.id
      }));

      retData.success = true;
      retData.data = data;
      retData.total = Math.max(...data.map((item:any) => item.shop_id));
    } catch (error) {
      console.error(`fetchRecords error for ${type}:`, error);
    } finally {
      setLoading(false);
    }

    return retData;
  }, []);

  const getOperationRecordData = (params: any) => fetchRecords('operation', params);
  const getWarningsRecordData = (params:any) => fetchRecords('warnings', params);

  return {
    dataSource,
    openContainer,
    closeContainer,
    getOperationRecordData,
    getWarningsRecordData
  };
};
