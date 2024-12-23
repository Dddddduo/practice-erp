import { request } from '@umijs/max';

export async function getStoreMergeData() {
  return request<API.FormattedResponse>('/prod-api/an/brand/getStoreMergeData', {
    method: 'GET',
  });
}

export async function getStoreList(params) {
  return request<API.FormattedResponse>('/prod-api/an/brand/getStoreList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getAreaMergeData(params) {
  return request<API.FormattedResponse>('/prod-api/an/brand/getAreaMergeData', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getFloors(params) {
  return request('/prod-api/an/supplier/getFloors', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getWeather(params) {
  return request('/prod-api/an/supplier/getWeather', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getMachineInfo(params) {
  return request('/prod-api/an/supplier/getMachineInfo', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function checkPasswd(passwd) {
  return request('/prod-api/an/supplier/check-passwd', {
    method: 'GET',
    params: {
      passwd: passwd,
    },
  });
}

export async function changeOperation(params) {
  console.log('打印params', params);

  return request('/prod-api/an/supplier/acOperation', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
// /an/supplier/updateStoreDeviceDetailById

export async function updateStoreDeviceDetailById(params: any) {
  return request('/prod-api/an/supplier/updateStoreDeviceDetailById', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getStoreDeviceByDeviceName(params: any) {
  return request('/prod-api/an/supplier/getDeviceInfoByDeviceName', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
