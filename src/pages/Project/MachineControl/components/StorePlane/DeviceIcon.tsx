import React from 'react';
import  MachineControlConfig  from '@/configs/machine_control';
import { getDifferentIcon } from '@/utils/machine_control_service';
interface Props {
  deviceType: string,
  deviceStatus: string
}
const DeviceIcon: React.FC<Props> = (props) => {
  const { deviceType, deviceStatus } = props;
  return (
    <img
      style={{
        width: MachineControlConfig.deviceCommonIconWidth,
        height: MachineControlConfig.deviceCommonIconHeight,
        cursor: 'pointer',
      }}
      src={getDifferentIcon(deviceType, deviceStatus)}
      alt={'DeviceIcon'}
    />
  )
};
export default DeviceIcon;
