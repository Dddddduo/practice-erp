import React from 'react';
import { i18nGlobalKey } from '@/utils/utils';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import LightTimePicker from '@/pages/Project/MachineControl/components/LightingOperation/LightTimePicker';
import { ClickEnum, LightData , ModelTypeEnum } from '@/viewModel/Project/useMachineControl';

interface Props {
  lightData: LightData;
  index: number;
  handleOnChange: (path: string, value: any) => void;
}

const LightCard: React.FC<Props> = ({
  lightData,
  index,
  handleOnChange,
}) => {
  return (
    <div className={'border-2 border-gray-200 rounded-2xl p-2 w-[300px]'}>
      <div className={'flex justify-between mb-4'}>
        <div className={'text-title font-bold'}>{i18nGlobalKey(lightData?.deviceName ?? '')}</div>
        <NewSwitch
          value={lightData.lightOpenValue}
          valueKey={'lightOpenValue'}
          onChange={handleOnChange}
          httpParams={{
            type: lightData.lightOpenTag,
            machine: lightData.deviceName ?? '',
            floor: lightData.floor,
            store_id: lightData.storeId,
          }}
          openText={i18nGlobalKey('开')}
          closeText={i18nGlobalKey('关')}
        />
      </div>
      <div className={'flex justify-between mb-4'}>
        <div>{i18nGlobalKey('启停模式')}</div>
        <NewSwitch
          value={lightData.autoHandValue}
          valueKey={'autoHandValue'}
          onChange={handleOnChange}
          httpParams={{
            type: lightData.autoHandTag,
            machine: lightData.deviceName ?? '',
            floor: lightData.floor,
            store_id: lightData.storeId,
          }}
          openText={i18nGlobalKey(lightData.autoHandValMap[1])}
          closeText={i18nGlobalKey(lightData.autoHandValMap[0])}
        />
      </div>
      <div className={'flex justify-between'}>
        <div>{i18nGlobalKey('开关时间')}</div>
        <LightTimePicker
          index={index}
          value={lightData.lightRangeTimeValue}
          valueKey={'lightRangeTimeValue'}
          httpParams={{
            type: lightData.lightRangeTimeTag,
            machine: lightData.deviceName ?? '',
            floor: lightData.floor,
            store_id: lightData.storeId,
          }}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export default LightCard;
