import { request } from '@umijs/max';
import {ex} from "@/services/ant-design-pro/system";

export async function getSimCardList(params) {
    return request('/prod-api/an/gpt-get-sim-card-list', {
        method: 'GET',
        params: {
            ...params
        }
    })
}

export async function getSimCard(id: any) {
    return request(`/prod-api/an/gpt-get-sim-card/${id}`, {
        method: 'GET',
    })
}

export async function getShopList() {
    return request('/prod-api/an/supplier/getShopList', {
        method: 'GET',
    })
}

export async function createOrUpdateDevice(params) {
    return request('/prod-api/an/gpt-sim-card', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

export async function simCardList(params: any) {
  return request(`/prod-api/an/supplier/sim-card-list`, {
    method: "GET",
    params: {
      ...params
    }
  })
}

export async function simCardBaseInfo() {
  return request(`/prod-api/an/supplier/sim-card-base-info`, {
    method: "GET",
  })
}

export async function createSimCard(params) {
  return request(`/prod-api/an/supplier/create-sim-card`, {
    method: "POST",
    data: params
  })
}

export async function simCard(id: number) {
  return request(`/prod-api/an/supplier/sim-card/${id}`)
}

export async function updateSimCard(params, id: number) {
  return request(`/prod-api/an/supplier/update-sim-card/${id}`, {
    method: "PUT",
    data: params
  })
}

export async function simCardAll() {
  return request(`/prod-api/an/supplier/sim-card-all`)
}
