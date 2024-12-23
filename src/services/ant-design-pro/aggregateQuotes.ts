import { request } from '@umijs/max';

export async function getMergeQuoList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMergeQuoList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function exportGucciMonthlyClosingSummaryExcel(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/exportGucciMonthlyClosingSummaryExcel', {
    method: 'GET', 
    params: {
      ...params
    }
  })
}

export async function exportFendiMonthlyClosingSummaryExcel(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/exportFendiMonthlyClosingSummaryExcel', {
    method: 'GET', 
    params: {
      ...params
    }
  })
}

export async function exportMonclerMonthlyClosingSummaryExcel(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/exportMonclerMonthlyClosingSummaryExcel', {
    method: 'GET', 
    params: {
      ...params
    }
  })
}

export async function exportDiorMonthlyClosingSummaryExcel(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/exportDiorMonthlyClosingSummaryExcel', {
    method: 'GET', 
    params: {
      ...params
    }
  })
}

export async function exportMergeQuo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/exportMergeQuo', {
    method: 'GET', 
    params: {
      ...params
    }
  })
}

export async function getCustomerInvoiceInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getCustomerInvoiceInfo', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createOrUpdateFinanceCollAlone(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateFinanceCollAlone', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getCompanyList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/GetCompanyList', {
    method: 'GET'
  })
}

export async function getFinanceCollInfoBatch(params) {
  return request('/prod-api/an/supplier/getFinanceCollInfoBatch', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function gucciFree20(params) {
  return request('/prod-api/an/supplier/gucciFree20', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function gucciMergeQuo(params) {
  return request('/prod-api/an/supplier/gucciMergeQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}