// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/prod-api/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/prod-api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/api/login/pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/prod-api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/prod-api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/prod-api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function getImages(params: {
  file_ids?: string,
}, options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/an/getFileUrlListByIds', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getUploadToken(params: {
  file_suffix: string
  original_file_name: string
}, options?: { [key: string]: any }) {
  return request<API.FormattedResponse>('/prod-api/an/getUploadToken', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getFileUrlListByIds(params) {
  return request('/prod-api/an/getFileUrlListByIds', {
    method: "GET",
    params: {
      ...params
    }
  })
}

/**
 * 下载文件
 * @param data
 */
export function createPdfFilePlus(data) {
  return request('/prod-api/an/supplier/createSinglePdfFile', {
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 创建pdf
 * @param data
 * @returns {*}
 */
export function createPdf(data) {
  return request('/prod-api/an/supplier/createPdfFile', {
    method: 'post',
    data: {
      ...data
    }
  })
}

export function getUserInfo() {
  return request('/prod-api/user/info', {
    method: 'get',
  })
}

export async function resetpassword(params: any) {
  return request<API.FormattedResponse>('/prod-api/system/users/updatePassword', {
    method: 'post',
    data: {
      data: {
        ...params
      }
    }
  })
}

