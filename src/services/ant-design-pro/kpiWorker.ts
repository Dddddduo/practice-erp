import { request } from "@umijs/max";

export async function getKpiItemListPage(params) {
  return request('/prod-api/an/supplier/getKpiItemListPage', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createOrUpdateKpiItem(params) {
  return request('/prod-api/an/supplier/createOrUpdateKpiItem', {
    method: 'POST',
    data: {
      ...params
    }
  })
}