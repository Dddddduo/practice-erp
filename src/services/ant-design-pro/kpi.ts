import { request } from '@umijs/max';

export async function deleteKpi(id: any) {
  return request(`/prod-api/an/supplier/deleteKpi/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteKpiItem(id: any) {
  return request(`/prod-api/an/supplier/deleteKpiItem/${id}`, {
    method: 'DELETE',
  });
}

export async function updateKpiShare(id, params) {
  return request(`/prod-api/an/supplier/updateKpiShare/${id}`, {
    method: 'PUT',
    data: {
      ...params
    }
  });
}


/** 获取KPI项目列表(page) GET */
export async function getKpiItemListPage(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/getKpiItemListPage', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function createOrUpdateKpiItem(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/createOrUpdateKpiItem', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function getKpiTableListPage(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/getKpiTableListPage', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function updateKpiTableItemIds(params) {
  return request('/prod-api/an/supplier/updateKpiTableItemIds', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getKpiItemListAll(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/getKpiItemListAll', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function getKpiTableInfo(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/getKpiTableInfo', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function delKpiTable(params?: { [key: string]: any }) {
  console.log("para", params)
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/delKpiTable', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function createKpiTable(params?: { [key: string]: any }) {
  console.log("para", params)
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/createKpiTable', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function getEmployeeKpiListPage(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/getEmployeeKpiListPage', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function getEmployeeListPage(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/getEmployeeListPage', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function getKpiTableListAll(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/getKpiTableListAll', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function delEmployeeKpi(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/delEmployeeKpi', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function exportEmployeeKpi(params?: { [key: string]: any }) {
  return request('/prod-api/an/supplier/exportEmployeeKpi', {
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'arraybuffer'
  });
}

export async function getEmployeeAll(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/getEmployeeAll', {
    method: 'GET',
    params: {
      ...params,
      status: "在职"
    },
  });
}

export async function shareKpi(params?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/an/supplier/shareKpi', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取Kpi信息
 * @param params
 */
export async function getKpiInfo(params) {
  return request('/prod-api/an/supplier/getKpiInfo', {
    method: "GET",
    params: {
      ...params
    }
  })
}

/**
 * submitKpi
 * @param data
 * @returns {*}
 */
export function submitKpi(data) {
  return request('/prod-api/an/supplier/submitKpi', {
    method: 'POST',
    data: {
      ...data
    }
  })
}

/**
 * 获取待入职员工列表
 * @returns {*}
 */
export function getProbationEndEmployeeList() {
  return request('/prod-api/an/supplier/getProbationEndEmployeeList', {
    method: 'GET'
  })
}
