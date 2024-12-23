import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import { AirValveData, ClickEnum, ModelTypeEnum } from '@/viewModel/Project/useMachineControl';
import React from 'react';
import { i18nGlobalKey } from '@/utils/utils';

interface Props {
  windSpeedList: string[]; // 风速列表
  airValveList: AirValveData[]; // 新风阀操作列表
  handleOnChange: (path: string, value: any) => void;
}

const NewWind: React.FC<Props> = ({ windSpeedList, airValveList, handleOnChange }) => {
  return (
    <div className={'flex justify-between'}>
      <div>
        {windSpeedList.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>

      <div>
        {airValveList.map((item, index) => {
          return (
            <div key={index}>
              <NewSwitch
                value={item.openValue}
                valueKey={'airValveList'}
                onChange={handleOnChange}
                httpParams={{
                  type: item.tag,
                  machine: item.deviceName ?? '',
                  floor: item.floor,
                  store_id: item.storeId,
                }}
                openText={i18nGlobalKey(item.valMap[1])}
                closeText={i18nGlobalKey(item.valMap[0])}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewWind;
