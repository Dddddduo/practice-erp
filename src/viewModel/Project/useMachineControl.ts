import MachineControlConfig from '@/configs/machine_control';
import { getFloorsData, getMachineInfo } from '@/services/ant-design-pro/project';
import { getDeviceStatus, getPointPosition } from '@/utils/machine_control_service';
import {handleMergeStatesByPath, handleParseStateChange, handlePauseState} from '@/utils/utils';
import { produce } from 'immer';
import {filter, find, findIndex, has, inRange, isBoolean, isEmpty, isNull, some} from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const waterPipeMoveCoolPath = '/air-condition/short_cold_move_water.gif';
const waterPipeStaticCoolPath = '/air-condition/short_cold_static_water.png';
const waterPipeMoveHotPath = '/air-condition/short_hot_move_water.gif';
const waterPipeStaticHotPath = '/air-condition/short_hot_static_water.png';
const hotFanImage = '/air-condition/fans.png';
const coolFanImage = '/air-condition/fans_cold.png';

const greenColor = '#1B8E4AFF';
const yellowColor = '#FFA500';
const redColor = '#E84B49';
const grayColor = '#E0E0E0';

export enum ClickEnum {
  onOpenModel,
  onCloseModel,
  onValueChange,
  onSwitchFloor,
  onOpenDevice,
  onCloseDevice,
  onViewDevice,
}

export enum ModelTypeEnum {
  EnergySaving,
  SystemParameters,
  SystemParameters_AirValves,
  SystemParameters_OverTime,
  SystemParameters_MachineStartTime,
  PowerData,
  LightingOperation,
  IAQ,
  Tank,
  AHU,
  VRV,
  AV,
  FCU,
  FAN,
}

interface BaseOperateData {
  deviceName: string;
  isActive: boolean;
  tag: string;
  storeId: number;
  floor: string;
  title: string;
}

export interface PlanImgDevice {
  x: number; // x轴坐标
  y: number; // y轴坐标
  area: string; // 设备覆盖范围
  deviceLocation: string; // 气泡坐标
  devicePosition: string; // 气泡放置的位置
  deviceName: string; // 设备名称
  deviceType: string; //  设备类型
  deviceStatus: string; // 设备状态
  deviceId: number; // 设备Id
  groupId: string; // 设备组Id
}

//供回水参数
interface CommonSRData {
  name: string;
  value: number;
  unit: string;
}

export interface SupplyReturnData {
  supplyData: CommonSRData;
  returnData: CommonSRData;
  flowData: CommonSRData;
}

// 新风阀操作列表
export interface AirValveData extends BaseOperateData {
  valMap: string[];
  openValue: boolean;
}

// 开机时间
export interface MachineStartTimeData extends BaseOperateData {
  title: string;
  timeValue: string[];
}

// 加班时间
export interface OptionData {
  value: any;
  label: string;
}

export interface OverTimeData extends BaseOperateData {
  options: OptionData[];
  value: string;
  title: string;
}

//系统参数
export interface SystemParamsData {
  supplyReturnList: SupplyReturnData[]; // 供回水
  windSpeedList: string[]; // 风速列表
  airValveList: AirValveData[]; // 新风阀操作列表
  machineStartTimeList: any; // 开机时间
  overTimeData: OverTimeData; // 加班时间
}

// handleOnChange
export interface ValueChangeFlowData {
  model: ModelTypeEnum;
  index: number;
  key: string;
  value: any;
}

//电量数据
interface DBDataInfo {
  name: string;
  value: string;
  unit: string;
}

interface DBData {
  deviceName: string;
  deviceId: number;
  dataList: DBDataInfo[];
}

export interface PowerDataType {
  dbDataList: DBData[];
  selectDBMachineIndex: number;
  selectDBDataIndex: number;
  selectWeekValue: number;
  chartData: {
    x: string[];
    y: number[];
  };
  weekOptions: OptionData[];
}

const weekOptionList: OptionData[] = [
  {
    value: 0,
    label: '今天',
  },
  {
    value: 7,
    label: '7天',
  },
  {
    value: 30,
    label: '30天',
  },
  {
    value: 90,
    label: '三个月',
  },
];

//灯光操作
export interface LightData {
  deviceName: string;
  deviceId: number;
  lightOpenValue: boolean;
  lightOpenTag: string;
  autoHandValue: boolean;
  autoHandTag: string;
  autoHandValMap: string[];
  lightRangeTimeValue: string[];
  lightRangeTimeTag: string;
  isActive: boolean;
  storeId: number;
  floor: string;
}

//店铺平面显示
/**/
export interface PlaneImgDevice {
  x: number; // x轴坐标
  y: number; // y轴坐标
  area: string; // 设备覆盖范围
  deviceLocation: string; // 气泡坐标
  devicePosition: string; // 气泡放置的位置
  deviceName: string; // 设备名称
  deviceType: string; //  设备类型
  deviceStatus: string; // 设备状态
  deviceId: number; // 设备Id
  groupId: string; // 设备组Id
}

export interface PlaneImgShapeData {
  containW: number; // 容器宽度
  containH: number; // 容器高度
  imageW: number; // 平面图宽度
  imageH: number; // 平面图高度
  beta: number; // 平面图和容器换算的系数，计算公式：平面图 / 容器
  planImgSource: string; // 平面图资源
}

export enum ShowBoxType {
  Alone,
  Group,
}

export enum FieldType {
  Input,
  Select,
  Text,
  Placeholder,
}

export interface ContentList {
  key: string;
  value: string;
}

export interface AloneData {
  deviceName: string; // 设备名称
  deviceType: string; //  设备类型
  deviceStatus: string; // 设备状态
  deviceId: number; // 设备Id
  contentList: ContentList[]; // 要显示的数据列表
}

export interface DetailBoxData {
  showDetailBox: boolean; // 是否显示弹框
  x: number; // x轴坐标
  y: number; // y轴坐标
  type: ShowBoxType; // 弹框类型
  aloneData: AloneData;
  groupsData: {
    ahu: AloneData;
    vrv: AloneData;
  };
}

interface OriginMqttData {
  acList: any[]; // 设备列表源数据
  params: any; // 系统参数数据
}

export interface ClickViewMachineData {
  deviceIdList: number[];
  deviceType: string;
  deviceName: string;
}

// IAQ
export interface IaqInfoType {
  name: string;
  formalVal: string;
  bgColor: string;
  standard: number[];
  unit: string;
}

export interface NumericalValueType {
  name: string;
  color: string;
}

export interface IAQData {
  deviceName: string;
  deviceId: number;
  dataInfoList: IaqInfoType[];
  selectDataInfoIndex: number;
  numericalValueList: NumericalValueType[];
  selectWeekValue: number;
  chartData: {
    x: string[];
    y: number[];
  };
  weekOptions: OptionData[];
}

//Tank
interface TankControlData extends BaseOperateData {
  value: boolean;
  title: string;
  openText: string;
  closeText: string;
}

export interface TankData {
  deviceName: string;
  deviceId: number;
  no1TankStatus: boolean;
  no2TankStatus: boolean;
  waterLevelList: OptionData[];
  tankControlList: TankControlData[];
}

//FCU
export interface WindTemperatureData {
  title: string;
  formatVal: string;
}

export interface SwitchBarData {
  title: string;
  tag: string;
  value: boolean;
  isActive: boolean;
  openText: string;
  closeText: string;
}

export interface MixinBarData {
  title: string;
  tag: string;
  value: any;
  unit?: string;
  isActive: boolean;
  fieldType: FieldType;
  options?: OptionData[];
  deviceType?: string;
}

export interface GivingFeedbackData {
  name: string;
  formatVal: string;
}

interface MachineChassisData {
  fanAnimationDuration: string;
  fanImagePath: string;
  fcuStatus: string;
  temperatureTitle: string;
  temperatureValue: string;
  temperatureUnit: string;
  temperatureTag: string;
  windTemperatureTitle: string;
  windTemperatureFormatVal: string;
  waterPipeList: string[];
  deviceType: string;
  givingFeedbackTextList?: GivingFeedbackData[];
}

export interface FcuData {
  deviceName: string;
  storeId: number;
  floor: string;
  switchBarList: SwitchBarData[];
  mixinBarList: MixinBarData[];
  machineChassis: MachineChassisData;
}

//AHU
export interface AhuData {
  deviceName: string;
  storeId: number;
  floor: string;
  switchBarList: SwitchBarData[];
  mixinBarList: MixinBarData[];
  machineChassis: MachineChassisData;
}

interface AhuAssembleType {
  switchBarList: SwitchBarData[];
  mixinBarList: MixinBarData[];
}

//VRV
export type VrvData = AhuData;

//AV
export interface GroupMachineChassis {
  ahuHanAnimationDuration: string;
  ahuFanImagePath: string;
  ahuStatus: string;
  vrvFanAnimationDuration: string;
  vrvFanImagePath: string;
  vrvStatus: string;
  temperatureTitle: string;
  temperatureValue: string;
  temperatureUnit: string;
  temperatureTag: string;
  windTemperatureTitle: string;
  windTemperatureFormatVal: string;
}

export interface GroupData {
  ahuDeviceName: string;
  vrvDeviceName: string;
  storeId: number;
  floor: string;
  switchBarList: SwitchBarData[];
  mixinBarList: MixinBarData[];
  machineChassis: GroupMachineChassis;
}

export interface floorOptions {
  value: string;
  label: string;
  width: number;
  height: number;
  img: string;
  beta: number;
}

// 页面总参数
interface DataSource {
  connect_status: boolean;
  last_connect_time: string;
  showFunctionsBtn: boolean;
  originMqttData: OriginMqttData;
  waringList: string[];
  currentStoreId: number;
  selectFloor: string;
  showModelType: ModelTypeEnum | null;
  planeImgDeviceList: PlaneImgDevice[];
  planeImgShapeData: PlaneImgShapeData;
  detailBoxData: DetailBoxData;
  selectDeviceId: number;
  floorOptions: floorOptions[];
  settings: {
    energySaving: any;
    systemParameters: SystemParamsData; // 系统参数
    powerData: PowerDataType;
    lightingOperation: LightData[];
  };
  IAQData: IAQData;
  TankData: TankData;
  FanData: any;
  FCUData: FcuData;
  AHUData: AhuData;
  VRVData: VrvData;
  GroupData: GroupData;
}

const baseData: DataSource = {
  connect_status: false,
  last_connect_time: '',
  showFunctionsBtn: false,
  originMqttData: {
    acList: [],
    params: {},
  },
  //警报
  waringList: [],
  // 当前店铺ID
  // currentStoreId: 1193,
  // 当前楼层
  selectFloor: '',
  floorOptions: [],
  showModelType: null,
  // 店铺平面图上的设备列表数据
  planeImgDeviceList: [],
  planeImgShapeData: {
    containW: window.innerWidth - MachineControlConfig.removeOtherW,
    containH: window.innerHeight - MachineControlConfig.removeOtherH,
    imageW: 0,
    imageH: 0,
    beta: 0,
    planImgSource: '',
  },
  detailBoxData: {
    showDetailBox: false,
    x: 0,
    y: 0,
    type: ShowBoxType.Alone,
    aloneData: {
      deviceName: '',
      deviceType: '',
      deviceStatus: '',
      deviceId: 0,
      contentList: [
        {
          key: '',
          value: '',
        },
      ],
    },
    groupsData: {
      ahu: {
        deviceName: '',
        deviceType: '',
        deviceStatus: '',
        deviceId: 0,
        contentList: [
          {
            key: '',
            value: '',
          },
        ],
      },
      vrv: {
        deviceName: '',
        deviceType: '',
        deviceStatus: '',
        deviceId: 0,
        contentList: [
          {
            key: '',
            value: '',
          },
        ],
      },
    },
  },
  // 当前选中设备的ID
  selectDeviceId: 0,
  //设置
  settings: {
    //节能数据
    energySaving: {},
    // 系统参数
    systemParameters: {
      supplyReturnList: [],
      windSpeedList: [],
      airValveList: [],
      machineStartTimeList: {},
      overTimeData: {
        deviceName: '',
        storeId: 0,
        floor: '',
        tag: '',
        isActive: false,
        options: [],
        value: '',
        title: '',
      },
    },
    // 电量数据
    powerData: {
      dbDataList: [],
      selectDBMachineIndex: 0,
      selectDBDataIndex: 0,
      selectWeekValue: 0,
      chartData: {
        x: [''],
        y: [0],
      },
      weekOptions: weekOptionList,
    },
    // 照明操作
    lightingOperation: [],
  },
  IAQData: {
    deviceName: '',
    deviceId: 0,
    dataInfoList: [],
    selectDataInfoIndex: 0,
    numericalValueList: [],
    selectWeekValue: 0,
    chartData: {
      x: [''],
      y: [0],
    },
    weekOptions: weekOptionList,
  },
  TankData: {
    deviceName: '',
    deviceId: 0,
    no1TankStatus: false,
    no2TankStatus: false,
    waterLevelList: [],
    tankControlList: [],
  },
  FanData: {
    deviceName: '',
    storeId: 0,
    floor: '',
    switchBarList: [],
    mixinBarList: [],
  },
  // FanData:[],
  FCUData: {
    deviceName: '',
    storeId: 0,
    floor: '',
    switchBarList: [],
    mixinBarList: [],
    // @ts-ignore
    machineChassis: {},
  },
  AHUData: {
    deviceName: '',
    storeId: 0,
    floor: '',
    switchBarList: [],
    mixinBarList: [],
    // @ts-ignore
    machineChassis: {},
  },
  VRVData: {
    deviceName: '',
    storeId: 0,
    floor: '',
    switchBarList: [],
    mixinBarList: [],
    // @ts-ignore
    machineChassis: {},
  },
  GroupData: {
    ahuDeviceName: '',
    vrvDeviceName: '',
    storeId: 0,
    floor: '',
    switchBarList: [],
    mixinBarList: [],
    // @ts-ignore
    machineChassis: {},
  },
};
export const useMachineControl = (storeId: number) => {
  const [dataSource, setDataSource] = useState<DataSource>(baseData);
  const refData = useRef<any>({
    showModelType: null,
    clickViewMachineData: {
      deviceIdList: [],
      deviceType: '',
      deviceName: '',
    },
  });
  const pathRefs = useRef<{ [key: string]: any }>({
    settings: {
      systemParameters: {
        // timeValue
        machineStartTimeList: [],
        lightingOperation: [],
      }
    },
  });
  const timer = React.useRef<any>(null);
  //清除计时器
  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };
  /**
   * 获取设备状态
   * @param status
   */
  const getDeviceState = (status: any) => {
    setDataSource(
      produce((draft: any) => {
        draft.connect_status = status.includes('online');
      }),
    );
  };
  /**
   * 获取最后在线时间
   * @param time
   */
  const getLastConnectTime = (time: any) => {
    setDataSource(
      produce((draft: any) => {
        draft.last_connect_time = time;
      }),
    );
  };
  /**
   * 获取报警信息
   * @param currentParams
   */
  const getWarningList = (currentParams: any) => {
    const newWarningList = currentParams.map((item: any) => {
      return item.device_name + ':' + item.warning_desc;
    });
    setDataSource(
      produce((draft) => {
        draft.waringList = newWarningList;
      }),
    );
  };

  /**
   * 清洗数据
   * @param o_data
   */
  const formatDataSource = (o_data: any) => {
    // console.log('o_data--o_data', o_data);
    let newMachineStartTimeList: MachineStartTimeData[] = [];
    if ('ahu_system_open_at_h' in o_data) {
      // baseData.settings.systemParameters.machineStartTimeList.timeValue = [
      //   `${o_data?.ahu_system_open_at_h?.value ?? '00'}:${
      //     o_data?.ahu_system_open_at_m?.value ?? '00'
      //   }`,
      //   `${o_data?.ahu_system_close_at_h?.value ?? '00'}:${
      //     o_data?.ahu_system_close_at_m?.value ?? '00'
      //   }`,
      // ];
      // const data = [...baseData.settings.systemParameters.machineStartTimeList.timeValue];
      // console.log('data--data--99',data)
      // setDataSource((prevState) =>
      //   produce(prevState, (draftState) => {
      //     if (!isEmpty(pathRefs.current)) {
      //       for (const item in pathRefs.current) {
      //         if (!has(pathRefs.current, item)) {
      //           continue;
      //         }
      //         const newData = handleMergeStatesByPath(item, prevState, baseData);
      //         draftState.settings.systemParameters.machineStartTimeList = {
      //           ...newData.settings.systemParameters.machineStartTimeList,
      //         };
      //       }
      //       return;
      //     }
      //     draftState.settings.systemParameters.machineStartTimeList.timeValue = data;
      //   }),
      // );
      newMachineStartTimeList.push({
        deviceName: '',
        isActive: false,
        tag: 'ahu_open_close_time',
        storeId: storeId,
        floor: dataSource.selectFloor,
        timeValue: [
          `${o_data?.ahu_system_open_at_h?.value ?? '00'}:${
            o_data?.ahu_system_open_at_m?.value ?? '00'
          }`,
          `${o_data?.ahu_system_close_at_h?.value ?? '00'}:${
            o_data?.ahu_system_close_at_m?.value ?? '00'
          }`,
        ],
        title: 'AHU开关机时间',
      });
    }

    if ('vrv_system_open_at_h' in o_data) {
      newMachineStartTimeList.push({
        deviceName: '',
        isActive: false,
        tag: 'vrv_open_close_time',
        storeId: storeId,
        floor: dataSource.selectFloor,
        timeValue: [
          `${o_data?.vrv_system_open_at_h?.value ?? '00'}:${
            o_data?.vrv_system_open_at_m?.value ?? '00'
          }`,
          `${o_data?.vrv_system_close_at_h?.value ?? '00'}:${
            o_data?.vrv_system_close_at_m?.value ?? '00'
          }`,
        ],
        title: 'VRV开关机时间',
      });
    }

    if ('fcu_system_open_at_h' in o_data) {
      newMachineStartTimeList.push({
        deviceName: '',
        isActive: false,
        tag: 'fcu_open_close_time',
        storeId: storeId,
        floor: dataSource.selectFloor,
        timeValue: [
          `${o_data?.fcu_system_open_at_h?.value ?? '00'}:${
            o_data?.fcu_system_open_at_m?.value ?? '00'
          }`,
          `${o_data?.fcu_system_close_at_h?.value ?? '00'}:${
            o_data?.fcu_system_close_at_m?.value ?? '00'
          }`,
        ],
        title: 'FCU开关机时间',
      });
    }

    if ('light_system_open_at_h' in o_data) {
      newMachineStartTimeList.push({
        deviceName: '',
        isActive: false,
        tag: 'light_open_close_time',
        storeId: storeId,
        floor: dataSource.selectFloor,
        timeValue: [
          `${o_data?.light_system_open_at_h?.value ?? '00'}:${
            o_data?.light_system_open_at_m?.value ?? '00'
          }`,
          `${o_data?.light_system_close_at_h?.value ?? '00'}:${
            o_data?.light_system_close_at_m?.value ?? '00'
          }`,
        ],
        title: 'Light开关机时间',
      });
    }

    return newMachineStartTimeList;
  };
  /**
   * 获取系统参数
   */
  const getSystemParamsData = (currentParams: any) => {
    // 供回水数据
    let newSupplyReturnList: SupplyReturnData[] = [];
    (currentParams.list as []).forEach((item: any) => {
      // console.log('供回水数据--供回水数据', item);
      let supplyReturnData: SupplyReturnData = {
        supplyData: {
          name: '',
          value: 0,
          unit: '',
        },
        returnData: {
          name: '',
          value: 0,
          unit: '',
        },
        flowData: {
          name: '',
          value: 0,
          unit: '',
        },
      };
      if ((item as []).length >= 1) {
        supplyReturnData.supplyData.name = item[0]?.name ?? '';
        supplyReturnData.supplyData.value = item[0]?.value ? Number(item[0]?.value) : 0;
        supplyReturnData.supplyData.unit = item[0]?.unit ?? '';
      }

      if ((item as []).length >= 2) {
        supplyReturnData.returnData.name = item[1]?.name ?? '';
        supplyReturnData.returnData.value = item[1]?.value ? Number(item[1]?.value) : 0;
        supplyReturnData.returnData.unit = item[1]?.unit ?? '';
      }

      if ((item as []).length >= 3) {
        supplyReturnData.flowData.name = item[2]?.name ?? '';
        supplyReturnData.flowData.value = item[2]?.value ? Number(item[2]?.value) : 0;
        supplyReturnData.flowData.unit = item[2]?.unit ?? '';
      }
      newSupplyReturnList.push(supplyReturnData);
    });
    //风速列表
    const newWindSpeedList: string[] = [];
    Object.keys(currentParams).map((key) => {
      if (key.includes('wind_speed')) {
        newWindSpeedList.push(`${currentParams[key].name}  ${currentParams[key].format_val}`);
      }
      return newWindSpeedList;
    });
    // 新风阀操作列表
    const newAirValveList: AirValveData[] = [];
    for (const key of Object.keys(currentParams)) {
      if (key.includes('新风阀开-')) {
        newAirValveList.push({
          title: '',
          deviceName: '',
          isActive: false,
          tag: currentParams[key].tag,
          storeId: storeId,
          floor: dataSource.selectFloor,
          valMap: currentParams[key].val_map,
          openValue: false,
        });
      }
    }
    for (let i = 0; i < newAirValveList.length; i++) {
      newAirValveList[i].openValue =
        currentParams?.[`新风阀开状态-${i + 1}`]?.value.toString() === '1';
    }
    //加班时间
    const newOverTime: OverTimeData = {
      deviceName: '',
      storeId: 0,
      floor: '',
      tag: '',
      isActive: false,
      options: [],
      value: '',
      title: '',
    };
    Object.keys(currentParams).forEach((key) => {
      if (key.includes('overtime')) {
        newOverTime.deviceName = '';
        newOverTime.storeId = storeId;
        newOverTime.floor = dataSource.selectFloor;
        newOverTime.tag = currentParams[key].tag;
        newOverTime.isActive = currentParams[key].value.toString() === '1';
        newOverTime.options = Object.keys(currentParams[key].val_map).map((k) => ({
          value: k,
          label: currentParams[key].val_map[k],
        }));
        newOverTime.value = currentParams[key].value;
        newOverTime.title = currentParams[key].name;
      }
    });

    //开机时间
    let newMachineStartTimeList = formatDataSource(currentParams);

    setDataSource((prevState) =>
      produce(prevState, (draft) => {
        const systemParams = draft.settings.systemParameters;
        systemParams.supplyReturnList = newSupplyReturnList;
        systemParams.windSpeedList = newWindSpeedList;
        systemParams.airValveList = newAirValveList;
        systemParams.overTimeData = newOverTime;
        systemParams.machineStartTimeList = newMachineStartTimeList;
      }),
    );
  };
  /**
   * 获取图表数据
   */
  const getChartData = async (params: any, modelType: ModelTypeEnum) => {
    // const res = await getHistory(params);
    // console.log('历史数据', res);
    const res = {
      success: true,
      data: {
        x: [
          '2024-07-19 19:01:33',
          '2024-07-19 19:01:36',
          '2024-07-19 19:01:37',
          '2024-09-05 12:25:50',
          '2024-09-05 12:25:56',
          '2024-09-05 12:26:19',
          '2024-09-05 12:26:31',
          '2024-09-05 12:33:18',
          '2024-09-05 12:37:15',
          '2024-09-05 12:37:47',
          '2024-09-05 13:06:29',
          '2024-09-05 13:08:49',
          '2024-09-05 13:55:30',
        ],
        y: [
          229.5, 229.5, 229.5, 218.7, 218.7, 218.7, 218.7, 218.9, 219.0, 219.0, 219.6, 219.8, 220.2,
        ],
      },
    };
    if (res.success) {
      if (modelType === ModelTypeEnum.PowerData) {
        setDataSource(
          produce((draft: any) => {
            draft.settings.powerData.chartData.x = res?.data?.x;
            draft.settings.powerData.chartData.y = res?.data?.y;
          }),
        );
      }
      if (modelType === ModelTypeEnum.IAQ) {
        setDataSource(
          produce((draft) => {
            draft.IAQData.chartData.x = res?.data?.x;
            draft.IAQData.chartData.y = res?.data?.y;
          }),
        );
      }
    }
  };
  /**
   * 获取电量数据
   */
  const getPowerData = (currentParams: any[]) => {
    //卡片数据
    const newDataList: DBData[] = [];
    Object.keys(currentParams).forEach((key: any) => {
      if (currentParams[key].device_type === 'db') {
        // console.log('currentParams[key]--currentParams[key]',currentParams[key].相电压UA.device_name,key)
        let newDataInfoList: DBDataInfo[] = [];
        let dbData: DBData = {
          deviceName: currentParams[key].相电压UA.device_name,
          deviceId: currentParams[key]?.device_id,
          dataList: newDataInfoList,
        };
        Object.keys(currentParams[key]).forEach((k: any) => {
          // console.log('6666666',currentParams[key][k]);
          if (currentParams[key][k] !== null && currentParams[key][k]?.value) {
            newDataInfoList.push({
              name: currentParams[key][k]?.name,
              value: currentParams[key][k]?.value,
              unit: currentParams[key][k]?.unit,
            });
          }
        });
        newDataList.push(dbData);
      }
    });
    // console.log(newDataList)
    //图表数据
    if (newDataList.length > 0) {
      const params = {
        tag: newDataList[0].dataList.length > 0 ? newDataList[0].dataList[0].name : '',
        group: newDataList[0].deviceName,
        day: dataSource.settings.powerData.selectWeekValue,
        shop_id: dataSource.currentStoreId,
      };
      getChartData(params, ModelTypeEnum.PowerData).catch(console.log);
    }
    setDataSource(
      produce((draft) => {
        draft.settings.powerData.dbDataList = newDataList;
      }),
    );
  };
  /**
   * 获取灯光操作数据
   */
  const getLightData = (currentParams: any[]) => {
    const newLightList: LightData[] = [];
    Object.keys(currentParams).forEach((key: any) => {
      if (currentParams[key].device_type === 'light') {
        newLightList.push({
          deviceName: currentParams[key]?.auto_hand.device_name,
          deviceId: currentParams[key]?.device_id,
          lightOpenValue: currentParams[key]['照明启动']?.value.toString() === '1',
          lightOpenTag: currentParams[key]['照明状态']?.tag,
          autoHandValue: currentParams[key].auto_hand?.value.toString() === '1',
          autoHandTag: currentParams[key].auto_hand?.tag,
          autoHandValMap: currentParams[key].auto_hand?.val_map,
          lightRangeTimeValue: [
            `${currentParams[key].light_system_open_at_h?.value ?? '00'}:${
              currentParams[key].light_system_open_at_m?.value ?? '00'
            }`,
            `${currentParams[key].light_system_close_at_h?.value ?? '00'}:${
              currentParams[key].light_system_close_at_m?.value ?? '00'
            }`,
          ],
          lightRangeTimeTag: 'light_open_close_time',
          isActive: false,
          storeId: storeId,
          floor: dataSource.selectFloor,
        });
      }
    });
    setDataSource(
      produce((draft) => {
        draft.settings.lightingOperation = newLightList;
      }),
    );

    return newLightList;
  };
  /**
   * 备份数据
   * @param acList
   */
  const saveAcList = (acList: any[]) => {
    let newAcList: any[] = [];
    for (const item of Object.keys(acList)) {
      newAcList.push(acList[item]);
    }
    setDataSource(
      produce((draft) => {
        draft.originMqttData.acList = newAcList;
      }),
    );
    return newAcList;
  };

  /**
   * 获取平面图设备列表
   * @param currentParams
   * @param beta
   */
  const getPlaneImgDeviceList = (currentParams: any, beta: number) => {
    const newPlaneImgDeviceList: PlaneImgDevice[] = [];
    Object.keys(currentParams).forEach((key: any) => {
      if (
        currentParams[key].device_location === '' ||
        currentParams[key].device_location === null
      ) {
        return;
      }

      //设备状态
      const deviceStatus: string = getDeviceStatus(
        currentParams[key]?.device_type,
        currentParams[key],
      );

      const data = {
        x:
          getPointPosition(currentParams[key].device_location, beta).px -
          MachineControlConfig.deviceCommonIconWidth / 2,
        y:
          getPointPosition(currentParams[key].device_location, beta).py -
          MachineControlConfig.deviceCommonIconHeight / 2,
        area: '',
        deviceLocation: currentParams[key].device_location,
        devicePosition: currentParams[key].device_position,
        deviceName: key,
        deviceType: currentParams[key].device_type,
        deviceStatus: deviceStatus,
        deviceId: currentParams[key].device_id,
        groupId: currentParams[key].group_id,
      };

      newPlaneImgDeviceList.push(data);
    });

    setDataSource(
      produce((draft) => {
        draft.planeImgDeviceList = newPlaneImgDeviceList;
      }),
    );
  };
  //获取图标下的所有信息
  const getAllIconData = (currentParams: any, beta: number) => {
    const newAllIconData = [];
    Object.keys(currentParams).forEach((key: any) => {
      if (currentParams[key].device_location === '' || currentParams[key].device_location === null)
        return;
      //设备状态
      const deviceStatus: string = getDeviceStatus(
        currentParams[key]?.device_type,
        currentParams[key],
      );
      console.log('设备状态', deviceStatus);
      const formatData = {
        x:
          getPointPosition(currentParams[key].device_location, beta).px -
          MachineControlConfig.deviceCommonIconWidth / 2,
        y:
          getPointPosition(currentParams[key].device_location, beta).py -
          MachineControlConfig.deviceCommonIconHeight / 2,
        area: '',
        deviceLocation: currentParams[key].device_location,
        devicePosition: currentParams[key].device_position,
        deviceName: key,
        deviceType: currentParams[key].device_type,
        deviceStatus: deviceStatus,
        deviceId: currentParams[key].device_id,
        groupId: currentParams[key].group_id,
      };
    });
  };

  // 获取Ahu的组装数据
  const getAhuAssembleData = (
    findAhu: any,
    type: 'group' | 'single',
    findVrv: any,
  ): AhuAssembleType => {
    //AHU模式
    const coolingHeating: SwitchBarData = {
      title: findAhu.cooling_heating.name ?? '',
      tag: findAhu.cooling_heating.tag ?? '',
      value: findAhu.cooling_heating.value.toString() === '1',
      isActive: false,
      openText: findAhu.cooling_heating.val_map[1],
      closeText: findAhu.cooling_heating.val_map[0],
    };
    //工变频切换
    const powerVariable: SwitchBarData = {
      title: findAhu.power_variable.name ?? '',
      tag: findAhu.power_variable.tag ?? '',
      value: findAhu.power_variable.value.toString() === '1',
      isActive: false,
      openText: findAhu.power_variable.val_map[1],
      closeText: findAhu.power_variable.val_map[0],
    };
    //启停模式
    const autoHand: SwitchBarData = {
      title: findAhu.auto_hand.name ?? '',
      tag: findAhu.auto_hand.tag ?? '',
      value: findAhu.auto_hand.value.toString() === '1',
      isActive: false,
      openText: findAhu.auto_hand.val_map[1],
      closeText: findAhu.auto_hand.val_map[0],
    };
    //开关机
    const switchData: SwitchBarData = {
      title: findAhu.switch.name ?? '',
      tag: findAhu.switch.tag ?? '',
      value: findAhu.switch.value.toString() === '1',
      isActive: false,
      openText: findAhu.switch.val_map[1],
      closeText: findAhu.switch.val_map[0],
    };
    //设定高速
    const highSpeed: MixinBarData = {
      title: findAhu?.high_speed?.name,
      tag: findAhu?.high_speed?.tag,
      value: findAhu?.high_speed?.value,
      unit: findAhu?.high_speed?.unit,
      isActive: false,
      fieldType: FieldType.Input,
    };
    //设定中速
    const midSpeed: MixinBarData = {
      title: findAhu?.mid_speed?.name,
      tag: findAhu?.mid_speed?.tag,
      value: findAhu?.mid_speed?.value,
      unit: findAhu?.high_speed?.unit,
      isActive: false,
      fieldType: FieldType.Input,
    };
    //设定低速
    const lowSpeed: MixinBarData = {
      title: findAhu?.low_speed?.name,
      tag: findAhu?.low_speed?.tag,
      value: findAhu?.low_speed?.value,
      unit: findAhu?.high_speed?.unit,
      isActive: false,
      fieldType: FieldType.Input,
    };
    //风速
    const currentSpeedTitle: string =
      type === 'group' ? 'AHU' + findAhu?.current_speed?.name : findAhu?.current_speed?.name;

    const currentSpeed: MixinBarData = {
      title: currentSpeedTitle,
      tag: findAhu?.current_speed?.tag,
      value: findAhu?.current_speed?.value,
      isActive: false,
      fieldType: FieldType.Select,
      options: findAhu?.current_speed?.val_map?.map((item: any, index: any) => {
        return {
          value: index.toString(),
          label: item,
        };
      }),
    };
    //速度设定
    const speedControl: MixinBarData = {
      title: findAhu?.speed_control?.name,
      tag: findAhu?.speed_control?.tag,
      value: findAhu?.speed_control?.value,
      unit: findAhu?.speed_control?.unit,
      isActive: false,
      fieldType: FieldType.Text,
    };
    //频率反馈
    const speedFeedback: MixinBarData = {
      title: findAhu?.speed_feedback?.name,
      tag: findAhu?.speed_feedback?.tag,
      value: findAhu?.speed_feedback?.value,
      unit: findAhu?.speed_feedback?.unit,
      isActive: false,
      fieldType: FieldType.Text,
    };

    const placeholder: MixinBarData = {
      title: '',
      tag: '',
      value: '',
      unit: '',
      isActive: false,
      fieldType: FieldType.Placeholder,
    };

    let newSwitchBarList: SwitchBarData[] = [];
    let newMixinBarList: MixinBarData[] = [];

    if (type === 'single') {
      newSwitchBarList = [coolingHeating, powerVariable, autoHand, switchData];

      // 按页面顺序排列
      newMixinBarList = [
        highSpeed,
        currentSpeed,
        speedControl,
        midSpeed,
        placeholder,
        speedFeedback,
        lowSpeed,
      ];
    }

    if (type === 'group') {
      // 大厦店铺
      const buildingShop: SwitchBarData = {
        title: findAhu.building_shop.name ?? '',
        tag: findAhu.building_shop.tag ?? '',
        value: findAhu.building_shop.value.toString() === '1',
        isActive: false,
        openText: findAhu.building_shop.val_map[1],
        closeText: findAhu.building_shop.val_map[0],
      };

      newSwitchBarList = [coolingHeating, powerVariable, buildingShop, autoHand, switchData];
      //@ts-ignore
      let vrvCurrentSpeed: MixinBarData = {};

      if (!isEmpty(findVrv)) {
        // 获取vrv的风速
        vrvCurrentSpeed = {
          isActive: false,
          tag: findVrv?.current_speed?.tag ?? '',
          title: 'VRV' + findVrv?.current_speed?.name ?? '',
          value: findVrv?.current_speed?.value.toString(),
          options: Object.keys(findVrv?.current_speed?.val_map).map((key) => {
            return {
              value: key,
              label: findVrv?.current_speed?.val_map[key],
            };
          }),
          fieldType: FieldType.Select,
        };
      }

      // 按页面顺序排列
      newMixinBarList = [
        highSpeed,
        currentSpeed,
        speedControl,
        midSpeed,
        vrvCurrentSpeed,
        speedFeedback,
        lowSpeed,
      ];
    }

    return {
      switchBarList: newSwitchBarList,
      mixinBarList: newMixinBarList,
    };
  };

  /**
   * 请求数据
   * @param floor
   * @param beta
   */
  const getDataSource = async (floor: string, beta: number) => {
    const res = await getMachineInfo({
      floor: floor,
      store_id: storeId,
    });
    console.log('页面数据', res.data);

    getWarningList(res.data[floor].warning);

    saveAcList(res.data[floor].ac_list);
    /**
     * 系统参数
     */
    getSystemParamsData(res.data[floor].params);
    /**
     * 电量数据
     */
    getPowerData(res.data[floor].ac_list);
    /**
     * 照明数据
     */
    getLightData(res.data[floor].ac_list);
    /**
     * 平面图
     */
    getPlaneImgDeviceList(res.data[floor].ac_list, beta);

    // realTimeUpdate(currentAcList);
    /**
     * 设备状态
     */
    getDeviceState(res.data[floor].connect_status);
    /**
     * 最后离线时间
     */
    getLastConnectTime(res.data[floor].last_connect_time);

    //获取图标下的所有信息
    getAllIconData(res.data[floor].ac_list,beta)

    // setDataSource((prevState) =>
    //   produce(prevState, (draftState) => {
    //     if (!isEmpty(pathRefs.current.settings.systemParameters.machineStartTimeList)) {
    //       console.log('pathRefs.current--pathRefs.current', pathRefs.current);
    //       for (const item in pathRefs.current) {
    //         if (!has(pathRefs.current, item)) {
    //           continue;
    //         }
    //
    //         const newData = handleMergeStatesByPath(item, prevState, baseData);
    //         draftState.settings.systemParameters.machineStartTimeList = {
    //           ...newData.settings.systemParameters.machineStartTimeList,
    //         };
    //       }
    //
    //       return;
    //     }
    //     draftState.settings.systemParameters.machineStartTimeList =
    //       dataSource.settings.systemParameters.machineStartTimeList;
    //   }),
    // );
  };

  /**
   * 获取楼层Options
   */
  const getFloorOptions = async () => {
    try {
      const res = await getFloorsData({ store_id: storeId });
      if (res.success) {
        // console.log('get floor options success', res.data);
        const newOptions = res.data.map((item: any) => {
          let beta = 0;
          if (
            item.width / dataSource.planeImgShapeData.containW >
            item.height / dataSource.planeImgShapeData.containH
          ) {
            beta = item.width / dataSource.planeImgShapeData.containW;
          } else {
            beta = item.height / dataSource.planeImgShapeData.containH;
          }
          return {
            value: item.floor,
            label: item.floor,
            width: item.width / beta,
            height: item.height / beta,
            img: item.img,
            beta: beta,
          };
        });
        setDataSource(
          produce((draft: any) => {
            draft.detailBoxData.showDetailBox = false;
            draft.floorOptions = newOptions;
            draft.selectFloor = newOptions[0]?.value;
            draft.planeImgShapeData.beta = newOptions[0]?.beta;
            draft.planeImgShapeData.imageW = newOptions[0]?.width;
            draft.planeImgShapeData.imageH = newOptions[0]?.height;
            draft.planeImgShapeData.planImgSource = newOptions[0]?.img;
          }),
        );
        await getDataSource(newOptions[0]?.value, newOptions[0]?.beta);

        clearTimer();
        timer.current = setInterval(() => {
          getDataSource(newOptions[0]?.value, newOptions[0]?.beta);
        }, 8000);
      }
    } catch (error) {
      console.log('get floor options error', error);
    }
  };

  /**
   * 数据更新方法
   * @param path
   * @param value
   *  @param isPause
   */
  const handleOnValueChange = (path: string, value: any, isPause?: boolean) => {

    console.log('path: string, value: any, isPause?: boolean', path, value);


    let newData = dataSource;
    if (path === 'selectFloor') {
      const selectIndex = findIndex(dataSource.floorOptions, { label: value });
      newData = produce(dataSource, (draft) => {
        draft.detailBoxData.showDetailBox = false;
        draft.selectFloor = value;
        draft.planeImgShapeData.beta = dataSource.floorOptions[selectIndex]?.beta;
        draft.planeImgShapeData.imageW = dataSource.floorOptions[selectIndex]?.width;
        draft.planeImgShapeData.imageH = dataSource.floorOptions[selectIndex]?.height;
        draft.planeImgShapeData.planImgSource = dataSource.floorOptions[selectIndex]?.img;
      });
      getDataSource(value, dataSource.floorOptions[selectIndex]?.beta).catch();
      clearTimer();
      timer.current = setInterval(() => {
        getDataSource(value, dataSource.floorOptions[selectIndex]?.beta).catch();
      }, 12000);
    }
    if (path === 'showModelType') {
      newData = produce(dataSource, (draft) => {
        draft.showModelType = value;
      });
    }
    if (path === 'airValveList') {
      newData = produce(dataSource, (draft: any) => {
        draft.settings.systemParameters.airValveList.openValue = value;
      });
    }
    if (path === 'overTimeData') {
      newData = produce(dataSource, (draft: any) => {
        draft.settings.systemParameters.overTimeData.openValue = value;
      });
    }
    if (path === 'machineStartTimeList') {
      console.log('change times value', value);
      // if(!isNull(value)){
      //   newData = handleParseStateChange(dataSource, path, value);
      // }
      // if(isBoolean(isPause)){
      //   handlePauseState(isPause, pathRefs, path, 10000)
      // }
      //
      // newData = produce(dataSource, (draft: any) => {
      //   if(!isEmpty(pathRefs.current)){
      //     for(const item of pathRefs.current){
      //       // const newData = handleMergeStatesByPath(item , dataSource , baseData)
      //       // draft[item.path] = newData;
      //     }
      //   }
      // })
    }
    if (path === 'powerData') {
      console.log('powerData--value', value);
      newData = produce(dataSource, (draft: any) => {
        draft.settings.powerData[value.key] = value.value;
      });
    }
    if (path === 'lightingOperation') {
      // console.log('lightingOperation--value', value);
      // newData = produce(dataSource, (draft: any) => {
      //   draft.lightingOperation = value;
      // });
    }
    if (path === 'onOpenDevice') {
      console.log('onOpenDevice--value', value);
      newData = produce(dataSource, (draft: any) => {
        if (value.deviceType === 'iaq') {
          draft.showModelType = ModelTypeEnum.IAQ;
          const findIAQ = find(dataSource.originMqttData.acList, { device_id: value.deviceId });
          console.log('备份数据', findIAQ);
          if (isEmpty(findIAQ)) return;
          const deviceName: string = findIAQ?.device_name;
          const deviceId: number = findIAQ?.device_id;

          let dataInfoList: IaqInfoType[] = [];

          Object.keys(findIAQ).forEach((key) => {
            const item: any = findIAQ[key];

            if (item?.value) {
              let bgColor: string = grayColor;
              if (item?.others?.length === 3) {
                if (
                  inRange(
                    Number(item?.value),
                    item?.others[0].value_range[0],
                    item?.others[1].value_range[1],
                  )
                ) {
                  bgColor = greenColor;
                } else if (
                  inRange(
                    Number(item?.value),
                    item?.others[1].value_range[0],
                    item?.others[2].value_range[1],
                  )
                ) {
                  bgColor = yellowColor;
                } else if (
                  inRange(
                    Number(item?.value),
                    item?.others[2].value_range[0],
                    item?.others[2].value_range[1],
                  )
                ) {
                  bgColor = redColor;
                }
              }

              dataInfoList.push({
                name: item?.name ?? '',
                formalVal: item?.value + item?.unit,
                bgColor: bgColor,
                standard: item?.others,
                unit: item?.unit,
              });
            }
          });

          let numericalValueList: NumericalValueType[] = [];
          const getNumericalValue = (value: any, unit: string): NumericalValueType[] => {
            if (isEmpty(value) || value.length !== 3) return [];
            return [
              {
                name: '优:' + value[0].value_range[0] + '~' + value[0].value_range[1] + unit,
                color: greenColor,
              },
              {
                name: '良:' + value[1].value_range[0] + '~' + value[1].value_range[1] + unit,
                color: yellowColor,
              },
              {
                name: '差:' + '>' + value[2].value_range[0] + unit,
                color: redColor,
              },
            ];
          };
          if (dataInfoList.length > 0 && dataInfoList[0]?.standard?.length === 3) {
            numericalValueList = getNumericalValue(
              dataInfoList[0]?.standard,
              dataInfoList[0]?.unit,
            );
          }

          const params = {
            tag: dataInfoList[0].name ?? '',
            group: deviceName,
            day: dataSource.settings.powerData.selectWeekValue,
            shop_id: dataSource.currentStoreId,
          };

          getChartData(params, ModelTypeEnum.IAQ).then(console.log);
          draft.IAQData.deviceName = deviceName;
          draft.IAQData.deviceId = deviceId;
          draft.IAQData.dataInfoList = dataInfoList;
          draft.IAQData.numericalValueList = numericalValueList;
        }
        if (value.deviceType === 'tank') {
          draft.showModelType = ModelTypeEnum.Tank;

          const findTank = find(dataSource.originMqttData.acList, { device_id: value.deviceId });
          console.log('findTank--111', findTank);
          if (isEmpty(findTank)) return;

          let newWaterLevelList: OptionData[] = [];

          if (findTank['低液位']) {
            newWaterLevelList.push({
              value: findTank['低液位']['value'] === '1' ? 'Yes' : 'No',
              label: 'Low Water Level',
            });
          }

          if (findTank['中液位']) {
            newWaterLevelList.push({
              value: findTank['中液位']['value'] === '1' ? 'Yes' : 'No',
              label: 'Medium Water Level',
            });
          }

          if (findTank['高液位']) {
            newWaterLevelList.push({
              value: findTank['高液位']['value'] === '1' ? 'Yes' : 'No',
              label: 'High Water Level',
            });
          }

          if (findTank['超高液位']) {
            newWaterLevelList.push({
              value: findTank['超高液位']['value'] === '1' ? 'Yes' : 'No',
              label: 'Super High Water Level',
            });
          }

          let newTankControlList: TankControlData[] = [];

          if (findTank['1号水泵启动']) {
            const tankControlData: TankControlData = {
              deviceName: findTank['1号泵运行状态']?.device_name,
              isActive: false,
              tag: findTank['1号水泵启动']['tag'],
              storeId: storeId,
              floor: dataSource.selectFloor,
              value: findTank['1号水泵启动']['value'] === '1',
              title: findTank['1号水泵启动']['name'],
              openText: findTank['1号水泵启动']['val_map'][1],
              closeText: findTank['1号水泵启动']['val_map'][0],
            };

            newTankControlList.push(tankControlData);
          }

          if (findTank['2号水泵启动']) {
            const tankControlData: TankControlData = {
              deviceName: findTank['1号泵运行状态']?.device_name,
              isActive: false,
              tag: findTank['2号水泵启动']['tag'],
              storeId: storeId,
              floor: dataSource.selectFloor,
              value: findTank['2号水泵启动']['value'] === '1',
              title: findTank['2号水泵启动']['name'],
              openText: findTank['2号水泵启动']['val_map'][1],
              closeText: findTank['2号水泵启动']['val_map'][0],
            };

            newTankControlList.push(tankControlData);
          }

          const isNo1TankStatus: boolean = findTank?.['1号泵运行状态']?.['value'] === '1';
          const isNo2TankStatus: boolean = findTank?.['2号泵运行状态']?.['value'] === '1';

          draft.TankData.no1TankStatus = isNo1TankStatus;
          draft.TankData.no2TankStatus = isNo2TankStatus;
          draft.TankData.waterLevelList = newWaterLevelList;
          draft.TankData.tankControlList = newTankControlList;
        }
        /**
         * 获取单设备
         * @param device
         * @param deviceData
         */
        const getAloneData = (device: PlaneImgDevice, deviceData: any) => {
          let newContentList: ContentList[];
          if (device.deviceType === 'ahu') {
            newContentList = [
              {
                key: 'returnAirTemperature',
                value: deviceData?.wind_return_temperature?.format_val,
              },
              {
                key: 'frequencySetting',
                value: deviceData?.speed_giving?.format_val,
              },
              {
                key: 'frequencyFeedback',
                value: deviceData?.speed_feedback?.format_val,
              },
              {
                key: 'currentSpeed',
                value: deviceData?.current_speed?.format_val,
              },
            ];
          } else if (device.deviceType === 'fcu' || device.deviceType === 'vrv') {
            newContentList = [
              {
                key: 'returnAirTemperature',
                value: deviceData?.wind_return_temperature?.format_val,
              },
              {
                key: 'modeFeedback',
                value: deviceData?.mode?.format_val,
              },
              {
                key: 'currentSpeed',
                value: deviceData?.current_speed?.format_val,
              },
            ];
          }
          //  else if (device.deviceType === 'fan') {
          //   if(deviceData?.room_temperature_1 && deviceData?.fan_start_temperature && deviceData?.fan_end_temperature){
          //     newContentList = [
          //       {
          //         key: 'roomTemperature',
          //         value: deviceData?.room_temperature_1?.format_val,
          //       },
          //       {
          //         key: 'fanStartTemperature',
          //         value: deviceData?.fan_start_temperature?.format_val,
          //       },
          //       {
          //         key: 'fanEndTemperature',
          //         value: deviceData?.fan_end_temperature?.format_val,
          //       },
          //     ];
          //   } else {
          //     newContentList = [];
          //   }
          // }
            else {
            newContentList = [];
          }
          const newAloneData: AloneData = {
            deviceName: device.deviceName,
            deviceType: device.deviceType,
            deviceStatus: device.deviceStatus,
            deviceId: device.deviceId,
            contentList: newContentList,
          };

          setDataSource(
            produce((draft) => {
              draft.detailBoxData.showDetailBox = true;
              draft.detailBoxData.x = device.x + MachineControlConfig.deviceCommonIconWidth;
              draft.detailBoxData.y = device.y + MachineControlConfig.deviceCommonIconHeight;
            }),
          );
          return newAloneData;
        };
        if (
          value.deviceType === 'ahu' ||
          value.deviceType === 'fcu' ||
          value.deviceType === 'vrv'
        ) {

          //机组数据
          let groupsData: any[] = [];
          if (value.groupId !== '0') {
            groupsData = filter(dataSource.originMqttData.acList, { group_id: value.groupId });
          }
          // console.log('机组数据',groupsData);
          //是否是机组
          const isGroup: boolean =
            some(groupsData, { device_type: 'ahu' }) && some(groupsData, { device_type: 'vrv' });
          // 单台机器的数据
          const alonesData = find(dataSource.originMqttData.acList, {
            device_id: value.deviceId,
          });
          // console.log('单台机器的数据', alonesData);
          if (isGroup) {
            let ahuAloneData: AloneData;
            let vrvAloneData: AloneData;
            groupsData?.forEach((device) => {
              if (device?.device_type === 'ahu') {
                // console.log('ahu---ahu--ahu',device)
                const ahuItem: PlaneImgDevice = {
                  x: value.x,
                  y: value.y,
                  area: '',
                  deviceLocation: '',
                  devicePosition: '',
                  deviceName: device?.auto_hand?.device_name,
                  deviceType: device?.device_type,
                  deviceStatus: getDeviceStatus(device?.device_type, device),
                  deviceId: device?.device_id,
                  groupId: device?.group_id,
                };
                ahuAloneData = getAloneData(ahuItem, device);
              }
              if (device?.device_type === 'vrv') {
                const vrvItem: PlaneImgDevice = {
                  x: value.x,
                  y: value.y,
                  area: '',
                  deviceLocation: '',
                  devicePosition: '',
                  deviceName: device?.auto_hand?.device_name,
                  deviceType: device?.device_type,
                  deviceStatus: getDeviceStatus(device?.device_type, device),
                  deviceId: device?.device_id,
                  groupId: device?.group_id,
                };
                vrvAloneData = getAloneData(vrvItem, device);
              }
            });
            draft.detailBoxData.type = ShowBoxType.Group;
            draft.detailBoxData.groupsData = {
              ahu: ahuAloneData,
              vrv: vrvAloneData,
            };
          } else {
            const aloneData: AloneData = getAloneData(value, alonesData);
            draft.detailBoxData.type = ShowBoxType.Alone;
            draft.detailBoxData.aloneData = aloneData;
          }
          draft.detailBoxData.showDetailBox = true;
          draft.detailBoxData.x = value.x + MachineControlConfig.deviceCommonIconWidth;
          draft.detailBoxData.y = value.y + MachineControlConfig.deviceCommonIconHeight;
        }
        if(value.deviceType === 'fan'){
          draft.showModelType =  ModelTypeEnum.FAN

          // const findFan = find(dataSource.originMqttData.acList, { device_id: value.deviceId });
          // console.log('findFan--风机', findFan);
          // if (findFan) {
          //   console.log('findFan--风机', findFan);
          //   const deviceName = findFan.device_name;
          //   const deviceId = findFan.device_id;
          //   let autoHand = {};
          //   Object.keys(findFan).forEach((key) => {
          //     //启停模式
          //     const autoHand = {
          //       isActive: false,
          //       tag: findFan?.auto_hand?.tag ?? '',
          //       title: findFan?.auto_hand?.name ?? '',
          //       value: findFan?.auto_hand?.value.toString() === '1',
          //       openText: findFan?.auto_hand?.val_map[1],
          //       closeText: findFan?.auto_hand?.val_map[0],
          //     };
          //     //风机运行
          //     const fanRunning = {
          //       isActive: false,
          //       tag: findFan?.fan_running?.tag ?? '',
          //       title: findFan?.fan_running?.name ?? '',
          //       value: findFan?.fan_running?.value.toString() === '1',
          //       openText: findFan?.fan_running?.val_map[1],
          //       closeText: findFan?.fan_running?.val_map[0],
          //     };
          //   })
          //
          //
          //   draft.FanData.deviceName = deviceName;
          //   draft.FanData.deviceId = deviceId;
          //   draft.FanData.autoHand = autoHand;
          //   draft.FanData.fanRunning = fanRunning;
            // draft.FanData.showDetailBox = true;
            // draft.FanData.x = value.x + MachineControlConfig.deviceCommonIconWidth;
            // draft.FanData.y = value.y + MachineControlConfig.deviceCommonIconHeight;
          // }
        }
      });
    }
    if (path === 'IAQData') {
      console.log('IAQData--value', value);
      newData = produce(dataSource, (draft: any) => {
        draft.IAQData[value.key] = value.value;
      });
    }
    if (path === 'TankData') {
      console.log('TankData--value', value);
      newData = produce(dataSource, (draft: any) => {
        draft.TankData[value.key] = value.value;
      });
    }
    if (path === 'openCardDetail') {
      console.log('openCardDetail--value', value);
      newData = produce(dataSource, (draft: any) => {
        draft.detailBoxData.showDetailBox = value;
        // if (
        //   value?.deviceType === '' ||
        //   value?.deviceIdList.length === 0 ||
        //   isEmpty(dataSource.originMqttData.acList)
        // )
        //   return;

        refData.current.clickViewMachineData = value;

        if (value.deviceType === 'fcu') {
          draft.showModelType = ModelTypeEnum.FCU;
          const findFcu = find(dataSource.originMqttData.acList, {
            device_id: value.deviceIdList[0],
          });
          // console.log('fcu--fcu--fcu',findFcu,arg,dataSource.originMqttData.acList)
          if (isEmpty(findFcu)) return;
          const deviceName: string = findFcu?.mode.device_name ?? '';
          //停启模式
          const autoHand = {
            isActive: false,
            tag: findFcu?.auto_hand?.tag ?? '',
            title: findFcu?.auto_hand?.name ?? '',
            value: findFcu?.auto_hand?.value.toString() === '1',
            openText: findFcu?.auto_hand?.val_map[1],
            closeText: findFcu?.auto_hand?.val_map[0],
          };
          //开关机
          const switchData = {
            isActive: false,
            tag: findFcu?.switch?.tag ?? '',
            title: findFcu?.switch?.name ?? '',
            value: findFcu?.switch?.value.toString() === '1',
            openText: findFcu?.switch?.val_map[1],
            closeText: findFcu?.switch?.val_map[0],
          };
          //时控、手动
          const newSwitchBarList: SwitchBarData[] = [autoHand, switchData];
          //风速
          const currentSpeed: MixinBarData = {
            isActive: false,
            tag: findFcu?.current_speed?.tag ?? '',
            title: findFcu?.current_speed?.name ?? '',
            value: findFcu?.current_speed?.value.toString(),
            fieldType: FieldType.Select,
            options: findFcu?.current_speed?.val_map?.map((item: any, index: any) => {
              return {
                value: index.toString(),
                label: item,
              };
            }),
          };
          //模式 制冷/制热/通风
          const mode: MixinBarData = {
            isActive: false,
            tag: findFcu?.mode?.tag ?? '',
            title: findFcu?.mode?.name ?? '',
            value: findFcu?.mode?.value.toString(),
            fieldType: FieldType.Select,
            options: findFcu?.mode?.val_map?.map((item: any, index: any) => {
              return {
                value: index.toString(),
                label: item,
              };
            }),
          };

          const newMixinBarList: MixinBarData[] = [currentSpeed, mode];

          const windTemperatureData: WindTemperatureData = {
            title: findFcu?.wind_return_temperature?.name ?? '',
            formatVal: findFcu?.wind_return_temperature?.format_val ?? '',
          };

          // 当前是否是制暖模式
          let isHotMode: boolean = false;

          let fanImagePath: string = coolFanImage;

          mode.options?.forEach((item) => {
            if (item.label === '制暖' && findFcu?.mode?.value.toString() === item.value) {
              fanImagePath = hotFanImage;
              isHotMode = true;
            }
          });

          const fcuStatus: string = switchData.value ? '运行' : '停止';

          let fanAnimationDuration: string = '3s'; // 默认低速

          if (currentSpeed.value === '1') {
            fanAnimationDuration = '2s';
          }

          if (currentSpeed.value === '2') {
            fanAnimationDuration = '3s';
          }

          let waterPipeList: string[] = [];

          if (isHotMode) {
            if (switchData.value) {
              waterPipeList.push(waterPipeMoveHotPath);
            } else {
              waterPipeList.push(waterPipeStaticHotPath);
            }
          } else {
            if (switchData.value) {
              waterPipeList.push(waterPipeMoveCoolPath);
            } else {
              waterPipeList.push(waterPipeStaticCoolPath);
            }
          }

          const machineChassis: MachineChassisData = {
            fanAnimationDuration: fanAnimationDuration,
            fanImagePath: fanImagePath,
            fcuStatus: fcuStatus,
            temperatureTitle: findFcu?.temperature?.name ?? '',
            temperatureValue: findFcu?.temperature?.value.toString(),
            temperatureUnit: findFcu?.temperature?.unit ?? '',
            temperatureTag: findFcu?.temperature?.tag ?? '',
            windTemperatureTitle: windTemperatureData.title,
            windTemperatureFormatVal: windTemperatureData.formatVal,
            deviceType: 'fcu',
            waterPipeList: waterPipeList,
          };

          draft.showModelType = ModelTypeEnum.FCU;
          draft.FCUData.deviceName = deviceName;
          draft.FCUData.storeId = storeId;
          draft.FCUData.floor = dataSource.selectFloor;
          draft.FCUData.switchBarList = newSwitchBarList;
          draft.FCUData.mixinBarList = newMixinBarList;
          draft.FCUData.machineChassis = machineChassis;
        }
        else if (value.deviceType === 'ahu') {
          draft.showModelType = ModelTypeEnum.AHU;

          const findAhu = find(dataSource.originMqttData.acList, {
            device_id: value.deviceIdList[0],
          });

          if (isEmpty(findAhu)) return;
          console.log('findAhu--findAhu--999', findAhu);
          const deviceName: string = findAhu?.auto_hand.device_name ?? '';

          const windTemperatureData: WindTemperatureData = {
            title: findAhu?.wind_return_temperature?.name ?? '',
            formatVal: findAhu?.wind_return_temperature?.format_val ?? '',
          };

          let isHotMode: boolean = false;

          let fanImagePath: string = coolFanImage;

          findAhu?.cooling_heating?.val_map.forEach((item: any, index: any) => {
            if (
              item === '制热' &&
              index.toString() === findAhu?.cooling_heating?.value.toString()
            ) {
              fanImagePath = hotFanImage;
              isHotMode = true;
            }
          });

          const fcuStatus: string = findAhu?.switch?.value.toString() === '1' ? '运行' : '停止';

          let fanAnimationDuration: string = '3s'; // 默认低速

          if (findAhu?.current_speed?.value.toString() === '1') {
            fanAnimationDuration = '2s';
          }

          if (findAhu?.current_speed?.value.toString() === '1') {
            fanAnimationDuration = '3s';
          }

          let waterPipeList: string[] = [];

          let givingFeedbackTextList: GivingFeedbackData[] = [];

          // 判断是两管还是四管
          if ('water_valve_feedback' in findAhu) {
            if (isHotMode) {
              if (findAhu?.water_valve_feedback?.value >= 5) {
                waterPipeList.push(waterPipeMoveHotPath);
              } else {
                waterPipeList.push(waterPipeStaticHotPath);
              }
            } else {
              if (findAhu?.water_valve_feedback?.value >= 5) {
                waterPipeList.push(waterPipeMoveCoolPath);
              } else {
                waterPipeList.push(waterPipeStaticCoolPath);
              }
            }

            givingFeedbackTextList = [
              {
                name: findAhu?.water_valve_giving?.name,
                formatVal: findAhu?.water_valve_giving?.format_val,
              },
              {
                name: findAhu?.water_valve_feedback?.name,
                formatVal: findAhu?.water_valve_feedback?.format_val,
              },
            ];
          }

          if ('water_hot_valve_feedback' in findAhu) {
            if (findAhu?.water_hot_valve_feedback?.value >= 5) {
              waterPipeList.push(waterPipeMoveHotPath);
            } else {
              waterPipeList.push(waterPipeStaticHotPath);
            }

            if (findAhu?.water_cold_valve_feedback?.value >= 5) {
              waterPipeList.push(waterPipeMoveCoolPath);
            } else {
              waterPipeList.push(waterPipeStaticCoolPath);
            }

            givingFeedbackTextList = [
              {
                name: findAhu?.water_hot_valve_giving?.name,
                formatVal: findAhu?.water_hot_valve_giving?.format_val,
              },
              {
                name: findAhu?.water_cold_valve_giving?.name,
                formatVal: findAhu?.water_cold_valve_giving?.format_val,
              },
              {
                name: findAhu?.water_hot_valve_feedback?.name,
                formatVal: findAhu?.water_hot_valve_feedback?.format_val,
              },
              {
                name: findAhu?.water_cold_valve_feedback?.name,
                formatVal: findAhu?.water_cold_valve_feedback?.format_val,
              },
            ];
          }

          const machineChassis: MachineChassisData = {
            fanAnimationDuration: fanAnimationDuration,
            fanImagePath: fanImagePath,
            fcuStatus: fcuStatus,
            temperatureTitle: findAhu?.temperature?.name ?? '',
            temperatureValue: findAhu?.temperature?.value.toString(),
            temperatureUnit: findAhu?.temperature?.unit ?? '',
            temperatureTag: findAhu?.temperature?.tag ?? '',
            windTemperatureTitle: windTemperatureData.title,
            windTemperatureFormatVal: windTemperatureData.formatVal,
            deviceType: 'ahu',
            waterPipeList: waterPipeList,
            givingFeedbackTextList: givingFeedbackTextList,
          };

          draft.showModelType = ModelTypeEnum.AHU;
          draft.AHUData.deviceName = deviceName;
          draft.AHUData.storeId = storeId;
          draft.AHUData.floor = dataSource.selectFloor;
          draft.AHUData.switchBarList = getAhuAssembleData(
            findAhu,
            'single',
            undefined,
          ).switchBarList;
          draft.AHUData.mixinBarList = getAhuAssembleData(
            findAhu,
            'single',
            undefined,
          ).mixinBarList;
          draft.AHUData.machineChassis = machineChassis;

          console.log(
            '00--00',
            getAhuAssembleData(findAhu, 'single', undefined).switchBarList,
            '11--11',
            getAhuAssembleData(findAhu, 'single', undefined).mixinBarList,
          );
        }
        else if (value.deviceType === 'vrv') {
          draft.showModelType = ModelTypeEnum.VRV;

          const findVrv = find(dataSource.originMqttData.acList, {
            device_id: value.deviceIdList[0],
          });

          if (isEmpty(findVrv)) return;

          const deviceName: string = findVrv?.mode.device_name ?? '';

          const autoHand: SwitchBarData = {
            isActive: false,
            tag: findVrv?.auto_hand?.tag ?? '',
            title: findVrv?.auto_hand?.name ?? '',
            value: findVrv?.auto_hand?.value.toString() === '1',
            openText: findVrv?.auto_hand?.val_map[1],
            closeText: findVrv?.auto_hand?.val_map[0],
          };

          const switchData: SwitchBarData = {
            isActive: false,
            tag: findVrv?.switch?.tag ?? '',
            title: findVrv?.switch?.name ?? '',
            value: findVrv?.switch?.value.toString() === '1',
            openText: findVrv?.switch?.val_map[1],
            closeText: findVrv?.switch?.val_map[0],
          };
          // console.log('switchData--switchData-))',switchData)

          const newSwitchBarList: SwitchBarData[] = [autoHand, switchData];

          const currentSpeed: MixinBarData = {
            isActive: false,
            tag: findVrv?.current_speed?.tag ?? '',
            title: findVrv?.current_speed?.name ?? '',
            value: findVrv?.current_speed?.value.toString(),
            options: Object.keys(findVrv?.current_speed?.val_map).map((key) => {
              return {
                value: key,
                label: findVrv?.current_speed?.val_map[key],
              };
            }),
            fieldType: FieldType.Select,
          };

          const controlMode: MixinBarData = {
            isActive: false,
            tag: findVrv?.control_mode?.tag ?? '',
            title: findVrv?.control_mode?.name ?? '',
            value: findVrv?.control_mode?.value.toString(),
            options: Object.keys(findVrv?.control_mode?.val_map).map((key) => {
              return {
                value: key,
                label: findVrv?.control_mode?.val_map[key],
              };
            }),
            fieldType: FieldType.Select,
          };

          // console.log('000',controlMode.options);
          // let fanImagePath: string = switchData.value ? hotFanImage : coolFanImage;
          let fanImagePath: string = 'cool';
          controlMode.options?.forEach((item) => {
            if (item.label === '制暖' && findVrv?.control_mode?.value.toString() === '1') {
              fanImagePath = hotFanImage;
            } else {
              fanImagePath = coolFanImage;
            }
          });

          // 按页面顺序排列
          const newMixinBarList: MixinBarData[] = [currentSpeed, controlMode];

          const windTemperatureData: WindTemperatureData = {
            title: findVrv?.wind_return_temperature?.name ?? '',
            formatVal: findVrv?.wind_return_temperature?.format_val ?? '',
          };

          const fcuStatus: string = switchData.value ? '运行' : '停止';

          let fanAnimationDuration: string = '3s'; // 默认低速

          if (currentSpeed.value === '1') {
            fanAnimationDuration = '2s';
          }

          if (currentSpeed.value === '2') {
            fanAnimationDuration = '3s';
          }
          //@ts-ignore
          const machineChassis: MachineChassisData = {
            fanAnimationDuration: fanAnimationDuration,
            fanImagePath: fanImagePath,
            fcuStatus: fcuStatus,
            temperatureTitle: findVrv?.temperature?.name ?? '',
            temperatureValue: findVrv?.temperature?.value.toString(),
            temperatureUnit: findVrv?.temperature?.unit ?? '',
            temperatureTag: findVrv?.temperature?.tag ?? '',
            windTemperatureTitle: windTemperatureData.title,
            windTemperatureFormatVal: windTemperatureData.formatVal,
          };

          draft.showModelType = ModelTypeEnum.VRV;
          draft.VRVData.deviceName = deviceName;
          draft.VRVData.storeId = storeId;
          draft.VRVData.floor = dataSource.selectFloor;
          draft.VRVData.switchBarList = newSwitchBarList;
          draft.VRVData.mixinBarList = newMixinBarList;
          draft.VRVData.machineChassis = machineChassis;
        }
        else if (value.deviceType === 'group') {
          draft.showModelType = ModelTypeEnum.AV;

          if (value.deviceIdList.length < 2) return;

          const findAhu = find(dataSource.originMqttData.acList, {
            device_id: value.deviceIdList[0],
          });
          const findVrv = find(dataSource.originMqttData.acList, {
            device_id: value.deviceIdList[1],
          });
          // console.log('findAhu---findAhu--0909',findAhu)
          const ahuDeviceName: string = findAhu?.auto_hand.device_name ?? '';
          const vrvDeviceName: string = findVrv?.mode.device_name ?? '';

          const windTemperatureData: WindTemperatureData = {
            title: findAhu?.wind_return_temperature?.name ?? '',
            formatVal: findAhu?.wind_return_temperature?.format_val ?? '',
          };

          let ahuFanImagePath: string =
            findAhu?.cooling_heating?.value.toString() === '1' ? hotFanImage : coolFanImage;

          const ahuStatus: string = findAhu?.switch?.value.toString() === '1' ? '运行' : '停止';

          let ahuFanAnimationDuration: string = '3s'; // 默认低速

          if (findAhu?.current_speed?.value.toString() === '1') {
            ahuFanAnimationDuration = '2s';
          }

          if (findAhu?.current_speed?.value.toString() === '1') {
            ahuFanAnimationDuration = '3s';
          }

          let vrvFanImagePath: string =
            findVrv?.switch?.value.toString() === '1' ? hotFanImage : coolFanImage;

          const vrvStatus: string = findVrv?.switch?.value.toString() === '1' ? '运行' : '停止';

          let vrvFanAnimationDuration: string = '3s'; // 默认低速

          if (findVrv?.current_speed?.value === '1') {
            vrvFanAnimationDuration = '2s';
          }

          if (findVrv?.current_speed?.value === '2') {
            vrvFanAnimationDuration = '3s';
          }

          const machineChassis: GroupMachineChassis = {
            ahuHanAnimationDuration: ahuFanAnimationDuration,
            ahuFanImagePath: ahuFanImagePath,
            ahuStatus: ahuStatus,
            vrvFanAnimationDuration: vrvFanAnimationDuration,
            vrvFanImagePath: vrvFanImagePath,
            vrvStatus: vrvStatus,
            temperatureTitle: findAhu?.temperature?.name ?? '',
            temperatureValue: findAhu?.temperature?.value.toString(),
            temperatureUnit: findAhu?.temperature?.unit ?? '',
            temperatureTag: findAhu?.temperature?.tag ?? '',
            windTemperatureTitle: windTemperatureData.title,
            windTemperatureFormatVal: windTemperatureData.formatVal,
          };

          draft.showModelType = ModelTypeEnum.AV;
          draft.GroupData.ahuDeviceName = ahuDeviceName;
          draft.GroupData.vrvDeviceName = vrvDeviceName;
          draft.GroupData.storeId = storeId;
          draft.GroupData.floor = dataSource.selectFloor;
          draft.GroupData.switchBarList = getAhuAssembleData(
            findAhu,
            'group',
            findVrv,
          ).switchBarList;
          draft.GroupData.mixinBarList = getAhuAssembleData(findAhu, 'group', findVrv).mixinBarList;
          draft.GroupData.machineChassis = machineChassis;
        }

      });
    }
    if(path === 'FCUData'){
      console.log('FCUData--value------------------',value)
      newData = produce(dataSource, (draft: any) => {
        draft.FCUData[value.key] = value.value
      })
    }
    if(path === 'AHUData'){
      console.log('AHUData--value',value)
      newData = produce(dataSource, (draft: any) => {
        draft.AHUData[value.key] = value.value
      })
    }
    if(path === 'VRVData'){
      console.log('VRVData--value',value)
      newData = produce(dataSource, (draft: any) => {
        draft.VRVData[value.key] = value.value
      })
    }
    if(path === 'GroupData'){
      console.log('GroupData--value',value)
      newData = produce(dataSource, (draft: any) => {
        draft.GroupData[value.key] = value.value
      })
    }
    setDataSource(newData);
  };
  const handleFullValueChange = (path: string, value: any, isPause?: boolean) => {
    if (!isNull(value)) {
      const newState = handleParseStateChange(dataSource, path, value);
      console.log('newState--newState', newState)
      setDataSource(newState);
    }

    // 处理暂停
    if (isBoolean(isPause)) {
      handlePauseState(isPause, pathRefs, path, 10000);
    }
  }

  useEffect(() => {
    getFloorOptions().catch();
    // console.log('999',dataSource.settings.systemParameters.machineStartTimeList)
    return () => {
      clearTimer();
    };
  }, []);

  return {
    dataSource,
    handleFullValueChange,
    handleOnValueChange,
  };
};
