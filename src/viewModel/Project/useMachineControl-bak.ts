import MachineControlConfig from '@/configs/machine_control';
import { getFloorsData, getMachineInfo } from '@/services/ant-design-pro/project';
import { getDeviceStatus, getPointPosition } from '@/utils/machine_control_service';
import { original, produce } from 'immer';
import _, { filter, find, has, isBoolean, isEmpty, isNull, some } from 'lodash';
import { useEffect, useRef, useState } from 'react';

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
  FAN
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
  machineStartTimeList: MachineStartTimeData[]; // 开机时间
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
  floorOptions: OptionData[];
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

import { handleMergeStatesByPath, handleParseStateChange, handlePauseState } from '@/utils/utils';
import dayjs from 'dayjs';

export const useMachineControl = () => {
  const [dataSource, setDataSource] = useState<DataSource>({
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
    currentStoreId: 1775,
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
        machineStartTimeList: [],
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
    // FanData: {
    //   deviceName: '',
    //   storeId: 0,
    //   floor: '',
    //   switchBarList: [],
    //   templateList: [],
    // },
    FanData:[],
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
  });
  const timer = useRef<NodeJS.Timeout | null>(null);
  const refData = useRef<any>({
    showModelType: null,
    lockPath: {},
    clickViewMachineData: {
      deviceIdList: [],
      deviceType: '',
      deviceName: '',
    },
  });
  const OnChange = (path: string, value: any) => {
    const newData = handleParseStateChange(dataSource, path, value);
    setDataSource(newData);
    // console.log('handleOnChange', newData);
  };
  /**
   * 🔒 锁定状态
   * @param path
   * @param isBegin
   * @param type
   * @param value
   */
  const lock = (path: string, isBegin: boolean, type: string, value: any) => {
    if (isBegin) {
      // @ts-ignore
      refData.current.lockPath[path] = path;
      console.log(
        'have lock',
        refData.current.lockPath,
        Object.keys(refData.current.lockPath).length,
      );
    } else {
      // 延迟 10 秒执行 else 逻辑
      setTimeout(() => {
        // @ts-ignore
        refData.current.lockPath[path] = '';
        refData.current.lockPath = _.pickBy(refData.current.lockPath, (value) => value !== '');
      }, 10000);
    }
    console.log('refData.current.lockPath:', refData.current.lockPath);
    if ('TimePicker:onCalendarChange' === type) {
      OnChange(path, value);
      // console.log('onChange是否执行');
    }
  };

  /**
   * 状态合并函数
   * @param preState
   * @param newState
   */
  function mergeStates(preState: any, newState: any) {
    // eslint-disable-next-line guard-for-in
    for (const pathStr in refData.current.lockPath) {
      const pathArr = pathStr.split(':');
      _.set(newState, pathArr, _.get(preState, pathArr));
    }
    return newState;
  }

  //------定时延迟------//
  const pathRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const baseDataSource: any = {
    cardData: {
      data: [],
      title: [],
      storeId: '',
      floor: '',
      type: '',
      machine: '',
    },
    lightingData: {
      data: [],
      storeId: '',
      floor: '',
      type: '',
      machine: '',
    },
  };
  const [baseData, setBaseData] = useState<any>(baseDataSource);
  const handleFullValueChange = (path: string, value: any, isPause?: boolean) => {
    if (!isNull(value)) {
      const newState = handleParseStateChange(baseData, path, value);
      setBaseData(newState);
    }
    // 处理暂停
    if (isBoolean(isPause)) {
      handlePauseState(isPause, pathRefs, path, 10000);
    }
  };

  /**
   * 清洗数据
   * @param o_data
   */
  const formatDataSource = (o_data: any) => {
    let newMachineStartTimeList: MachineStartTimeData[] = [];
    if ('ahu_system_open_at_h' in o_data) {
      newMachineStartTimeList.push({
        deviceName: '',
        isActive: false,
        tag: 'ahu_open_close_time',
        storeId: dataSource.currentStoreId,
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
        storeId: dataSource.currentStoreId,
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
        storeId: dataSource.currentStoreId,
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
        storeId: dataSource.currentStoreId,
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
      // console.log('supplyReturnData--supplyReturnData',supplyReturnData)
      newSupplyReturnList.push(supplyReturnData);
    });
    //风速列表
    const newWindSpeedList: string[] = [];
    const windSpeeds = [
      currentParams.wind_speed_1,
      currentParams.wind_speed_2,
      currentParams.wind_speed_3,
    ];
    windSpeeds.forEach((speed) => {
      if (speed?.name && speed?.format_val) {
        newWindSpeedList.push(`${speed.name}  ${speed.format_val}`);
      }
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
          storeId: dataSource.currentStoreId,
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
        newOverTime.storeId = dataSource.currentStoreId;
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

    setDataSource(
      produce((draft) => {
        const originalState = original(draft);
        // console.log('333333333', originalState?.settings.systemParameters.machineStartTimeList);
        const systemParams = draft.settings.systemParameters;
        systemParams.supplyReturnList = newSupplyReturnList;
        systemParams.windSpeedList = newWindSpeedList;
        systemParams.airValveList = newAirValveList;
        systemParams.overTimeData = newOverTime;
        systemParams.machineStartTimeList =
          Object.keys(refData.current.lockPath).length > 0
            ? originalState?.settings.systemParameters.machineStartTimeList
            : mergeStates(
                originalState?.settings.systemParameters.machineStartTimeList,
                newMachineStartTimeList,
              );
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
        // console.log('灯光操作数据',key,currentParams[key]);
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
          storeId: dataSource.currentStoreId,
          floor: dataSource.selectFloor,
        });
      }
    });
    setDataSource(
      produce((draft) => {
        const originalState = original(draft);
        draft.settings.lightingOperation =
          Object.keys(refData.current.lockPath).length > 0
            ? originalState?.settings.lightingOperation
            : mergeStates(originalState?.settings.lightingOperation, newLightList);
      }),
    );
    return newLightList;
  };
  /**
   * 获取平面图数据
   */
  // const fetchPlaneImgData = async () => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(dataSource.planeImgShapeData.planImgSource);
  //
  //       setDataSource(
  //         produce((draft: any) => {
  //           draft.planeImgShapeData.planImgSource = dataSource.planeImgShapeData.planImgSource;
  //         }),
  //       );
  //     }, 2000); // 2秒后返回结果
  //   });
  // };
  /**
   * 获取图片宽、高、缩放系数
   * @param source
   * @returns beta
   */
  const getPlaneImgData = async (): Promise<number> => {
    try {
      // const img = await loadImage(source);
      // const width = img.width;
      // const height = img.height;
      const width = dataSource.planeImgShapeData.imageW;
      const height = dataSource.planeImgShapeData.imageH;

      let beta = 0;

      if (
        width / dataSource.planeImgShapeData.containW >
        height / dataSource.planeImgShapeData.containH
      ) {
        beta = width / dataSource.planeImgShapeData.containW;
      } else {
        beta = height / dataSource.planeImgShapeData.containH;
      }
      // setDataSource(
      //   produce((draft) => {
      //     draft.planeImgShapeData.imageW = width / beta;
      //     draft.planeImgShapeData.imageH = height / beta;
      //     draft.planeImgShapeData.beta = beta;
      //   }),
      // );

      return beta;
    } catch (error) {
      console.error('Error loading image:', error);
      return 0;
    }
  };
  /**
   * 获取平面图设备列表
   * @param currentParams
   * @param beta
   */
  const getPlaneImgDeviceList = (currentParams: any, beta: number) => {
    const newPlaneImgDeviceList: PlaneImgDevice[] = [];
    console.log('currentParams--currentParams--111',currentParams)
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
      // console.log('000--000',currentParams[key],currentParams[key]?.device_type,deviceStatus)
      const data: PlaneImgDevice = {
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
    } else {
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

  // 获取峰值
  const getNumericalValue = (value: number[], unit: string): NumericalValueType[] => {
    if (isEmpty(value) || value.length !== 5) return [];

    return [
      {
        name: '好:' + value[0] + '~' + value[1] + unit,
        color: greenColor,
      },
      {
        name: '良:' + value[2] + '~' + value[3] + unit,
        color: yellowColor,
      },
      {
        name: '差:' + '>' + value[4] + unit,
        color: redColor,
      },
    ];
  };
  // 获取IAQ
  const getIAQData = (item: PlaneImgDevice) => {
    const findIAQ = find(dataSource.originMqttData.acList, { device_id: item.deviceId });
    if (isEmpty(findIAQ)) return;
    const deviceName: string = findIAQ?.device_name;
    const deviceId: number = findIAQ?.device_id;

    let dataInfoList: IaqInfoType[] = [];

    Object.keys(findIAQ).forEach((key) => {
      const item: any = findIAQ[key];

      if (item?.value) {
        let bgColor: string = grayColor;

        if (item?.standard?.length === 5) {
          if (Number(item?.value) < item?.standard[1]) {
            bgColor = greenColor;
          } else if (
            Number(item?.value) > item?.standard[1] &&
            Number(item?.value) < item?.standard[3]
          ) {
            bgColor = yellowColor;
          } else if (Number(item?.value) > item?.standard[4]) {
            bgColor = redColor;
          }
        }

        dataInfoList.push({
          name: item?.name ?? '',
          formalVal: item?.value + item?.unit,
          bgColor: bgColor,
          standard: item?.standard,
          unit: item?.unit,
        });
      }
    });

    let numericalValueList: NumericalValueType[] = [];

    // console.log(dataInfoList[0]);

    if (dataInfoList.length > 0 && dataInfoList[0]?.standard?.length === 5) {
      numericalValueList = getNumericalValue(dataInfoList[0]?.standard, dataInfoList[0]?.unit);
    }

    const params = {
      tag: dataInfoList[0].name ?? '',
      group: deviceName,
      day: dataSource.settings.powerData.selectWeekValue,
      shop_id: dataSource.currentStoreId,
    };

    getChartData(params, ModelTypeEnum.IAQ).then(console.log);

    setDataSource(
      produce((draft) => {
        // draft.showModelType = ModelTypeEnum.IAQ;
        draft.IAQData.deviceName = deviceName;
        draft.IAQData.deviceId = deviceId;
        draft.IAQData.dataInfoList = dataInfoList;
        draft.IAQData.numericalValueList = numericalValueList;
      }),
    );
  };
  // 获取Tank
  const getTankData = (item: PlaneImgDevice) => {
    const findTank = find(dataSource.originMqttData.acList, { device_id: item.deviceId });
    // console.log('findTank--111', findTank);
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
        deviceName: findTank?.device_name,
        isActive: false,
        tag: findTank['1号水泵启动']['tag'],
        storeId: dataSource.currentStoreId,
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
        deviceName: findTank?.device_name,
        isActive: false,
        tag: findTank['2号水泵启动']['tag'],
        storeId: dataSource.currentStoreId,
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

    setDataSource(
      produce((draft) => {
        draft.TankData.no1TankStatus = isNo1TankStatus;
        draft.TankData.no2TankStatus = isNo2TankStatus;
        draft.TankData.waterLevelList = newWaterLevelList;
        draft.TankData.tankControlList = newTankControlList;
      }),
    );
  };
  //获取FAN
  const getFanData = (item: PlaneImgDevice) => {
    const findFan = find(dataSource.originMqttData.acList, { device_id: item.deviceId });
    console.log('findFan--findFan',findFan)
    if (isEmpty(findFan)) return;

    let newFanList:any[] = [];
    if(findFan['auto_hand']){
      const fanControlData:any = {
        deviceName: findFan?.device_name,
        isActive: false,
        tag: findFan['auto_hand']['tag'],
        storeId: dataSource.currentStoreId,
        floor: dataSource.selectFloor,
        value: findFan['auto_hand']['value'] === '1',
        title: findFan['auto_hand']['name'],
        openText: findFan['auto_hand']['val_map'][1],
        closeText: findFan['auto_hand']['val_map'][0],
      };
      newFanList.push(fanControlData);
    }
    if(findFan['fan_running_1']){
      const fanRunningData:any = {
        deviceName: findFan?.device_name,
        isActive: false,
        tag: findFan['fan_running_1']['tag'],
        storeId: dataSource.currentStoreId,
        floor: dataSource.selectFloor,
        value: findFan['fan_running_1']['value'] === '1',
        title: findFan['fan_running_1']['name'],
        openText: findFan['fan_running_1']['val_map'][1],
        closeText: findFan['fan_running_1']['val_map'][0],
      }
      newFanList.push(fanRunningData);
    }
    console.log('newFanList--newFanList',newFanList)
    setDataSource(
      produce((draft) => {
        draft.FanData = newFanList;
      }),
    );
  }
  /**
   * 点击图标打开卡片
   * @param planeImgDevice
   */
  const handleOpenDevice = (planeImgDevice: PlaneImgDevice) => {
    // console.log('打开设备', planeImgDevice);
    setDataSource(
      produce((draft) => {
        draft.selectDeviceId = planeImgDevice.deviceId;
      }),
    );
    if (planeImgDevice.deviceType === 'iaq') {
      getIAQData(planeImgDevice);
      setDataSource(
        produce((draft: any) => {
          draft.showModelType = ModelTypeEnum.IAQ;
        }),
      );
      return;
    }
    if (planeImgDevice.deviceType === 'tank') {
      getTankData(planeImgDevice);
      setDataSource(
        produce((draft: any) => {
          draft.showModelType = ModelTypeEnum.Tank;
        }),
      );
      return;
    }
    if(planeImgDevice.deviceType === 'fan'){
      getFanData(planeImgDevice);
      setDataSource(
        produce((draft: any) => {
          draft.showModelType = ModelTypeEnum.FAN;
        }),
      );
      return;
    }
    //机组数据
    let groupsData: any[] = [];
    if (planeImgDevice.groupId !== '0') {
      groupsData = filter(dataSource.originMqttData.acList, { group_id: planeImgDevice.groupId });
    }
    // console.log('机组数据',groupsData);
    //是否是机组
    const isGroup: boolean =
      some(groupsData, { device_type: 'ahu' }) && some(groupsData, { device_type: 'vrv' });
    // 单台机器的数据
    const alonesData = find(dataSource.originMqttData.acList, {
      device_id: planeImgDevice.deviceId,
    });
    // console.log('单台机器的数据', alonesData);
    if (isGroup) {
      let ahuAloneData: AloneData;
      let vrvAloneData: AloneData;
      groupsData?.forEach((device) => {
        if (device?.device_type === 'ahu') {
          // console.log('ahu---ahu--ahu',device)
          const ahuItem: PlaneImgDevice = {
            x: planeImgDevice.x,
            y: planeImgDevice.y,
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
            x: planeImgDevice.x,
            y: planeImgDevice.y,
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
      setDataSource(
        produce((draft) => {
          draft.detailBoxData.type = ShowBoxType.Group;
          draft.detailBoxData.groupsData = {
            ahu: ahuAloneData,
            vrv: vrvAloneData,
          };
        }),
      );
    } else {
      const aloneData: AloneData = getAloneData(planeImgDevice, alonesData);
      setDataSource(
        produce((draft) => {
          draft.detailBoxData.type = ShowBoxType.Alone;
          draft.detailBoxData.aloneData = aloneData;
        }),
      );
    }
  };
  /**
   * 备份数据
   * @param acList
   */
  const saveAcList = (acList: any[]) => {
    // console.log('acList--acList--acList',acList)
    let newAcList: any[] = [];
    // let newAcName = [];
    for (const item of Object.keys(acList)) {
      // @ts-ignore
      newAcList.push(acList[item]);
      // @ts-ignore
      // newAcName.push(item)
    }
    // console.log('newAcName--newAcName',newAcName)
    setDataSource(
      produce((draft) => {
        draft.originMqttData.acList = newAcList;
      }),
    );
    // console.log('保存数据Ac_List success', newAcList);
    return newAcList;
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
   * 设备卡片详情
   * @param arg
   */
  const handleOnViewDevice = (arg: ClickViewMachineData) => {
    if (
      arg.deviceType === '' ||
      arg.deviceIdList.length === 0 ||
      isEmpty(dataSource.originMqttData.acList)
    )
      return;

    refData.current.clickViewMachineData = arg;
    const storeId: number = dataSource.currentStoreId;
    const floor: string = dataSource.selectFloor;

    if (arg.deviceType === 'fcu') {
      const findFcu = find(dataSource.originMqttData.acList, { device_id: arg.deviceIdList[0] });
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
      setDataSource(
        produce((draft: any) => {
          draft.showModelType = ModelTypeEnum.FCU;
          draft.FCUData.deviceName = deviceName;
          draft.FCUData.storeId = storeId;
          draft.FCUData.floor = floor;
          draft.FCUData.switchBarList = newSwitchBarList;
          draft.FCUData.mixinBarList = newMixinBarList;
          draft.FCUData.machineChassis = machineChassis;
        }),
      );
    }

    // AHU数据
    if (arg.deviceType === 'ahu') {
      const findAhu = find(dataSource.originMqttData.acList, { device_id: arg.deviceIdList[0] });

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
        if (item === '制热' && index.toString() === findAhu?.cooling_heating?.value.toString()) {
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
      setDataSource(
        produce((draft) => {
          // @ts-ignore
          draft.showModelType = ModelTypeEnum.AHU;
          draft.AHUData.deviceName = deviceName;
          draft.AHUData.storeId = storeId;
          draft.AHUData.floor = floor;
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
        }),
      );
      console.log(
        '00--00',
        getAhuAssembleData(findAhu, 'single', undefined).switchBarList,
        '11--11',
        getAhuAssembleData(findAhu, 'single', undefined).mixinBarList,
      );
    }

    // VRV数据
    if (arg.deviceType === 'vrv') {
      const findVrv = find(dataSource.originMqttData.acList, { device_id: arg.deviceIdList[0] });

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
        formatVal: findVrv?.wind_return_temperature?.formatVal ?? '',
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

      setDataSource(
        produce((draft: any) => {
          draft.showModelType = ModelTypeEnum.VRV;
          draft.VRVData.deviceName = deviceName;
          draft.VRVData.storeId = storeId;
          draft.VRVData.floor = floor;
          draft.VRVData.switchBarList = newSwitchBarList;
          draft.VRVData.mixinBarList = newMixinBarList;
          draft.VRVData.machineChassis = machineChassis;
        }),
      );
    }

    // AHU VRV 组合数据
    if (arg.deviceType === 'group') {
      if (arg.deviceIdList.length < 2) return;

      const findAhu = find(dataSource.originMqttData.acList, { device_id: arg.deviceIdList[0] });
      const findVrv = find(dataSource.originMqttData.acList, { device_id: arg.deviceIdList[1] });
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

      setDataSource(
        produce((draft) => {
          draft.showModelType = ModelTypeEnum.AV;
          draft.GroupData.ahuDeviceName = ahuDeviceName;
          draft.GroupData.vrvDeviceName = vrvDeviceName;
          draft.GroupData.storeId = storeId;
          draft.GroupData.floor = floor;
          draft.GroupData.switchBarList = getAhuAssembleData(
            findAhu,
            'group',
            findVrv,
          ).switchBarList;
          draft.GroupData.mixinBarList = getAhuAssembleData(findAhu, 'group', findVrv).mixinBarList;
          draft.GroupData.machineChassis = machineChassis;
        }),
      );
    }
  };

  // 实时刷新当前页面上点击显示的弹框、模态框
  const realTimeUpdate = (currentAcList: any[]) => {
    // 更新当前详情框
    if (dataSource.detailBoxData.showDetailBox && dataSource.selectDeviceId) {
      const item = find(currentAcList, { device_id: dataSource.selectDeviceId });

      if (!isEmpty(item)) {
        const updateItem: PlanImgDevice = {
          x:
            getPointPosition(item?.device_location, dataSource.planeImgShapeData.beta).px -
            MachineControlConfig.deviceCommonIconWidth / 2,
          y:
            getPointPosition(item?.device_location, dataSource.planeImgShapeData.beta).py -
            MachineControlConfig.deviceCommonIconHeight / 2,
          area: '', // 先不计算
          deviceLocation: item?.device_location,
          devicePosition: item?.device_position,
          deviceName: item?.device_name,
          deviceType: item?.device_type,
          deviceStatus: getDeviceStatus(item?.device_type, item),
          deviceId: item?.device_id,
          groupId: item?.group_id,
        };

        handleOpenDevice(updateItem);
      }
    }

    // 更新当前灯光
    if (refData.current.showModelType === ModelTypeEnum.LightingOperation) {
      // 直接调用即可
      getLightData(currentAcList);
      console.log('灯光在线，持续更新');
    }

    // 更新当前电量
    if (refData.current.showModelType === ModelTypeEnum.PowerData) {
      console.log('电量正在更新');
      getPowerData(currentAcList);
    }

    // 更新设备
    if (
      refData.current.clickViewMachineData.deviceType !== '' &&
      refData.current.clickViewMachineData.deviceIdList.length > 0
    ) {
      handleOnViewDevice(refData.current.clickViewMachineData);
      console.log('设备持续更新..');
    }
  };
  //清除计时器
  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      console.log('Timer cleared');
    }
  };
  //获取设备状态 online disconnect
  const getDeviceState = (status: any) => {
    // console.log('status--status',status)
    setDataSource(
      produce((draft: any) => {
        draft.connect_status = status.includes('online');
      }),
    );
    // clearTimer();
  };
  //获取最后在线时间
  const getLastConnectTime = (time: any) => {
    setDataSource(
      produce((draft: any) => {
        draft.last_connect_time = time;
      }),
    );
  };
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
   * 请求数据
   * @param floor
   * @param beta
   */
  const getDataSource = async (floor: string, beta: number) => {
    const res = await getMachineInfo({
      floor: floor,
      store_id: 1775,
    });
    console.log('页面数据', res.data);

    getWarningList(res.data[floor].warning);

    const currentAcList = saveAcList(res.data[floor].ac_list);
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

    realTimeUpdate(currentAcList);

    /**
     * 设备状态
     */
    getDeviceState(res.data[floor].connect_status);
    /**
     * 最后离线时间
     */
    getLastConnectTime(res.data[floor].last_connect_time);
  };

  const getBaseData = async (floor: string) => {
    const res = await getMachineInfo({
      floor: floor,
      store_id: 1193,
    });
    //system
    const newBaseData = formatDataSource(res.data[floor].params);
    // console.log('newBaseData--newBaseData--0369', newBaseData);
    baseDataSource.cardData.data = newBaseData?.map((item: any) => {
      return [dayjs(`${item.timeValue[0]}`, 'HH:mm'), dayjs(`${item.timeValue[1]}`, 'HH:mm')];
    });
    baseDataSource.cardData.title = newBaseData?.map((item: any) => {
      return item.title;
    });
    baseDataSource.cardData.type = newBaseData?.map((item: any) => {
      return item.tag;
    });
    baseDataSource.cardData.storeId = newBaseData?.map((item: any) => {
      return item.storeId;
    });
    baseDataSource.cardData.floor = newBaseData?.map((item: any) => {
      return item.floor;
    });
    baseDataSource.cardData.machine = newBaseData?.map((item: any) => {
      return item.deviceName;
    });
    const data = [...baseDataSource.cardData.data];
    //lighting
    const lightingData = getLightData(res.data[floor].ac_list);
    // console.log('lightingData--lightingData--0927', lightingData);
    baseDataSource.lightingData.data = lightingData?.map((item: any) => {
      return [
        dayjs(`${item.lightRangeTimeValue[0]}`, 'HH:mm'),
        dayjs(`${item.lightRangeTimeValue[1]}`, 'HH:mm'),
      ];
    });
    baseDataSource.lightingData.type = lightingData?.map((item: any) => {
      return item.tag;
    });
    baseDataSource.lightingData.storeId = lightingData?.map((item: any) => {
      return item.storeId;
    });
    baseDataSource.lightingData.floor = lightingData?.map((item: any) => {
      return item.floor;
    });
    baseDataSource.lightingData.machine = lightingData?.map((item: any) => {
      return item.deviceName;
    });
    const lightingDataList = [...baseDataSource.lightingData.data];
    setBaseData((prevState: any) =>
      produce(prevState, (draftState: any) => {
        if (!isEmpty(pathRefs.current)) {
          for (const item in pathRefs.current) {
            if (!has(pathRefs.current, item)) {
              continue;
            }

            const newData = handleMergeStatesByPath(item, prevState, baseDataSource);
            // console.log('newData--newData--newData', newData, item, prevState, baseDataSource);
            draftState.cardData = { ...newData.cardData };
            draftState.lightingData = { ...newData.lightingData };
          }

          return;
        }
        draftState.cardData.data = data;
        draftState.lightingData.data = lightingDataList;
      }),
    );
  };

  /**
   * open model
   * @param modelType
   */
  const handleOnOpenModel = (modelType: any) => {
    refData.current.showModelType = modelType;
    setDataSource(
      produce((draft: any) => {
        draft.showModelType = modelType;
      }),
    );
  };

  const handleOnValueChange = (value: ValueChangeFlowData) => {
    console.log('onChangeValue---onChangeValue', value);
    if (value.model === ModelTypeEnum.EnergySaving) {
    }
    // 系统参数
    if (value.model === ModelTypeEnum.SystemParameters_AirValves) {
      setDataSource(
        produce((draft) => {
          const airValveList = draft.settings.systemParameters.airValveList as any;
          if (!airValveList[value.index]) return;
          airValveList[value.index].isActive = true;
          airValveList[value.index][value.key] = value.value;
        }),
      );
    }
    if (value.model === ModelTypeEnum.SystemParameters_OverTime) {
      setDataSource(
        produce((draft) => {
          const overTimeList = draft.settings.systemParameters.overTimeData as any;
          if (!overTimeList[value.index]) return;
          overTimeList.isActive = true;
          overTimeList[value.key] = value.value;
        }),
      );
    }
    if (value.model === ModelTypeEnum.SystemParameters_MachineStartTime) {
      setDataSource(
        produce((draft: any) => {
          draft.settings.systemParameters.machineStartTimeList[value.index].isActive = true;
          draft.settings.systemParameters.machineStartTimeList[value.index][value.key] =
            value.value;
        }),
      );
    }
    // 电量
    if (value.model === ModelTypeEnum.PowerData) {
      setDataSource(
        produce((draft: any) => {
          draft.settings.powerData[value.key] = value.value;
        }),
      );

      //图表数据
      const newData = dataSource.settings.powerData;
      const params = {
        shop_id: dataSource.currentStoreId,
        day: newData.selectWeekValue,
        tag: newData.dbDataList[newData.selectDBMachineIndex].dataList[newData.selectDBDataIndex]
          .name,
        group: newData.dbDataList[newData.selectDBMachineIndex].deviceName,
      };
      if (value.key === 'selectDBMachineIndex') {
        params.group = newData.dbDataList[value.value].deviceName;
      }
      if (value.key === 'selectDBDataIndex') {
        params.tag = newData.dbDataList[newData.selectDBMachineIndex].dataList[value.value].name;
      }
      if (value.key === 'selectWeekValue') {
        params.day = value.value;
      }
      getChartData(params, ModelTypeEnum.PowerData).catch(console.log);
    }
    // 灯光
    if (value.model === ModelTypeEnum.LightingOperation) {
      // OnChange(value.key, value.value);
      // lock(path,isBegin,type,value)
    }
    if (value.model === ModelTypeEnum.IAQ) {
      setDataSource(
        produce((draft) => {
          // @ts-ignore
          draft.IAQData[value.key] = value.value;
        }),
      );

      // 请求图表数据
      let params = {
        shop_id: dataSource.currentStoreId,
        group: dataSource.IAQData.deviceName,
        tag: dataSource.IAQData.dataInfoList[dataSource.IAQData.selectDataInfoIndex].name,
        day: dataSource.IAQData.selectWeekValue,
      };

      if (value.key === 'selectDataInfoIndex') {
        params.tag = dataSource.IAQData.dataInfoList[value.value]?.name;

        // 更新峰值
        setDataSource(
          produce((draft) => {
            draft.IAQData.numericalValueList = getNumericalValue(
              draft.IAQData.dataInfoList[value.value]?.standard,
              draft.IAQData.dataInfoList[value.value]?.unit,
            );
          }),
        );
      }

      if (value.key === 'selectWeekValue') {
        params.day = value.value;
      }

      getChartData(params, ModelTypeEnum.IAQ).then(console.log);
    }
    if (value.model === ModelTypeEnum.Tank) {
      setDataSource(
        produce((draft) => {
          draft.TankData.tankControlList[value.index].isActive = true;
          draft.TankData.tankControlList[value.index][value.key] = value.value;
        }),
      );
    }
    if (value.model === ModelTypeEnum.FCU) {
      const keySplit: string[] = value.key.split('-');
      console.log('ModelTypeEnum.FCU', value, 'isActive'.split('-')[0]);
      if (keySplit.length !== 2) return;

      setDataSource(
        produce((draft) => {
          draft.FCUData[keySplit[0]][value.index].isActive = true;
          draft.FCUData[keySplit[0]][value.index][keySplit[1]] = value.value;
        }),
      );
    }
    if (value.model === ModelTypeEnum.AHU) {
      // 拆分key
      const keySplit: string[] = value.key.split('-');

      if (keySplit.length !== 2) return;

      console.log('keySplit', keySplit);

      setDataSource(
        produce((draft) => {
          draft.AHUData[keySplit[0]][value.index].isActive = true;
          draft.AHUData[keySplit[0]][value.index][keySplit[1]] = value.value;
        }),
      );
    }
    if (value.model === ModelTypeEnum.VRV) {
      // 拆分key
      const keySplit: string[] = value.key.split('-');

      if (keySplit.length !== 2) return;

      console.log('keySplit', keySplit);

      setDataSource(
        produce((draft) => {
          draft.VRVData[keySplit[0]][value.index].isActive = true;
          draft.VRVData[keySplit[0]][value.index][keySplit[1]] = value.value;
        }),
      );
    }
  };

  //初始化数据
  const initData = async (currentFloor: string) => {
    console.log('currentFloor--currentFloor', currentFloor);
    try {
      const beta = await getPlaneImgData();
      // console.log('换算系数', beta);
      if (currentFloor) {
        await getDataSource(currentFloor, beta);
        // await getBaseData(currentFloor);
        timer.current = setInterval(async () => {
          await getDataSource(currentFloor, beta);
          // await  getBaseData(currentFloor).catch(console.log);
        }, 100000);
      } else {
        console.log('请先选择楼层');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //楼层切换
  const switchFloor = (floor: string) => {
    const getImagePathForFloor = (floor: string): string | undefined => {
      const foundOption: any = find(dataSource.floorOptions, { value: floor });
      return foundOption?.img;
    };
    getImagePathForFloor(floor);
    // console.log('当前楼层','selectFloor:',floor,'planImgSource:',getImagePathForFloor(floor))
    setDataSource(
      produce((draft: any) => {
        draft.selectFloor = floor;
        draft.planeImgShapeData.planImgSource = getImagePathForFloor(floor);
      }),
    );
    // clearTimer();

    // initData(floor).then(console.log);
  };
  //获取楼层options
  const getFloorOptions = async () => {
    try {
      const res = await getFloorsData({ store_id: dataSource.currentStoreId });
      if (res.success) {
        console.log('get floor options success', res.data);
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
        console.log('楼层信息', newOptions);
        setDataSource(
          produce((draft: any) => {
            draft.floorOptions = newOptions;
            draft.selectFloor = newOptions[0]?.value;
            draft.planeImgShapeData.beta = newOptions[0]?.beta;
            draft.planeImgShapeData.imageW = newOptions[0]?.width;
            draft.planeImgShapeData.imageH = newOptions[0]?.height;
            draft.planeImgShapeData.planImgSource = newOptions[0]?.img;
          }),
        );
      }
    } catch (error) {
      console.log('get floor options error', error);
    }
  };

  // 数据变更方法
  const handleOnChange = (type: ClickEnum, value: any) => {
    // console.log('handleOnChange', type, value);
    if (type === ClickEnum.onOpenModel) {
      console.log('打开模型', value);
      handleOnOpenModel(value);
    }

    if (type === ClickEnum.onCloseModel) {
      setDataSource(
        produce((draft: any) => {
          draft.showModelType = null;
        }),
      );
      refData.current.showModelType = null;
      refData.current.clickViewMachineData.deviceType = '';
      refData.current.clickViewMachineData.deviceIdList = [];
    }

    if (type === ClickEnum.onValueChange) {
      handleOnValueChange(value);
    }

    if (type === ClickEnum.onSwitchFloor) {
      switchFloor(value);
    }

    if (type === ClickEnum.onOpenDevice) {
      console.log('打开设备', value);
      handleOpenDevice(value);
    }
    if (type === ClickEnum.onCloseDevice) {
      console.log('关闭设备', value);
      setDataSource(
        produce((draft: any) => {
          draft.detailBoxData.showDetailBox = false;
          draft.selectDeviceId = null;
        }),
      );
    }
    if (type === ClickEnum.onViewDevice) {
      console.log('打开设备视图', value);
      handleOnViewDevice(value as ClickViewMachineData);
    }
  };

  useEffect(() => {
    console.log('dataSource.selectFloor--dataSource.selectFloor',dataSource)
    getFloorOptions()
    initData('1F').then(console.log);
    // getBaseData(dataSource.selectFloor);
    // timer.current = setInterval(async () => {
    //   // await getBaseData(dataSource.selectFloor);
    //   await getFloorOptions();
    // }, 10000);
    return () => {
      clearTimer();
    };
  }, []);
  return {
    baseData,
    dataSource,
    handleOnChange,
    OnChange,
    lock,
    handleFullValueChange,
  };
};
