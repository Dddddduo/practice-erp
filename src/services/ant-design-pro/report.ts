import { request } from '@umijs/max';


// http://local-api.huyudev.com/api/an/supplier/getACReportSomeOneCountList?report_id=247&worker_uid=0&floor_type=B3&data_group_type=device_name
// report_id=10744

export async function getACReportSomeOneCountListByDeviceName(
  params: {
    report_id?: number,
    worker_uid?: number,
    floor_type?: any,
    data_group_type?: string
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getACReportSomeOneCountList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getACReportFloorList(
  params: {
    report_id?: number
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getACReportFloorList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function lockReportStatus(
  params: API.LockReportStatusParams,
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/lockReportStatus?report_id=${params.report_id}&report_lock_status=${params.report_lock_status}`, {
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateStepSync(
  params: API.UpdateStepSyncParams,
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/updateReportDetailStep', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function getTeamDetailByUid(
  params: {
    report_id?: number,
    worker_uid?: number
  },
  options?: { [key: string]: any },
) {
  console.log('getTeamDetailByUid:', params);
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReportSomeOneProcessList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getList(
  params: {
    page_size: number,
    page: number
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReportList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function getTplList(options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReportTemplateList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getReportTeamList(
  params: {
    report_id: number,
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReportProcessTeamList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// ?report_id=10744

// 获取城市
export async function getCityList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getCityList', {
    method: 'GET'
  })
}

// 获取品牌
export async function getBrandList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getBrandList', {
    method: 'GET'
  })
}

// 获取商场
export async function getMarketList(params: { city_id: number }) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getMarketList?city_id=${params.city_id}`, {
    method: 'GET'
  })
}

// 获取店铺
export async function getShopList(
  params: { city_id: number | string, brand_id: number | string, market_id: number | string }
) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getShopList`, {
    method: 'GET',
    params: {
      ...params
    },
    timeout: 50000
  })
}

// 获取工人
export async function getWorkerList(params: { type: string }) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getAllWorkerList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

// 获取工作类型
export async function getMaCateList(params: { p_type: string }) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getMaCateLv1List?p_type=${params.p_type}`, {
    method: 'GET'
  })
}

export async function getReimCountCharsMulti(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getReimCountCharsMulti', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

// /prod-api/an/supplier/createOrUpdateProjectProcessProject

export async function createOrUpdateProject(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateProjectProcessProject', {
    method: 'POST',
    params: {
      ...params
    }
  })
}

export async function createOrderAndReport(params) {
  return request('/prod-api/an/supplier/createOrderAndReport', {
    method: "POST",
    data: params
  })
}

export async function createOrUpdateReport(params) {
  return request('/prod-api/an/supplier/createOrUpdateReport', {
    method: "POST",
    data: params
  })
}

export async function detailsByStep(id) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/details-by-step/' + id, {
    method: 'GET'
  })
}

/**
 * 更新签单
 * @param params
 */
export async function updateReportSign(params) {
  return request('/prod-api/an/supplier/updateReportSign', {
    method: 'POST',
    data: params
  })
}

// 更新17，18，19的签单
export async function updateSignId(params) {
  return request('/prod-api/an/supplier/updateSignId', {
    method: 'POST',
    data: params
  })
}


//选择订单
export async function getChooseOrder() {
  return request('/prod-api/an/supplier/getAllTempOrder', {
    method: 'GET',
  })
}

export async function getAllIdByOrderId(id) {
  return request('/prod-api/an/supplier/getAllIdByOrderId/' + id , {
    method: 'GET',
  })
}
