import { request } from '@umijs/max';

export async function getOrderList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getOrderList', {
    method: 'GET',
    params: {
      ...params,
    },
    timeout: 60000,
  });
}

export async function appoTask(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/appoTask', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getCompanyList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/GetCompanyList', {
    method: 'GET',
  });
}

export async function updateOrder(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/updateOrder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getMaItemInfoByMaId(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMaItemInfoByMaId', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getMaCateLv1List(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMaCateLv1List', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getMaCateList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMaCateList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function modifySubCate(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/modifySubCate', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getOrderStatusList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getOrderStatusList', {
    method: 'GET',
  });
}

export async function getMaCateLv0List() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getMaCateLv0List', {
    mtehod: 'GET',
  });
}

export async function getAppoTaskSubmitInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getAppoTaskSubmitInfo', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getNodeList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getNodeList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function updateApproveInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/updateApproveInfo', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getReportInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReportInfo', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getOptions() {
  return request<API.FormattedResponse>('/prod-api/ea/report/getOptions', {
    method: 'GET',
  });
}

export async function createOrder(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getSameAppoSignList(params) {
  return request('/prod-api/an/supplier/getSameAppoSignList', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function approveReport(params) {
  return request('/prod-api/an/supplier/approveReport', {
    method: "POST",
    data: {
      ...params
    }
  })
}