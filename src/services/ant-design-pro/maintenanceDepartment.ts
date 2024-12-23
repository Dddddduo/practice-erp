import { request } from '@umijs/max';

export async function getFinanceCollListPage(params) {
  const res = await request('/prod-api/an/supplier/getFinanceCollListPage', {
    method: 'GET',
    params: {
      ...params
    }
  })

  // console.log('稀奇研究', res)

  return res
}

export async function createOrUpdateFinanceCollAlone(params) {
  return request('/prod-api/an/supplier/createOrUpdateFinanceCollAlone', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function getIncomeList(params) {
  return request('/prod-api/an/supplier/getIncomeList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getInvoiceList(params) {
  return request('/prod-api/an/supplier/getInvoiceList', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

//获取客户名称
export async function getCustomerInvoiceInfo() {
  return request('/prod-api/an/supplier/getCustomerInvoiceInfo', {
    method: 'GET',
  })
}
