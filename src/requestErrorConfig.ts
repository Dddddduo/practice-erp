import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { AxiosResponse } from 'axios';
import { history } from 'umi';
// notification
// import {message} from 'antd';
import { LocalStorageService } from "@/utils/utils";
import { message } from "antd";

// 错误处理方案： 错误类型
// enum ErrorShowType {
//   SILENT = 0,
//   WARN_MESSAGE = 1,
//   ERROR_MESSAGE = 2,
//   NOTIFICATION = 3,
//   REDIRECT = 9,
// }

// 与后端约定的响应数据格式
// interface ResponseStructure {
//   success: boolean;
//   data: any;
//   errorCode?: number;
//   errorMessage?: string;
//   showType?: ErrorShowType;
// }

const loginPath = '/user/login';

interface InnerResponse {
    code: number;
    msg: string;
    data: any;
}

interface ResponseStructure {
    data: InnerResponse;
    code: number;
    msg: string;
}

interface FormattedResponse {
    data: any;
    success: boolean;
    message: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */

export const errorConfig: RequestConfig = {
    timeout: 5000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // 错误处理： umi@3 的错误处理方案。
    errorConfig: {
        // 错误抛出
        errorThrower: (res) => {
            console.log("errorThrower", res);
            // if (!code || 20000 !== code) {
            //   const error: any = new Error(msg);
            //   error.name = 'HttpError';
            //   error.info = {msg, code, data};
            //   throw error; // 抛出自制的错误
            // }


          // if (res.data.code && 1403 === res.data.code) {
            //   LocalStorageService.clear();
            //   const { location } = history;
            //   console.log(location);
            //
            //   let path
            //   if (location.pathname !== '/user/login') {
            //     path = location.pathname
            //     console.log(path);
            //
            //     history.push(`/user/login?redirect=${path}`);
            //   }
            //
            //   return;
            // }

        },
        // 错误接收及处理
        errorHandler: (error: any, opts: any) => {
            console.log("errorHandler", error, opts);
            if (opts?.skipErrorHandler) throw error;

            if (error.name === "AxiosError") {
                console.log('AxiosError', error);
                if (error?.response && 422 === error.response.status) {
                    message.error(error.response.message).then(r => {
                        console.log("errorHandler:r:", r);
                    });
                    LocalStorageService.clear();

                    const { location } = history;
                    let path
                    if (location.pathname !== '/user/login') {
                        path = location.pathname
                        history.push(`/user/login?redirect=${path}`);
                    }
                    console.log("errorHandler:history:err:", error);
                    return;
                }

                throw error;
            }
            // 我们的 errorThrower 抛出的错误。
            if (error.name === 'HttpError') {
                // const errorInfo: ResponseStructure | undefined = error.info;
                // if (errorInfo) {
                //   const {msg} = errorInfo;
                //   console.log('hhhhh')
                //   message.error(msg);
                // }
            } else if (error.response) {
                // Axios 的错误
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                // message.error(`Response status:${error.response.status}`);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                // message.error('None response! Please retry.');
            } else {
                // 发送请求时出了点问题
                // message.error('Request error, please retry.');
            }
        },
    },

    // 请求拦截器
    requestInterceptors: [
        (config: RequestOptions) => {
            if (!config.headers) {
                config.headers = {};
            }

            const loginInfo = LocalStorageService.getItem('loginInfo');
            if (null !== loginInfo && loginInfo.accessToken) {
                const { accessToken, tokenType } = loginInfo;
                config.headers['Authorization'] = `${tokenType} ${accessToken}`;
            }

            // concat('?token = 123')
            const url = config?.url;
            console.log('request:', url);
            return { ...config, url };
        },
    ],

    // 响应拦截器
    responseInterceptors: [
        (response): AxiosResponse => {

            if (200 !== response.status) {
                console.log('not 200', response.data);
                // todo... 处理
            }


            // console.log("blob:resp:", )
            if (response.data instanceof Blob || response instanceof Blob) {
                return {
                    ...response,
                }
            }

            if (
              response.config.url.includes("exportEmployeeKpi") ||
              response.config.url.includes("brand-shop-template") ||
              response.config.url.includes("gpt-leakage-report-list")
            ) {
                console.log("aaaBlob:", response)
                return response;
            }

            // todo... 返回401或403，在这里抛出异常，到error拦截器中处理登出操作
            const responseData = response.data as unknown as ResponseStructure;
            let formattedResponse: FormattedResponse = {
                data: null,
                success: false,
                message: ''
            };
            if (20000 !== responseData.code) {
                formattedResponse.message = responseData.msg;
                return {
                    ...response,
                    data: formattedResponse
                };
            }

            const innerData = responseData.data;
            if (0 !== innerData.code) {
                formattedResponse.message = innerData.msg;
                return {
                    ...response,
                    data: formattedResponse
                };
            }

          console.log('responseresponse', response)

            formattedResponse = {
                data: innerData.data || innerData.ret,
                success: true,
                message: innerData.msg
            };
            return {
                ...response,
              data: formattedResponse,
            };
        },
    ],
};
