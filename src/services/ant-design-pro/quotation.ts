import { request } from '@umijs/max';

export async function getQuoList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getMaCateLv0List() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMaCateLv0List', {
    method: 'GET'
  })
}

export async function getClassTypeListOutSide(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getClassTypeListOutSide', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getColorMarkList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getColorMarkList', {
    method: 'GET'
  })
}

export async function getCompanyList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/GetCompanyList', {
    method: 'GET'
  })
}

// 查看打款记录
export async function showPaymentInfo(ids: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/showPaymentInfo?detail ids=${ids}`, {
    method: 'GET'
  })
}

// 修改打款记录
export async function updatePaymentInfo(params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/updatePaymentInfo`, {
    method: 'PUT',
    data: {
      ...params
    }
  })
}

export async function uploadQuo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/uploadQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getBrandContactsList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getBrandContactsList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function gucciMergeQuo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/gucciMergeQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getMergeQuoInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMergeQuoInfo', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function gucciGetEventExcel(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/gucciGetEventExcel', {
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

export async function getQuoExcelList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoExcelList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function quoColorMark(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/quoColorMark', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function approveReim(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/approveReim', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function shareQuotation(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/shareQuotation', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getReimListByOrderId(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimListByOrderId', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getQuoInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoInfo', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getClassTypeList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getClassTypeList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getQuoHistoryList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoHistoryList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function approveQuo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/approveQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getQuoHistoryPrice(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoHistoryPrice', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getReimHistoryPrice(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimHistoryPrice', {
    method: 'GET',
    params: {
      ...params
    }
  })
}


export async function getQuoPartsPrice(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoPartsPrice', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function mergeQuo(params) {
  return request('/prod-api/an/supplier/mergeQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function updateQuotationProfitRate(params) {
  return request('/prod-api/an/supplier/updateQuotationProfitRate', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getCalcProfitReimList(params) {
  return request('/prod-api/an/supplier/getCalcProfitReimList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createOrUpdateQuo(params) {
  return request('/prod-api/an/supplier/createOrUpdateQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function createPdfFile(params) {
  return request('/prod-api/an/supplier/createPdfFile', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getFileOssUrl(params) {
  return request('/prod-api/an/supplier/getFileOssUrl', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getUploadToken(params) {
  return request('/prod-api/an/supplier/getUploadToken', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function translateCnToEn(params) {
  return request<API.FormattedResponse>('/prod-api/general/cn-to-en', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export function generalBrandList() {
  return request<API.FormattedResponse>('/prod-api/general/brand-list', {
    method: 'GET',
    params: {}
  })
}

export function rotateImage(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/rotateImg', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getWaterLeakageRecordByQuoId(quoId) {
  return request<API.FormattedResponse>('/prod-api/an/gpt-leakage-by-quo/' + quoId, {
    method: 'GET',
  })
}

/**
 * 转单接口
 * @param params
 */
export function transferQuo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/transferQuo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}
