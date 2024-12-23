import { request } from '@umijs/max';

export async function userList() {
  return request('/prod-api/an/supplier/user-list', {
    method: 'GET',
  })
}

export async function getEmployeeNum() {
  return request('/prod-api/an/supplier/getEmployeeNum', {
    method: 'GET',
  })
}
