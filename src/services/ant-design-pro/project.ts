import { request } from '@umijs/max';

export async function getScanList(
  params: {
    pageSize: number,
    page: number
  },
) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/get3DScanList', {
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export async function createOrUpdate(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdate3DScan', {
    method: 'POST',
    params: {
      ...params
    }
  })
}

export async function createShareLink(params) {
  return request<API.FormattedResponse>('/prod-api/open/v1/create-share-link', {
    method: 'POST',
    params: {
      ...params
    }
  })
}

export async function getStoreMergeData() {
  return request<API.FormattedResponse>('/prod-api/an/brand/getStoreMergeData', {
    method: 'GET'
  })
}

export async function getStoreList(params) {
  return request<API.FormattedResponse>('/prod-api/an/brand/getStoreList', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function getAreaMergeData(params) {
  return request<API.FormattedResponse>('/prod-api/an/brand/getAreaMergeData', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function customerCenterAlarmList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/customer-center-alarm-list', {
    method: 'get',
    params: {
      ...params
    }
  })
}

export async function indexShield() {
  return request('/prod-api/an/supplier/hardware/indexShield', {
    method: "GET",
    // params: {
    //   ...params
    // }
  })
}

export async function removeShield(id: number) {
  return request(`/prod-api/an/supplier/hardware/removeShield/${id}`, {
    method: "PUT"
  })
}

export async function storeShield(params) {
  return request('/prod-api/an/supplier/hardware/storeShield', {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function deleteHardwareAlarm(id) {
  return request(`/prod-api/an/supplier/delete-hardware-alarm/${id}`, {
    method: 'DELETE'
  })
}

// /prod-api/an/supplier/customer-center-command-list

export async function customerCenterCommandList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/customer-center-command-list', {
    method: 'get',
    params: {
      ...params
    }
  })
}

export async function getProjectProcessListPage(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectProcessListPage', {
    method: 'get',
    params: {
      ...params
    }
  })
}

export async function getProjectTypeList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectTypeList', {
    method: 'get',
  })
}

// /prod-api/an/supplier/getProjectProcessDetailList

export async function getProcess(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectProcessDetailList', {
    method: 'get',
    params: {
      ...params
    }
  })
}
// /prod-api/an/supplier/getProjectList PQI
export async function getProjectList(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectList', {
    method: 'get',
    params: {
      ...params
    }
  })
}

// /prod-api/an/supplier/createOrUpdateProject
export async function createOrUpdateProject(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateProject', {
    method: 'post',
    data: {
      ...params
    }
  })
}
// /prod-api/an/supplier/getProjectInfo
export async function getProjectInfo(params) {
  console.log("params", params)
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectInfo', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

// /prod-api/an/supplier/getProjectStatusList
export async function getProjectStatusList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectStatusList', {
    method: 'get',
  })
}
// /prod-api/an/supplier/deleteProject/86
// /prod-api/an/supplier/deleteProject/74
export async function deleteProject(id) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/deleteProject/${id}`, {
    method: 'post',

  })
}
// /prod-api/an/supplier/getProjectEquipmentList
export async function getProjectEquipmentList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getProjectEquipmentList', {
    method: 'get',
  })
}

// 姓名接口 /prod-api/brands/getInitData

export async function getInitData() {
  return request<API.FormattedResponse>('/prod-api/brands/getInitData', {
    method: 'get',
  })
}
// /prod-api/an/supplier/createOrUpdateProjectProcessDetail
export async function createOrUpdat(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateProjectProcessDetail', {
    method: 'post',
    data: {
      ...params
    }
  })
}

// /prod-api/an/supplier/switchCheckStatus

// /prod-api/an/supplier/switchCheckStatus

export async function switchCheckStatus(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/switchCheckStatus', {
    method: 'post',
    data: {
      ...params
    }
  })
}

// 查看成本 /prod-api/an/supplier/getAllCostList
export async function getAllCostList(params) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getAllCostList`, {
    method: 'get',
    params: {
      ...params
    }
  })
}

// 获取员工列表
export async function getAllUserList() {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getAllUserList`, {
    method: 'get',
  })
}

// /prod-api/an/supplier/getFinanceReimInfoBatch
export async function getFinanceReimInfoBatch(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getFinanceReimInfoBatch', {
    method: 'post',
    data: {
      ...params
    }
  })
}

export async function delPayment(params) {
  return request('/prod-api/an/supplier/delPayment', {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function updatePaymentSingle(params) {
  return request('/prod-api/an/supplier/updatePaymentSingle', {
    method: "POST",
    data: {
      ...params
    }
  })
}

// 修改收款明细
export async function UpdateReimInfo(params) {
  return request('/prod-api/an/supplier/UpdateReimInfo', {
    method: "PUT",
    data: {
      ...params
    }
  })
}

// /prod-api/an/supplier/createOrUpdateFinanceReimAlone
export async function createOrUpdateFinanceReimAlone(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateFinanceReimAlone', {
    method: 'post',
    data: {
      ...params
    }
  })
}

// /prod-api/an/supplier/getProjectData
export async function finalAcceptance(pqi_id: number) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/finalAcceptance/${pqi_id}`, {
    method: 'GET',
  })
}
// /prod-api/an/supplier/getUserList
export async function getUserList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getUserList', {
    method: 'get',
  })
}

// /prod-api/an/supplier/getAllWorkerList
export async function getAllWorkerList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getAllWorkerList', {
    method: 'get',
  })
}

export async function getCollectMoneyList(params: any) {
  return request('/prod-api/an/supplier/getCollectMoneyList', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function getVoCostList(params: any) {
  return request('/prod-api/an/supplier/getVoCostList', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function getFileUrlByIds(params: any) {
  return request('/prod-api/an/getFileUrlListByIds', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function addCollectMoneyItem(params) {
  return request('/prod-api/an/supplier/addCollectMoneyItem', {
    method: "PoST",
    data: {
      ...params
    }
  })
}

export async function addVoCostItem(params) {
  return request('/prod-api/an/supplier/addVoCostItem', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getChoiceList(params) {
  return request('/prod-api/an/supplier/getChoiceList', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function getContractProfitRate(params) {
  return request('/prod-api/an/supplier/getContractProfitRate', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function switchProjectStatus(params) {
  return request('/prod-api/an/supplier/switchProjectStatus', {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function getProjectBackListAll(params) {
  return request('/prod-api/an/supplier/getProjectBackListAll', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function getAccountList() {
  return request('/prod-api/an/supplier/getAccountList', {
    method: "GET",
  })
}

export async function leakageReportList(params) {
  return request('/prod-api/an/gpt-leakage-report-list', {
    method: 'GET',
    params: {
      ...params
    },
    responseType: ('export' in params) ? 'arraybuffer' : ''
  })
}

export async function leakageReportStoreUpdate(params) {
  return request('/prod-api/an/gpt-leakage-report-store-update', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function leakageReportDestroy(id) {
  return request(`/prod-api/an/gpt-leakage-report-destroy/${id}`, {
    method: "DELETE"
  })
}

// 获取iaq图表数据
export async function getIaqHistory(params) {
  return request('/prod-api/an/supplier/hardware/statHistory', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function leakageReportReset(id) {
  return request(`/prod-api/an/gpt-leakage-report-reset/${id}`, {
    method: "PUT"
  })
}

export async function getPqiInvoiceInfo(params) {
  return request(`/prod-api/an/supplier/getPqiInvoiceInfo`, {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function createPqiPayInfo(params: any) {
  return request(`/prod-api/an/supplier/create-pqi-pay-info`, {
    method: "POST",
    data: {
      ...params
    }
  })
}


export async function weeklyToDays(monthly: string) {
  return request(`/prod-api/an/supplier/weekly-to-days/${monthly}`, {
    method: "GET",
  })
}

export async function getTags() {
  return request(`/prod-api/an/supplier/get-tags`, {
    method: "GET",
  })
}

export async function mark(params: any) {
  return request(`/prod-api/an/supplier/mark`, {
    method: "POST",
    params: {
      ...params
    }
  })
}

export async function getTagById(quoId: any) {
  return request(`/prod-api/an/supplier/getTagById/${quoId}`, {
    method: "GET",
  })
}

export async function getByRules(params: any) {

  if (params.tagSubId === undefined) params.tagSubId = 0

  return request(`/prod-api/an/supplier/getByRules`, {
    method: "GET",
    params: {
      ...params
    }
  })
}

/**
 * 机电控制
 */
// 获取机电信息
export async function getMachineInfo(params:any) {
  return request(`/prod-api/an/supplier/getMachineInfo`, {
    method: "GET",
    params: {
      ...params
    }
  })
}
//获取楼层信息
export async function getFloorsData(params:any) {
  return request(`/prod-api/an/supplier/getFloorsData`, {
    method: "GET",
    params: {
      ...params
    }
  })
}
//操作记录
export async function getOperationRecord(params:any) {
  return request(`/prod-api/an/supplier/logs`, {
    method: "GET",
    params: {
      ...params
    }
  })
}
//报警记录
export async function getWarningsRecord(params:any) {
  return request(`/prod-api/an/supplier/warnings`, {
    method: "GET",
    params: {
      ...params
    }
  })
}
//一键清除报警记录
export async function clearAllWarningsRecord() {
  return request(`/prod-api/an/supplier/clear-all-warnings`, {
    method: "POST",
  })
}

// 获取电量历史数据
export async function getHistory(params?:any) {
  return request(`/prod-api/an/supplier/get-history`, {
    method: "GET",
    params: {
      ...params
    }
  })
}
//获取城市列表
export async function getCityOptionList() {
  return request(`/prod-api/an/supplier/getCityOptionList`, {
    method: "GET",
  })
}
//获取品牌
export async function getBrandOptionList(city:number) {
  return request(`/prod-api/an/supplier/getBrandOptionList/${city}`, {
    method: "GET",
  })
}
//获取商场列表
export async function getMarketOptionList(city:number) {
  return request(`/prod-api/an/supplier/getMarketOptionList/${city}`, {
    method: "GET",
  })
}

//获取店铺列表
export async function getShopOptionList(brand:number,city:number,market:number) {
  return request(`/prod-api/an/supplier/getShopOptionList/${brand}/${city}/${market}`, {
    method: "GET",
  })
}

//店铺分页列表
export async function getShopList(params?:any) {
  return request(`/prod-api/an/supplier/center-shop-list`, {
    method: "GET",
    params: {
      ...params
    }
  })
}



