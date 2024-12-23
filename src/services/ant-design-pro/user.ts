import { request } from '@umijs/max';


export async function getUserButtons(
  data: {
    module: string;
    pos: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>(
    `/prod-api/an/gpt-user-buttons`,
    {
      method: 'GET',
      params: {
        ...data
      },
      ...(options || {}),
    },
  );
}

// 获取用户数据
export async function getList(
  data: {
    keyword: string;
    department: string;
    roleIds: Array<any>;
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>(
    `/prod-api/system/users/getList?data={"keyword":"${data.keyword}","department":"${data.department}","roleIds":[${data.roleIds}]}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

// 获取角色列表
export async function getRoleList(params) {
  return request<API.FormattedResponse>(`/prod-api/system/roles/getList`, {
    method: 'GET',
    params: {
      ...params
    }
  });
}

// 修改用户状态
export async function updateState(params: { user_id?: number; user_state?: boolean }) {
  return request<API.FormattedResponse>('/prod-api/system/users/updateState', {
    method: 'post',
    data: { data: params },
  });
}

export async function usersAdd(params) {
  return request('/prod-api/system/users/add', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

// 修改用户信息
export async function updateUser(params) {
  return request<API.FormattedResponse>('/prod-api/system/users/edit', {
    method: 'post',
    data: { data: { ...params } },
  });
}

// 修改密码
export async function updatePassword(params) {
  return request<API.FormattedResponse>('/prod-api/system/users/reset', {
    method: 'post',
    data: { data: params },
  });
}

// 同步信息
export async function synchronousData(params) {
  return request<API.FormattedResponse>(`/prod-api/system/users/sync-wechat-info/${params}`, {
    method: 'post',
  });
}

export async function createUserEmail(params) {
  return request('/prod-api/an/create_user_email', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function showUserEmail(id: number) {
  return request(`/prod-api/an/show_user_email/${id}`, {
    method: "PUT",
  })
}

export async function updateUserEmail(params, id) {
  return request(`/prod-api/an/update_user_email/${id}`, {
    method: "PUT",
    data: {
      ...params
    }
  })
}
