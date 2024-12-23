import {request} from '@umijs/max';

export async function deleteReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/deleteReim', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function applyDeleteReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/applyDForDelReim', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getReimCount(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimCount', {
    method: 'GET',
    params: {
      ...params
    }
  })
}