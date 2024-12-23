import {request} from '@umijs/max';

export async function getQuoFixedListAll(params) {
  return request('/prod-api/an/supplier/getQuoFixedListAll', {
    mtehod: 'GET',
    params: {
      ...params
    }
  })
}

export async function getQuoFixedAreaManagerListAll(params) {
  return request('/prod-api/an/supplier/getQuoFixedAreaManagerListAll', {
    mtehod: 'GET',
    params: {
      ...params
    }
  })
}

export async function delQuoFixed(params) {
  return request('/prod-api/an/supplier/delQuoFixed', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function mergeQuoFixed(params) {
  return request('/prod-api/an/supplier/mergeQuoFixed', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function createOrUpdateQuoFixed(params) {
  return request('/prod-api/an/supplier/createOrUpdateQuoFixed', {
    method: 'POST',
    data: {
      ...params
    }
  })
}