import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { AloneData, ShowBoxType } from '@/viewModel/Project/useMachineControl';
import DeviceCardItem from '@/pages/Project/MachineControl/components/StorePlane/DeviceCardItem';

interface GroupMap {
  ahu: AloneData;
  vrv: AloneData;
}

interface Props {
  type: ShowBoxType;
  aloneData?: AloneData;
  groupData?: GroupMap;
  onClick: (arg: any) => void;
  onClose: () => void;
}

// @ts-ignore
const DeviceCard: React.FC<Props> = (props) => {
  const { type, aloneData, groupData, onClick, onClose } = props;
  /* 关闭按钮 */
  const closeBtn = () => {
    return (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#EEEEEF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: -5,
          right: -5,
        }}
        onClick={onClose}
      >
        <CloseOutlined style={{ fontSize: 12, cursor: 'pointer' }} />
      </div>
    );
  };
  /* 单设备 */
  if (type === ShowBoxType.Alone) {
    // console.log('单设备--单设备',aloneData)
    return (
      <div className={'absolute bg-white p-2 rounded-2xl shadow-xl'}>
        <DeviceCardItem
          // @ts-ignore
          data={aloneData}
          onClick={() => {
            onClick({
              deviceType: aloneData?.deviceType ?? '',
              deviceIdList: [aloneData?.deviceId ?? 0],
              deviceName:aloneData?.deviceName ?? ''
            });
          }}
        />
        {closeBtn()}
      </div>
    );
  }
  /* 组设备 */
  if (type === ShowBoxType.Group) {
    return (
      <div className={'absolute bg-white p-2 rounded-2xl flex shadow-xl'}>
        <div className={'mr-2'}>
          <DeviceCardItem
            // @ts-ignore
            data={groupData?.ahu}
            onClick={() => {
              onClick({
                deviceType: 'group' ?? '',
                deviceIdList: [groupData?.ahu?.deviceId ?? 0, groupData?.vrv?.deviceId ?? 0],
                deviceName:groupData?.ahu?.deviceName ?? ''
              });
            }}
          />
        </div>
        <DeviceCardItem
          // @ts-ignore
          data={groupData?.vrv}
          onClick={() => {
            onClick({
              deviceType: 'group' ?? '',
              deviceIdList: [groupData?.ahu?.deviceId ?? 0, groupData?.vrv?.deviceId ?? 0],
              deviceName:groupData?.vrv?.deviceName ?? ''
            });
          }}
        />
        {closeBtn()}
      </div>
    );
  }
};

export default DeviceCard;
