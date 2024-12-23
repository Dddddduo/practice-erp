import { request } from '@umijs/max';

export async function getReimList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimList', {
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export async function getReimHistoryList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimHistoryList', {
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export async function getReimInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimInfo', {
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export async function getQtyMapList() {
  return request<API.FormattedResponse>('/prod-api/general/qty-map', {
    method: 'GET'
  })
}

export async function updateReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/approveReim', {
    method: "GET",
    params: {
      ...params,
    },
  })
}

export async function createOrUpdate(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateReim', {
    method: "POST",
    data: {
      ...params,
    },
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

export async function transferReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/transferReim', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getSameReimList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getSameReimList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getReimExcelList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimExcelList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createFinanceReimBatch(params) {
  return request('/prod-api/an/supplier/createFinanceReimBatch', {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function createOrUpdateReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateReim', {
    method: "POST",
    data: {
      ...params,
    },
  })
}


export async function invoiceFmCostEstimate(params) {
  return request('/prod-api/an/supplier/invoice-fm-cost-estimate', {
    method: "PUT",
    data: {
      ...params,
    },
  })
}