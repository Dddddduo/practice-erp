import { request } from '@umijs/max';

export async function reimStats(params) {
  return request('/prod-api/an/supplier/reim/stats', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function statsExport(params) {
  return request('/prod-api/an/supplier/reim/statsExport', {
    method: 'GET',
    params: {
      ...params
    }
  })
}