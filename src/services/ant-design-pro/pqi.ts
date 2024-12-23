import { request } from "@@/exports";


export async function getNumber(params) {
  return request<API.FormattedResponse>('/prod-api/an/get-number', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function savePQICostData(accountId: number, params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/save-pqi-cost-data/${accountId}`, {
    method: "PUT",
    data: {
      ...params
    }
  })
}

export async function invoicePqiCostEstimate(params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/invoice-pqi-cost-estimate`, {
    method: "PUT",
    data: {
      ...params
    }
  })
}

export async function createInvoice(params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/create-invoice/${params.t_id}`, {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function editorInvoice( params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/create-invoice/${params.t_id}`, {
    method: "POST",
    data: {
      ...params
    }
  })
}

export async function getInvoiceInfo(params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/get-invoice-info/${params.reim_detail_id}`, {
    method: "GET",
    data: {
      ...params
    }
  })
}

export async function deleteInvoice(params: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/delete-invoice/${params.id}`, {
    method: "DELETE",
    data: {
      ...params
    }
  })

}

// 获取奖金申请的列表
export async function getBonusList(project_id: any, uid: any) {
  return request<API.FormattedResponse>(`/prod-api/an/supplier/getBonusList?Project final_account id=${project_id}&uid=${uid}`, {
    method: "GET",
  })
}





