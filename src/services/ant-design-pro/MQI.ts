import { request } from '@umijs/max';

export async function getMqiQuoList(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getMqiQuoList', {
        method: "GET",
        params: {
            ...params
        }
    })
}