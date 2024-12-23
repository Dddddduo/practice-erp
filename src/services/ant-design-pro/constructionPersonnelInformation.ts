import { request } from '@umijs/max';

export async function getAppoTaskConstructionReport(params) {
  return request('/prod-api/an/supplier/getAppoTaskConstructionReport', {
    method: 'GET',
    params: {
      ...params
    }
  })
}