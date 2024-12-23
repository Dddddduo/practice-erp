import React from 'react';
import { PlaneImgDevice } from '@/viewModel/Project/useMachineControl';
import DeviceIcon from '@/pages/Project/MachineControl/components/StorePlane/DeviceIcon';
import Popover from '@/pages/Project/MachineControl/components/StorePlane/Popover';
import MachineControlData from '@/configs/machine_control';

interface Props {
  planeImgDevice: PlaneImgDevice;
 handleOnChange: () => void;
  status:boolean
}

const DevicePoint: React.FC<Props> = (props) => {
  const { planeImgDevice, handleOnChange ,status } = props;
  // console.log('planeImgDevice---0', planeImgDevice);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentW, setContentW] = React.useState(0);
  React.useEffect(() => {
    if (contentRef?.current) {
      setContentW(contentRef?.current?.scrollWidth ?? 0);
    }
  }, [contentRef?.current]);

  const getPopoverPosition = () => {
    let direction = 'bottom';
    let px = 0;
    let py = 0;

    if (planeImgDevice?.devicePosition === 'up') {
      direction = 'bottom';
      px = contentW > 0 ? -((contentW - MachineControlData.deviceCommonIconWidth) / 2) : 0; // 计算公式：-（（气泡宽度 - 图标宽度） / 2 ）
      py = -(MachineControlData.deviceCommonIconWidth + 10);
    } else if (planeImgDevice?.devicePosition === 'down') {
      direction = 'top';
      px = contentW > 0 ? -((contentW - MachineControlData.deviceCommonIconWidth) / 2) : 0;
      py = MachineControlData.deviceCommonIconHeight;
    } else if (planeImgDevice?.devicePosition === 'left') {
      direction = 'right';
      px = -MachineControlData.deviceCommonIconWidth;
      py = 0;
    } else {
      direction = 'left';
      px = MachineControlData.deviceCommonIconWidth;
      py = 0;
    }

    return {
      px: px,
      py: py,
      direction: direction,
    };
  };
  return (
    <div className={'relative flex flex-col justify-center items-center'}>
      <div onClick={handleOnChange}>
        <DeviceIcon
          deviceStatus={planeImgDevice.deviceStatus}
          deviceType={status ? planeImgDevice.deviceType : 'offline'}
        />
        <div
          style={{
            position: 'absolute',
            left: getPopoverPosition().px,
            top: getPopoverPosition().py,
          }}
        >
          <Popover
            content={planeImgDevice.deviceName}
            contentRef={contentRef}
            direction={getPopoverPosition().direction}
            backgroundColor={'black'}
            textColor={'white'}
            minWidth={10}
            borderRadius={6}
            arrowSizes={10}
            height={40}
            maxWidth={500}
          />
        </div>
      </div>
    </div>
  );
};
export default DevicePoint;
