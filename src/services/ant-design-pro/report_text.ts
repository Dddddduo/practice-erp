import {request} from "@@/exports";

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
