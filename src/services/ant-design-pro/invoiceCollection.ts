import {request} from "@@/exports";


export async function invoiceCollectionByBatch(params) {
  return request('/prod-api/an/supplier/invoice-collection-operate-by-batch', {
    method: 'PUT',
    data: {
      ...params
    }
  })
}

export async function addInvoiceInfo(params) {
  return request<API.FormattedResponse>('/prod-api/an/supplier/create-invoice-info', {
    method: 'POST',
    data: {
      ...params
    }
  })
}
