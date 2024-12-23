import axios from 'axios'
import OSS from "ali-oss";
import {getUploadToken} from '@/services/ant-design-pro/quotation';
import {downloadExcel} from '@/services/ant-design-pro/system';
import {getUserButtons} from "@/services/ant-design-pro/user";
import {add, format, subtract, multiply, divide, bignumber} from 'mathjs';
import { useIntl } from 'umi';
export function passwordExpire(): boolean {
  let isExpire = false

  const value = LocalStorageService.getItem('password_time')

  if (value === null || value === undefined) {
    isExpire = true
    return isExpire
  }

  const currentTime = Date.now()

  var catchM = Math.floor(value / (1000 * 60));
  var currentM = Math.floor(currentTime / (1000 * 60));

  if (currentM - catchM <= 20) {
    console.log(currentM - catchM, '未过期');

    isExpire = false
  } else {
    console.log(currentM - catchM, '过期');

    isExpire = true
  }


  return isExpire
}

export function localDataExpire(time: number): boolean {
  let isExpire = false

  const currentTime = Date.now();
  const currentS = Math.floor(currentTime / 1000);
  const timeS = Math.floor(time / 1000);

  if (currentS - timeS <= 15) {
    // console.log(currentS - timeS, '未超过15秒');
    isExpire = false
  } else {
    // console.log(currentS - timeS, '超过了15秒');
    isExpire = true
  }

  return isExpire
}

/**
 * 高精度计算
 */
export const bcMath = {
  add: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const sum = add(num1, num2);
    return format(sum, {notation: 'fixed', precision: reserve});
  },
  sub: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const difference = subtract(num1, num2);
    return format(difference, {notation: 'fixed', precision: reserve});
  },
  mul: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2)) {
      return '0'
    }

    const product = multiply(num1, num2);
    return format(product, {notation: 'fixed', precision: reserve});
  },
  div: (num1: number, num2: number, reserve: number = 2): string => {
    if (isNaN(num1) || isNaN(num2) || 0 === num2) {
      return '0'
    }
    const quotient = divide(num1, num2);
    return format(quotient, {notation: 'fixed', precision: reserve});
  },
  fixedNum: (num: string, reserve: number = 2): string => {
    if (!num) {
      return num
    }

    // 如果有千分位逗号，则移除
    const numRemoveComma = num.replace(/,/g, '');

    // 创建一个高精度的数字
    const bigNum = bignumber(numRemoveComma);

    // 使用 toFixed() 方法来保留指定的小数位数
    return format(bigNum, {notation: 'fixed', precision: reserve});
  }
};

export const millennials = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return ''
  }

  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const showButtonByType = (ctrButtonMappings, module, pos = 'toolBarRender', defaultComponent = null) => {
  return getUserButtons({module: module, pos: pos}).then(r => {
    console.log("result", r);

    if (!r.success) {
      return [];
    }

    return r.data.length > 0 ? r.data.map(item => {
      if (item.name in ctrButtonMappings) {
        return ctrButtonMappings[item.name]
      }
    }) : [defaultComponent]
  })

}

interface AnyObject {
  [key: string]: any;
}

export const formatFormData = <T extends AnyObject>(data: T): AnyObject => {
  const result: AnyObject = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value && typeof value === 'object' && 'value' in value && 'label' in value) {
      result[key] = value.value;
    } else {
      result[key] = value;
    }
  });

  return result;
};


/**
 * 本地存储服务
 */
export const LocalStorageService = {
  setItem(key: string, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting item to localStorage", error);
    }
  },

  getItem(key: string) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Error getting item from localStorage", error);
      return null;
    }
  },

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage", error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },

  sync(key: string, value: any) {
    try {
      this.removeItem(key);
      this.setItem(key, value);
    } catch (error) {
      console.error("Reset localStorage", error);
    }
  }
};


/**
 * 下载文件
 * @param url
 * @param filename
 * @returns {Promise<AxiosResponse<any>>}
 */
export const downloadFile = (url, filename) =>
  axios
    .get(url, {
      responseType: 'blob'
    })
    .then((res) => {
      let type = {}
      if (filename.indexOf('pdf') !== -1) {
        type = {type: 'application/pdf'}
      } else {
        type = {type: 'application/vnd.ms-excel'}
      }

      const blob = new Blob([res.data], type) // 构造一个blob对象来处理数据，并设置文件类型
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE10
        navigator.msSaveBlob(blob, filename)
      } else {
        const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = filename // 指定下载文件名
        a.click()
        URL.revokeObjectURL(a.href) // 释放URL对象
      }
    })


export function parsePdfPath(contentUrl, title) {
  getUploadToken({file_suffix: 'pdf', only_download: 1}).then((res) => {
    const ossData = res.data
    const client = new OSS({
      region: 'oss-' + ossData.region_id,
      accessKeySecret: ossData.access_secret,
      accessKeyId: ossData.access_id,
      stsToken: ossData.secret_token,
      bucket: ossData.bucket
    })
    const filename = title + '.pdf'
    const response = {
      'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
    }
    let fileUrl = contentUrl
    fileUrl = fileUrl.substr(0, fileUrl.indexOf('.')) + '.pdf'
    const url = client.signatureUrl(fileUrl, {response})
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 100)
  })
}

export function getSettlementTypes(value) {
  if (value === 'weekly') {
    return [
      {value: 'part-time-labor-cost', label: '兼职 - 人工费', desc: '结算周期：上周四 ~ 本周五，用于结算兼职人工费'}
    ]
  }
  if (value === 'monthly') {
    return [
      {
        value: 'full-time-materials-cost',
        label: '全职 - 材料费',
        desc: '结算周期：上月21日 ~ 本月20日，用于结算本公司工人材料费'
      },
      {value: 'full-time-qiyedidi', label: '全职 - 企业滴滴', desc: '结算周期：用于结算本公司工人企业滴滴'},
      {value: 'full-time-huolala', label: '全职 - 货拉拉', desc: '结算周期：用于结算本公司工人货拉拉'},
      {
        value: 'liuyunfei-part-time',
        label: '刘云飞 - 下属',
        desc: '结算周期：上一个自然月，用于刘云飞下属兼职工人（不含刘云飞）结算上个月的费用'
      }
    ]
  }

  if (value === 'company') {
    return [
      {
        value: 'lixiaohai-pay-for-business',
        label: '李小海 - 对公',
        desc: '结算周期：上月16日 ~ 本月15日，用于李小海及其下属兼职工人结算上个月的费用'
      },
      {
        value: 'changyangfan-pay-for-business',
        label: '畅扬帆 - 对公',
        desc: '结算周期：上一个自然月，用于畅扬帆及其下属兼职工人结算上个月的费用'
      },
      {
        value: 'other-pay-for-business',
        label: '其它报销对公打款  ',
        desc: '结算周期：上周五 ~ 本周四，用于结算其他供应商费用'
      }
    ]
  }

  if (value === 'office') {
    return []
  }

  return [
    {value: 'full-time-qiyedidi', label: '全职 - 企业滴滴', desc: '结算周期：上一个自然月，用于企业滴滴对账'},
    {value: 'part-time-labor-cost', label: '兼职 - 人工费', desc: '结算周期：上周四 ~ 本周五，用于结算兼职人工费'},
    {
      value: 'full-time-materials-cost',
      label: '全职 - 材料费',
      desc: '结算周期：上月21日 ~ 本月20日，用于结算本公司工人材料费'
    },
    {
      value: 'liuyunfei-part-time',
      label: '刘云飞 - 下属',
      desc: '结算周期：上一个自然月，用于刘云飞下属兼职工人（不含刘云飞）结算上个月的费用'
    },
    {
      value: 'lixiaohai-pay-for-business',
      label: '李小海 - 对公',
      desc: '结算周期：上月16日 ~ 本月15日，用于李小海及其下属兼职工人结算上个月的费用'
    },
    {
      value: 'changyangfan-pay-for-business',
      label: '畅扬帆 - 对公',
      desc: '结算周期：上一个自然月，用于畅扬帆及其下属兼职工人结算上个月的费用'
    },
    {
      value: 'other-pay-for-business',
      label: '其它报销对公打款  ',
      desc: '结算周期：上周四 ~ 本周五，用于结算其他供应商费用'
    },
  ]
}

export function exportExcel(url, data, fileName) {
  const token = LocalStorageService.getItem('loginInfo')

  async function download() {
    // await axios.get('process.env.VUE_APP_BASE_API' + url,
    //   { headers: { Authorization: token.accessToken }, responseType: 'arraybuffer', params: { data: data }}).then((res) => {
    //   const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    //   if (window.navigator.msSaveOrOpenBlob) {
    //     navigator.msSaveBlob(blob, fileName)
    //   } else {
    //     const link = document.createElement('a')
    //     link.href = window.URL.createObjectURL(blob)
    //     link.download = fileName + '.xlsx'
    //     // For firefox appending the file to document has to be done. Firefox doesn't do it automatically unlike Chrome
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //     window.URL.revokeObjectURL(link.href)
    //   }
    // })
    downloadExcel(url, data).then(res => {
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName + '.xlsx'

        // For firefox appending the file to document has to be done. Firefox doesn't do it automatically unlike Chrome
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    })
    return true
  }

  return download()
}

/**
 * 生成唯一数字id
 */
export function generateUniqueId(): number {
  const currentTimestamp = Date.now();
  return Number(currentTimestamp + Math.floor(Math.random() * (9999999 + 1)));
}

export const formatToTwoDecimalPlaces = value => {
  if ('' === value) {
    return ''
  }
  const val = parseFloat(value);
  if (isNaN(val)) {
    return ''
  }

  return Number(value).toFixed(2);
}

import {produce} from "immer";
import {isArray, isString} from "lodash";
import {get, has, isEmpty, set} from "lodash";

export const handleParseStateChange: any = (currentState, path, value, limit = ':') => {
  const parts = path.split(limit)
  return produce(currentState, draft => {
    parts.reduce((acc, current, index) => {
      // 如果是最后一个元素，设置值
      if (index === parts.length - 1) {
        acc[current] = value;
        return null; // 最后一步不需要返回值
      }

      acc[current] = acc[current] || {};
      return acc[current];
    }, draft);
  });
};

export const handlePauseState = (isPause: boolean, pathRefs: { [key: string]: any }, path: string, timeout: number = 5000) => {
  if (isPause) {
    if (!has(pathRefs.current, path)) {
      pathRefs.current[path] = null;
    } else {
      if (pathRefs.current[path]) {
        clearTimeout(pathRefs.current[path] as unknown as number);
      }
    }

    return;
  }

  if (pathRefs.current[path]) {
    clearTimeout(pathRefs.current[path] as unknown as number);
  }

  pathRefs.current[path] = setTimeout(() => {
    console.log(`${path} timer over`)
    delete pathRefs.current[path];
  }, timeout);
}

export const handleMergeStatesByPath = (path, preState, newState, limit = ":") => {
  if ("" === path || isEmpty(path)) {
    return newState;
  }

  const pathArr = path.split(limit)
  set(newState, pathArr, get(preState, pathArr));
  return newState;
}

export const setStateMap = (key, value) => {
  LocalStorageService.setItem(key, value)
}

export const getStateMap = (key) => {
  return LocalStorageService.getItem(key) ?? {}
}

export const isPastDay = (time) => {
  // 将时间字符串转换为日期对象
  const givenDate = new Date(time);

  // 获取当前时间的年、月、日
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // 获取给定时间的年、月、日
  const givenYear = givenDate.getFullYear();
  const givenMonth = givenDate.getMonth();
  const givenDay = givenDate.getDate();

  // 检查给定时间是否早于当前时间，并且不是同一天
  if (givenDate < currentDate &&
    (givenYear !== currentYear || givenMonth !== currentMonth || givenDay !== currentDay)) {
    return true; // 给定时间已经过去了当天
  } else {
    return false; // 给定时间仍在当天
  }
}

export const getCurrentTimeString = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，然后确保两位数格式
  const day = ('0' + currentDate.getDate()).slice(-2); // 确保两位数格式
  const hours = ('0' + currentDate.getHours()).slice(-2); // 确保两位数格式
  const minutes = ('0' + currentDate.getMinutes()).slice(-2); // 确保两位数格式

  const formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;

  return formattedDate
}

export const filterOption = (input: string, option?: { label: string; value: string }) => {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
}

export const strToArr = (input: string | string[]): string[] => {
  // 如果输入是空字符串，返回空数组
  if (input === "") {
    return [];
  }

  if (isArray(input)) {
    if (input.length === 0) {
      return [];
    }

    return input;
  }

  // 否则，用逗号分割字符串并返回结果数组
  return input.split(',');
}

export const arrToStr = (input: string | string[]) => {
  if (isString(input)) {
    console.log("1111111")
    return input;
  }

  if (!isArray(input) || input.length === 0) {
    console.log("2222")
    return '';
  }
  console.log("333")
  return input.join(',');
}


// 机电全局i18n key value翻译
export const i18nGlobalKey = (originValue: any) => {
  const intl = useIntl();

  let finalValue: any = originValue;

  const mapData = {
    '今天': intl.formatMessage({
      id: 'today',
      defaultMessage: '今天',
    }),
    '系统参数': intl.formatMessage({
      id: 'systemParameters',
      defaultMessage: '系统参数',
    }),
    '无锡市': intl.formatMessage({
      id: 'wuxiCity',
      defaultMessage: '无锡市',
    }),
    '上海市': intl.formatMessage({
      id: 'shanghaiCity',
      defaultMessage: '上海市',
    }),
    '阴': intl.formatMessage({
      id: 'cloudy',
      defaultMessage: '阴',
    }),
    '东南': intl.formatMessage({
      id: 'southeast',
      defaultMessage: '东南',
    }),
    '东北': intl.formatMessage({
      id: 'northeast',
      defaultMessage: '东北',
    }),
    '东': intl.formatMessage({
      id: 'east',
      defaultMessage: '东',
    }),
    '湿度': intl.formatMessage({
      id: 'humidity',
      defaultMessage: '湿度',
    }),
    '指示灯': intl.formatMessage({
      id: 'indicatorLightInstructions',
      defaultMessage: '指示灯',
    }),
    '送风口': intl.formatMessage({
      id: 'airVent',
      defaultMessage: '送风口',
    }),
    '回风口': intl.formatMessage({
      id: 'returnAirVent',
      defaultMessage: '回风口',
    }),
    '运行': intl.formatMessage({
      id: 'running',
      defaultMessage: '运行',
    }),
    '停机': intl.formatMessage({
      id: 'shutdown',
      defaultMessage: '停机',
    }),
    '报警': intl.formatMessage({
      id: 'alert',
      defaultMessage: '报警',
    }),
    '漏水报警': intl.formatMessage({
      id: 'leakageAlarm',
      defaultMessage: '漏水报警',
    }),
    '空气优': intl.formatMessage({
      id: 'goodAirQuality',
      defaultMessage: '空气优',
    }),
    '空气良': intl.formatMessage({
      id: 'fairAirQuality',
      defaultMessage: '空气良',
    }),
    '空气差': intl.formatMessage({
      id: 'poorAirQuality',
      defaultMessage: '空气差',
    }),
    '水箱检测': intl.formatMessage({
      id: 'waterTankInspection',
      defaultMessage: '水箱检测',
    }),
    '电量数据': intl.formatMessage({
      id: 'powerData',
      defaultMessage: '电量数据',
    }),
    '照明操作': intl.formatMessage({
      id: 'lightingOperation',
      defaultMessage: '照明操作',
    }),
    '状态': intl.formatMessage({
      id: 'status',
      defaultMessage: '状态',
    }),
    '回风温度': intl.formatMessage({
      id: 'returnAirTemperature',
      defaultMessage: '回风温度',
    }),
    '模式反馈': intl.formatMessage({
      id: 'modeFeedback',
      defaultMessage: '模式反馈',
    }),
    '当前速度': intl.formatMessage({
      id: 'currentSpeed',
      defaultMessage: '当前速度',
    }),
    '制冷': intl.formatMessage({
      id: 'cooling',
      defaultMessage: '制冷',
    }),
    '低速': intl.formatMessage({
      id: 'lowSpeed',
      defaultMessage: '低速',
    }),
    '高速': intl.formatMessage({
      id: 'highSpeed',
      defaultMessage: '高速',
    }),
    '中速': intl.formatMessage({
      id: 'mediumSpeed',
      defaultMessage: '中速',
    }),
    '自动': intl.formatMessage({
      id: 'automatic',
      defaultMessage: '自动',
    }),
    '设置': intl.formatMessage({
      id: 'operationalSettings',
      defaultMessage: '设置',
    }),
    '频率给定': intl.formatMessage({
      id: 'frequencySetting',
      defaultMessage: '频率给定',
    }),
    '频率反馈': intl.formatMessage({
      id: 'frequencyFeedback',
      defaultMessage: '频率反馈',
    }),
    '删除': intl.formatMessage({
      id: 'delete',
      defaultMessage: '删除',
    }),
    '启停模式': intl.formatMessage({
      id: 'startStopMode',
      defaultMessage: '启停模式',
    }),
    '时控': intl.formatMessage({
      id: 'timeControl',
      defaultMessage: '时控',
    }),
    '手动': intl.formatMessage({
      id: 'manual',
      defaultMessage: '手动',
    }),
    '运行状态': intl.formatMessage({
      id: 'operatingStatus',
      defaultMessage: '运行状态',
    }),
    '风速': intl.formatMessage({
      id: 'airSpeed',
      defaultMessage: '风速',
    }),
    '模式': intl.formatMessage({
      id: 'mode',
      defaultMessage: '模式',
    }),
    '送风': intl.formatMessage({
      id: 'airSupply',
      defaultMessage: '送风',
    }),
    '制暖': intl.formatMessage({
      id: 'heating',
      defaultMessage: '制暖',
    }),
    '换气': intl.formatMessage({
      id: 'ventilation',
      defaultMessage: '换气',
    }),
    '除湿': intl.formatMessage({
      id: 'dehumidification',
      defaultMessage: '除湿',
    }),
    '回风': intl.formatMessage({
      id: 'returnAir',
      defaultMessage: '回风',
    }),
    '设定温度': intl.formatMessage({
      id: 'setTemperature',
      defaultMessage: '设定温度',
    }),
    '启停模式为手动时，才可以操作！': intl.formatMessage({
      id: 'operatingTip',
      defaultMessage: '启停模式为手动时，才可以操作！',
    }),
    '抵档': intl.formatMessage({
      id: 'lowGear',
      defaultMessage: '抵档',
    }),
    '中档': intl.formatMessage({
      id: 'mediumGear',
      defaultMessage: '中档',
    }),
    '高档': intl.formatMessage({
      id: 'highGear',
      defaultMessage: '高档',
    }),
    '请输入密码': intl.formatMessage({
      id: 'pleaseEnterPassword',
      defaultMessage: '请输入密码',
    }),
    '请输入温度': intl.formatMessage({
      id: 'pleaseEnterTemperature',
      defaultMessage: '请输入温度',
    }),
    '请输入频率': intl.formatMessage({
      id: 'pleaseEnterFrequency',
      defaultMessage: '请输入频率',
    }),
    '请输入@range之间的数': intl.formatMessage({
      id: 'temperatureInputTip',
      defaultMessage: '请输入@range之间的数',
    }),
    '工变频': intl.formatMessage({
      id: 'industrialVariableFrequency',
      defaultMessage: '工变频',
    }),
    '工频': intl.formatMessage({
      id: 'powerFrequency',
      defaultMessage: '工频',
    }),
    '变频': intl.formatMessage({
      id: 'variableFrequency',
      defaultMessage: '变频',
    }),
    '手动开关': intl.formatMessage({
      id: 'openingMachine',
      defaultMessage: '手动开关',
    }),
    '开机': intl.formatMessage({
      id: 'powerOn',
      defaultMessage: '开机',
    }),
    '关机': intl.formatMessage({
      id: 'powerOff',
      defaultMessage: '关机',
    }),
    '设定': intl.formatMessage({
      id: 'set',
      defaultMessage: '设定',
    }),
    '启动': intl.formatMessage({
      id: 'start',
      defaultMessage: '启动',
    }),
    '水阀给定': intl.formatMessage({
      id: 'waterValveSetting',
      defaultMessage: '水阀给定',
    }),
    '水阀反馈': intl.formatMessage({
      id: 'waterValveFeedback',
      defaultMessage: '水阀反馈',
    }),
    '散热风扇': intl.formatMessage({
      id: 'variableFrequencyFanForHeatDissipation',
      defaultMessage: '散热风扇',
    }),
    '环境温度': intl.formatMessage({
      id: 'ambientTemperature',
      defaultMessage: '环境温度',
    }),
    '大厦模式': intl.formatMessage({
      id: 'buildingMode',
      defaultMessage: '大厦模式',
    }),
    '大厦': intl.formatMessage({
      id: 'building',
      defaultMessage: '大厦',
    }),
    '店铺': intl.formatMessage({
      id: 'store',
      defaultMessage: '店铺',
    }),
    '水阀开关': intl.formatMessage({
      id: 'waterValveSwitch',
      defaultMessage: '水阀开关',
    }),
    '新风': intl.formatMessage({
      id: 'freshAir',
      defaultMessage: '新风',
    }),
    '风阀': intl.formatMessage({
      id: 'airValve',
      defaultMessage: '风阀',
    }),
    '关闭': intl.formatMessage({
      id: 'close',
      defaultMessage: '关闭',
    }),
    '开启': intl.formatMessage({
      id: 'open',
      defaultMessage: '开启',
    }),
    '描述': intl.formatMessage({
      id: 'numericDescription',
      defaultMessage: '描述',
    }),
    '优': intl.formatMessage({
      id: 'excellent',
      defaultMessage: '优',
    }),
    '良': intl.formatMessage({
      id: 'good',
      defaultMessage: '良',
    }),
    '差': intl.formatMessage({
      id: 'poor',
      defaultMessage: '差',
    }),
    '近7天': intl.formatMessage({
      id: 'last7Days',
      defaultMessage: '近7天',
    }),
    '近30天': intl.formatMessage({
      id: 'last30Days',
      defaultMessage: '近30天',
    }),
    '近3个月': intl.formatMessage({
      id: 'last3Months',
      defaultMessage: '近3个月',
    }),
    '温度': intl.formatMessage({
      id: 'temperature',
      defaultMessage: '温度',
    }),
    '甲醛': intl.formatMessage({
      id: 'formaldehyde',
      defaultMessage: '甲醛',
    }),
    '供回水参数': intl.formatMessage({
      id: 'returnWaterParameters',
      defaultMessage: '供回水参数',
    }),
    '供水流量': intl.formatMessage({
      id: 'supplyWaterFlow',
      defaultMessage: '供水流量',
    }),
    '回水温度': intl.formatMessage({
      id: 'returnWaterTemperature',
      defaultMessage: '回水温度',
    }),
    '供水温度': intl.formatMessage({
      id: 'supplyWaterTemperature',
      defaultMessage: '供水温度',
    }),
    '供水流速': intl.formatMessage({
      id: 'supplyWaterFlowRate',
      defaultMessage: '供水流速',
    }),
    '运行时间': intl.formatMessage({
      id: 'operatingTimeSetting',
      defaultMessage: '运行时间',
    }),
    '加班时间': intl.formatMessage({
      id: 'overtimeSwitch',
      defaultMessage: '加班时间',
    }),
    '无': intl.formatMessage({
      id: 'none',
      defaultMessage: '无',
    }),
    '开关机定时': intl.formatMessage({
      id: 'powerOnOffTimer',
      defaultMessage: '开关机定时',
    }),
    '请修改时间': intl.formatMessage({
      id: 'pleaseAdjustTheTime',
      defaultMessage: '请修改时间',
    }),
    '开始时间': intl.formatMessage({
      id: 'startTime',
      defaultMessage: '开始时间',
    }),
    '结束时间': intl.formatMessage({
      id: 'endTime',
      defaultMessage: '结束时间',
    }),
    '历史数据': intl.formatMessage({
      id: 'historicalData',
      defaultMessage: '历史数据',
    }),
    '操作记录': intl.formatMessage({
      id: 'operationalRecords',
      defaultMessage: '操作记录',
    }),
    '报警记录': intl.formatMessage({
      id: 'alarmLog',
      defaultMessage: '报警记录',
    }),
    '清除数据': intl.formatMessage({
      id: 'clearData',
      defaultMessage: '清除数据',
    }),
    '暂无记录': intl.formatMessage({
      id: 'noRecordsAvailable',
      defaultMessage: '暂无记录',
    }),
    '相电压': intl.formatMessage({
      id: 'phaseVoltage',
      defaultMessage: '相电压',
    }),
    '线电压': intl.formatMessage({
      id: 'lineVoltage',
      defaultMessage: '线电压',
    }),
    '电流': intl.formatMessage({
      id: 'current',
      defaultMessage: '电流',
    }),
    '总视在功率': intl.formatMessage({
      id: 'apparentPower',
      defaultMessage: '总视在功率',
    }),
    '有功电能': intl.formatMessage({
      id: 'activeEnergy',
      defaultMessage: '有功电能',
    }),
    '灯光': intl.formatMessage({
      id: 'lighting',
      defaultMessage: '灯光',
    }),
    '查看': intl.formatMessage({
      id: 'view',
      defaultMessage: '查看',
    }),
    '提示': intl.formatMessage({
      id: 'tips',
      defaultMessage: '提示',
    }),
    '确定要清除所有的记录吗': intl.formatMessage({
      id: 'clearDataTip',
      defaultMessage: '确定要清除所有的记录吗',
    }),
    '开': intl.formatMessage({
      id: 'lightOn',
      defaultMessage: '开',
    }),
    '关': intl.formatMessage({
      id: 'lightOff',
      defaultMessage: '关',
    }),
    '开关时间': intl.formatMessage({
      id: 'switchingTime',
      defaultMessage: '开关时间',
    }),
    '低液位': intl.formatMessage({
      id: 'lowLevel',
      defaultMessage: '低液位',
    }),
    '中液位': intl.formatMessage({
      id: 'mediumLevel',
      defaultMessage: '中液位',
    }),
    '高液位': intl.formatMessage({
      id: 'highLevel',
      defaultMessage: '高液位',
    }),
    '超高液位': intl.formatMessage({
      id: 'ultraHighLevel',
      defaultMessage: '超高液位',
    }),
    '是': intl.formatMessage({
      id: 'yes',
      defaultMessage: '是',
    }),
    '否': intl.formatMessage({
      id: 'no',
      defaultMessage: '否',
    }),
    '1号水泵': intl.formatMessage({
      id: 'firstPump',
      defaultMessage: '1号水泵',
    }),
    '2号水泵': intl.formatMessage({
      id: 'secondPump',
      defaultMessage: '2号水泵',
    }),
    '新风系统参数': intl.formatMessage({
      id: 'fanParameters',
      defaultMessage: '新风系统参数',
    }),
    '烟雾报警': intl.formatMessage({
      id: 'smokeAlarm',
      defaultMessage: '烟雾报警',
    }),
    '压力报警': intl.formatMessage({
      id: 'pressAlarm',
      defaultMessage: '压力报警',
    }),
    '晴': intl.formatMessage({
      id: 'fine',
      defaultMessage: '晴',
    }),
    '年度电能统计': intl.formatMessage({
      id: 'AnnualElectricityStatistics',
      defaultMessage: '年度电能统计',
    }),
    '停止': intl.formatMessage({
      id: 'stop',
      defaultMessage: '停止',
    }),
    '风速-1': intl.formatMessage({
      id: 'fanSpeed1',
      defaultMessage: '风速-1-1',
    }),
    '风速-2': intl.formatMessage({
      id: 'fanSpeed2',
      defaultMessage: '风速-1-2',
    }),
    '验证密码': intl.formatMessage({
      id: 'verifyPassword',
      defaultMessage: '验证密码',
    }),
    '加热模式': intl.formatMessage({
      id: 'heatingMode',
      defaultMessage: '加热模式',
    }),
    '夏天': intl.formatMessage({
      id: 'summer',
      defaultMessage: '夏天',
    }),
    '冬天': intl.formatMessage({
      id: 'winter',
      defaultMessage: '冬天',
    }),
    '通风': intl.formatMessage({
      id: 'ventilation2',
      defaultMessage: '通风',
    }),
    '给定': intl.formatMessage({
      id: 'setting',
      defaultMessage: '给定',
    }),
    '反馈': intl.formatMessage({
      id: 'feedback',
      defaultMessage: '反馈',
    }),
    '电能': intl.formatMessage({
      id: 'power',
      defaultMessage: '电能',
    }),
    '低档': intl.formatMessage({
      id: 'lowGrade',
      defaultMessage: '低档',
    }),
    '数值说明': intl.formatMessage({
      id: 'numericalDescription',
      defaultMessage: '数值说明',
    }),
    '空气质量': intl.formatMessage({
      id: 'airQuality',
      defaultMessage: '空气质量',
    }),
    '正常': intl.formatMessage({
      id: 'normal',
      defaultMessage: '正常',
    }),
    '浦东陆家嘴世纪大道8号上海国金中心L3-1商铺': intl.formatMessage({
      id: 'address1',
      defaultMessage: '浦东陆家嘴世纪大道8号上海国金中心L3-1商铺',
    }),
    '上海市静安区上海恒隆广场': intl.formatMessage({
      id: 'address2',
      defaultMessage: '上海市静安区上海恒隆广场',
    }),
    '浦东陆家嘴世纪大道8号上海国金中心L3': intl.formatMessage({
      id: 'address3',
      defaultMessage: '浦东陆家嘴世纪大道8号上海国金中心L3',
    }),
    '项目地址': intl.formatMessage({
      id: 'address',
      defaultMessage: '地址',
    }),
    '项目面积': intl.formatMessage({
      id: 'area',
      defaultMessage: '项目面积',
    }),
    '完工日期': intl.formatMessage({
      id: 'completionDate',
      defaultMessage: '完工日期',
    }),
    '拍摄日期': intl.formatMessage({
      id: 'shootingDate',
      defaultMessage: '拍摄日期',
    }),
    'xx门店，xx设备已离线': intl.formatMessage({
      id: 'warningInfo1',
      defaultMessage: 'xx门店，xx设备已离线',
    }),
    'xx门店，xx设备温度过高': intl.formatMessage({
      id: 'warningInfo2',
      defaultMessage: 'xx门店，xx设备温度过高',
    }),
    'xx门店，xx设备温度数据异常': intl.formatMessage({
      id: 'warningInfo3',
      defaultMessage: 'xx门店，xx设备温度数据异常',
    }),
    '水泵-1-1': intl.formatMessage({
      id: 'pump',
      defaultMessage: '水泵-1-1',
    }),
    'C4灯槽': intl.formatMessage({
      id: 'c4LightTrough',
      defaultMessage: 'C4灯槽',
    }),
    'C5家具照明': intl.formatMessage({
      id: 'c5FurnitureLighting',
      defaultMessage: 'C5家具照明',
    }),
    'C6橱窗照明': intl.formatMessage({
      id: 'c6DisplayLighting',
      defaultMessage: 'C6橱窗照明',
    }),
    'C7内室照明': intl.formatMessage({
      id: 'c7Lighting',
      defaultMessage: 'C7内室照明',
    }),
    '照明1': intl.formatMessage({
      id: 'c1Lighting',
      defaultMessage: '照明1',
    }),
    '照明2': intl.formatMessage({
      id: 'c2Lighting',
      defaultMessage: '照明2',
    }),
    '照明5': intl.formatMessage({
      id: 'c5Lighting',
      defaultMessage: '照明5',
    }),
    '照明8': intl.formatMessage({
      id: 'c8Lighting',
      defaultMessage: '照明8',
    }),
    '照明9': intl.formatMessage({
      id: 'c9Lighting',
      defaultMessage: '照明9',
    }),
    '照明10': intl.formatMessage({
      id: 'c10Lighting',
      defaultMessage: '照明10',
    }),
    '照明11': intl.formatMessage({
      id: 'c11Lighting',
      defaultMessage: '照明11',
    }),

    '屏体亮度': intl.formatMessage({
      id: 'screenBrightness',
      defaultMessage: '屏体亮度',
    }),

    '环境亮度': intl.formatMessage({
      id: 'ambientBrightness',
      defaultMessage: '环境亮度',
    }),

    '暂无数据': intl.formatMessage({
      id: 'noData',
      defaultMessage: '暂无数据',
    }),

    '接收卡电压': intl.formatMessage({
      id: 'receiverCardVoltage',
      defaultMessage: '接收卡电压',
    }),


    '接收卡温度': intl.formatMessage({
      id: 'receiverCardTemperature',
      defaultMessage: '接收卡温度',
    }),

    '接收卡状态': intl.formatMessage({
      id: 'receiverCardStatus',
      defaultMessage: '接收卡状态',
    }),

    '频率': intl.formatMessage({
      id: 'frequencies',
      defaultMessage: '频率',
    }),

    '节能': intl.formatMessage({
      id: 'energySaving',
      defaultMessage: '节能',
    }),
    '有': intl.formatMessage({
      id: 'yes',
      defaultMessage: '有',
    })

  };

  if (originValue in mapData) {
    finalValue = mapData[originValue];
  }

  return finalValue
}
