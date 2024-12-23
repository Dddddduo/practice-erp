import MachineControlConfig from "@/configs/machine_control";

// 获取设备状态的图标
export const getDifferentIcon = (deviceType: string, status: string): string => {
  let iconPath: string = MachineControlConfig.run_icon // 默认值

  if (deviceType === 'iaq') {
    if (status === '优') {
      iconPath = MachineControlConfig.pm25_excellent_icon;
    }
    if (status === '良') {
      iconPath = MachineControlConfig.pm25_good_icon;
    }
    if (status === '差') {
      iconPath = MachineControlConfig.pm25_poor_icon;
    }
  }

  if (deviceType === 'tank') {
    iconPath = MachineControlConfig.water_tank_icon;
  }
  if(deviceType === 'fan'){
    iconPath = MachineControlConfig.fan
  }

  if (['vrv', 'ahu', 'fcu'].includes(deviceType)) {
    if (status === 'water_lacking') {
      iconPath = MachineControlConfig.water_leak_icon;
    } else if (status === 'warning') {
      iconPath = MachineControlConfig.warning_icon;
    } else if (status === 'stop') {
      iconPath = MachineControlConfig.stop_icon;
    } else if (status === 'running') {
      iconPath = MachineControlConfig.run_icon;
    }
  }

  if(deviceType === 'offline'){
    iconPath = MachineControlConfig.dev_offline_icon
  }

  return iconPath;
}

// 获取设备的状态
export const getDeviceStatus = (deviceType: string, deviceData: any): string => {
  let status: string = ''

  if (deviceType === 'iaq') {
    console.log('deviceData--deviceData--999',deviceData)
    status = deviceData['状态']['value']
  }
  // if(deviceType === 'fan'){
  //   console.log('deviceData--deviceData--666',deviceData)
  //   status = deviceData['room_temperature_1']['value']
  // }

  if (['vrv', 'ahu', 'fcu','fan'].includes(deviceType)) {

    if (deviceData['status']['warning'] === 'water_lacking') {
      status = 'water_lacking'
    } else if (deviceData['status']['warning'] === 'warning') {
      status = 'warning'
    } else if (deviceData['status']['desc'] === 'stop') {
      status = 'stop'
    } else if (deviceData['status']['desc'] === 'running') {
      status = 'running'
    }
  }

  return status;
}

// 坐标转化
export const getPointPosition = (locationJson: any, beta: any) => {
  const positionList = JSON.parse(locationJson)

  let sumX = 0;
  let sumY = 0;

  positionList.forEach(item => {
    sumX += item[0];
    sumY += item[1];
  });

  let avgX = sumX / positionList.length;
  let avgY = sumY / positionList.length;

  return {
    px: avgX / beta,
    py: avgY / beta,
  }
}

// 异步转换成同步获取一张图片信息
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

// Option类型
export interface Option {
  label: string,
  value: string,
}

export interface ComponentChangeValue {
  key: string,
  value: any,
}

