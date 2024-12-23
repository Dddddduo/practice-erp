import { request } from '@umijs/max';

export async function indexMenus(params) {
  return request('/prod-api/index-menus', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function showMenu(id) {
  return request(`/prod-api/show-menu/${id}`, {
    method: 'GET',
  })
}

export async function fullMenus() {
  return request('/prod-api/full-menus', {
    method: "GET"
  })
}

export async function createMenu(params) {
  return request('/prod-api/create-menu', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function updateMenu(params) {
  return request(`/prod-api/update-menu/${params.id}`, {
    method: 'PUT',
    data: {
      ...params
    }
  })
}

export async function deleteMenu(id: number) {
  return request(`/prod-api/delete-menu/${id}`, {
    method: 'DELETE'
  })
}

export async function users() {
  return request('/prod-api/index-users', {
    method: "GET"
  })
}

export async function updateUsersMenus(params) {
  return request('/prod-api/update-users-menus', {
    method: "PUT",
    data: {
      ...params
    }
  })
}

export async function indexUsersMenu(id: number) {
  return request(`/prod-api/index-users-menu/${id}`, {
    method: "GET"
  })
}

export async function indexMenusUser(id) {
  return request(`/prod-api/index-menus-user/${id}`, {
    method: 'GET'
  })
}

export async function indexButtons(params) {

  // console.log('<--------按钮列表', params)

  return request('/prod-api/an/gpt-buttons', {
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getPositions() {
  return request('/prod-api/an/supplier/get-positions', {
    method: 'GET',
  })
}

export async function createButton(params) {
  return request('/prod-api/an/gpt-create-button', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function updateButton(params) {
  return request(`/prod-api/an/gpt-update-button/${params.id}`, {
    method: 'PUT',
    data: {
      ...params
    }
  })
}

export async function deleteButton(id) {
  return request(`/prod-api/an/gpt-delete-button/${id}`, {
    method: 'DELETE',
  })
}

export async function assignButton(btnId, params) {
  return request(`/prod-api/an/gpt-assign/${btnId}`, {
    method: 'PUT',
    data: {
      ...params
    }
  })
}

export async function assignList(btnId) {
  return request(`/prod-api/an/gpt-assign-list/${btnId}`, {
    method: 'GET',
  })
}



