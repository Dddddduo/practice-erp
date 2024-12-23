// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
export async function wxLogin(
  params: {
    code?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FormattedResponse>('/prod-api/api/login/qyCode', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function indexMenus() {
  return request('/prod-api/index-menus', {
    method: 'GET'
  })
}