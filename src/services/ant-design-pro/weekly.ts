import { request } from '@umijs/max';

/**
 * 获取周报列表
 * @param params
 */
export function getWeeklyReportList(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/getWeeklyReportList', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

/**
 * 删除周报
 * @param params
 */
export function deleteOrRollbackReport(params: { weekly_report_id: string, is_delete: string }) {
  return request('/prod-api/an/supplier/deleteOrRollbackReport', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

/**
 * 修改周报
 * @param params
 */
export function createOrUpdateWeeklyReport(params: any) {
  return request('/prod-api/an/supplier/createOrUpdateWeeklyReport', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export function getWeeklyReportInfo(params: any) {
  return request('/prod-api/an/supplier/getWeeklyReportInfo', {
    method: 'GET',
    params: {
      ...params
    }
  });
}
