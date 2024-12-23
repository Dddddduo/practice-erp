import { request } from '@umijs/max';

export async function getFinanceReilListPage(params) {
  return request('/prod-api/an/supplier/getFinanceReilListPage', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function approveFinanceReim(params) {
  return request('/prod-api/an/supplier/approveFinanceReim', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getFinanceReimStatusMap(params) {
  return request('/prod-api/an/supplier/getFinanceReimStatusMap', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getFinanceAloneReimTypeListWithCondition() {
  return request('/prod-api/an/supplier/getFinanceAloneReimTypeListWithCondition', {
    method: 'GET',
  });
}

export async function createOrUpdateFinanceReimAlone(params) {
  return request('/prod-api/an/supplier/createOrUpdateFinanceReimAlone', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getFileUrlById(params) {
  return request('/prod-api/an/supplier/getFileUrlById', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getPaymentList(params) {
  return request('/prod-api/an/supplier/getPaymentList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function exportAloneReimExcel(params) {
  return request('/prod-api/an/supplier/exportAloneReimExcel', {
    method: 'GET',
    timeout: 50000,
    params: {
      ...params,
    },
  });
}

export async function getFinanceReimOfficeAloneList(params) {
  return request('/prod-api/an/supplier/getFinanceReimOfficeAloneList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function submitPayment(params) {
  return request('/prod-api/an/supplier/submitPayment', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 验证对公付款
export async function checkPayment(params) {
  return request('/prod-api/an/supplier/checkPayment', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function submitPaymentOfficeAlone(params) {
  return request('/prod-api/an/supplier/submitPayment', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function invoiceOcr(params) {
  return request('/prod-api/an/supplier/invoiceOcr', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function createOrUpdateInvoice(params) {
  return request('/prod-api/an/supplier/createOrUpdateInvoice', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function checkInfo(params) {
  return request('/prod-api/an/supplier/checkInfo', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function createOrUpdateIncome(params) {
  return request('/prod-api/an/supplier/createOrUpdateIncome', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 校验收款录入信息
export async function checkIncome(params) {
  return request('/prod-api/an/supplier/checkIncome', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function operateByBatchListIds(params) {
  return request('/prod-api/an/supplier/operate-by-batch', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function getOfficeReceipt(params) {
  return request('/prod-api/an/supplier/getOfficeReceipt', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function collectionOcr(params) {
  return request('/prod-api/an/supplier/collectionOcr', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getFinancePublicPaymentList(params) {
  return request('/prod-api/an/supplier/getFinancePublicPaymentList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 撤回自己的开票申请
export async function updateApplyInvoiceStatus(id: any) {
  return request(`/prod-api/an/supplier/updateApplyInvoiceStatus/${id}`, {
    method: 'PUT',
  });
}

// 删除打款录入记录
export async function deleteInput(params: any) {
  return request(`/prod-api/an/supplier/deleteInput`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
