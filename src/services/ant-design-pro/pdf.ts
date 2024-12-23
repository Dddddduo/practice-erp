import { request } from '@umijs/max';

export async function getQuoTaxRate(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getQuoTaxRate', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function quotationSummaryPdf(params) {
  return request<API.FormattedResponse>('/prod-api/quotationSummaryPdf', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function quotationSummaryFixedPdf(params) {
  return request<API.FormattedResponse>('/prod-api/quotationSummaryFixedPdf', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function downloadExcel(params) {
  return request<API.FormattedResponse>('/prod-api/downloadExcel', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createPdfFile(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createPdfFile', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getFileOssUrl(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getFileOssUrl', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getMergeQuoFileName(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMergeQuoFileName', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function createSinglePdfFile(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createSinglePdfFile', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getCountPdf(params) {
  return request<API.FormattedResponse>('/prod-api/workerReport', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getConstructionPdfFileName(params) {
  return request('/prod-api/an/supplier/getConstructionPdfFileName', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getProjectInfo(params) {
  return request('/an/supplier/getProjectInfo', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getProjectInfoMessage(params) {
  return request('/prod-api/an/supplier/getProjectInfo', {
    method: 'GET',
    params: {
      ...params
    }
  })
}


export async function createPdf(params) {
  return request('/an/supplier/createPdfFile', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getFileOssurl(params) {
  return request('/an/supplier/getFileOssurl', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function emailPreview(params) {
  return request('/prod-api/an/emailPreview', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function sendEmail(params) {
  return request('/prod-api/an/sendEmail', {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function emailHistory(params) {
  return request('/prod-api/an/emailHistory', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function reuseConstructionInfo(params) {
  return request('/prod-api/an/supplier/reuseConstructionInfo', {
    method: "POST",
    data: {
      ...params
    }
  })
}
