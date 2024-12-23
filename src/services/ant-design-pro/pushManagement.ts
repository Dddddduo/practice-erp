import {request} from '@umijs/max';

// 事件管理
export async function getIncidentList(params) {
  return request<API.FormattedResponse>('/prod-api/an/push-message/events', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function addIncident(params) {
  return request<API.FormattedResponse>(`/prod-api/an/push-message/create-event`, {
    method: "POST",
    params: {
      ...params
    }
  })
}

export async function updateIncident(params) {
  return request<API.FormattedResponse>(`/prod-api/an/push-message/update-event/${params.id}`, {
    method: "PUT",
    params: {
      ...params
    }
  })
}

export async function deleteIncident(params) {
  return request<API.FormattedResponse>(`/prod-api/an/push-message/delete-event/${params}`, {
    method: "DELETE",
  })
}

export async function getUserEventList(params) {
  return request<API.FormattedResponse>('/prod-api/an/push-message/user-events', {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function userBindEvent(params) {
  return request<API.FormattedResponse>('/prod-api/an/push-message/users-bind-events', {
    method: "POST",
    params: {
      ...params
    }
  })
}

export async function getEventList() {
  return request<API.FormattedResponse>('/prod-api/an/push-message/event-types', {
    method: "GET"
  })
}

export async function getMethodList() {
  return request<API.FormattedResponse>('/prod-api/an/push-message/push-methods', {
    method: "GET"
  })
}

export async function getUserList() {
  return request<API.FormattedResponse>('/prod-api/an/supplier/getUserList', {
    method: "GET"
  })
}

export async function getBindEventList(params) {
  return request<API.FormattedResponse>('/prod-api/an/push-message/all-events', {
    method: "GET",
    params: {
      ...params
    }
  })
}