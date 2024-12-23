import React from 'react';
import {
  FcuData,
  ClickEnum,
  ModelTypeEnum,
  FieldType,
} from '@/viewModel/Project/useMachineControl';
import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import NewSelect from '@/pages/Project/MachineControl/components/Select';
import DevicePlane from '@/pages/Project/MachineControl/components/StorePlane/DevicePlane';

interface Props {
  fcuData: FcuData;
  handleOnChange: (path: string, value: any) => void;
}

const FcuDetail: React.FC<Props> = (props) => {
  const { fcuData, handleOnChange } = props;
  // console.log('fcu--fcu--fcu====',fcuData)
  return (
    <>
      {/*启停模式 开关*/}
      <div className={'flex mb-4 flex-wrap gap-3'}>
        {fcuData.switchBarList.map((item, index) => (
          <BlockCard key={index} title={item.title} >
            <NewSwitch
              value={item.value}
              valueKey={'switchBarList'}
              //  dataSource:mapdevicelist:8:smallboxdisplay
              //  dataSource:mapdevicelist:8:ahumodule__lock__needhttp
              //  dataSource:mapdevicelist:8:devicename
              onChange={(arg:any) => {
                handleOnChange('FCUData', {
                  key: arg.key,
                  value: arg.value,
                });
              }}
              httpParams={{
                type: item.tag,
                machine: fcuData.deviceName ?? '',
                floor: fcuData.floor,
                store_id: fcuData.storeId,
              }}
            />
          </BlockCard>
        ))}
      </div>
      {/* 风速 模式*/}
      <div className={'flex mb-4 flex-wrap gap-3'} >
        {fcuData.mixinBarList.map((item, index) => {
          if (item.fieldType === FieldType.Select) {
            return (
              <BlockCard key={index} title={item.title}>
                <NewSelect
                  value={item.value}
                  valueKey={'mixinBarList-value'}
                  onChange={(arg:any) => {
                    handleOnChange('FCUData', {
                      model: ModelTypeEnum.FCU,
                      index: index,
                      key: arg.key,
                      value: arg.value,
                    });
                  }}
                  // @ts-ignore
                  options={item.options ?? []}
                  httpParams={{
                    type: item.tag,
                    machine: fcuData.deviceName,
                    floor: fcuData.floor,
                    store_id: fcuData.storeId,
                  }}
                />
              </BlockCard>
            );
          }

          return <></>;
        })}
      </div>
      {/* 平面示意图 */}
      <DevicePlane
        deviceName={fcuData.deviceName}
        fanAnimationDuration={fcuData.machineChassis.fanAnimationDuration}
        fanImagePath={fcuData.machineChassis.fanImagePath}
        fcuStatus={fcuData.machineChassis.fcuStatus}
        temperature={{
          title: fcuData.machineChassis.temperatureTitle,
          value: fcuData.machineChassis.temperatureValue,
          valueKey: 'temperature-value',
          unit: fcuData.machineChassis.temperatureUnit,
          tag: fcuData.machineChassis.temperatureTag,
          deviceName: fcuData.deviceName,
          floor: fcuData.floor,
          storeId: fcuData.storeId,
        }}
        windTemperature={`${fcuData.machineChassis.windTemperatureTitle}: ${fcuData.machineChassis.windTemperatureFormatVal}`}
        onSetTemperatureChange={
          (arg:any) => {
            handleOnChange('FCUData', {
              model: ModelTypeEnum.FCU,
              index: 0,
              key: arg.key,
              value: arg.value,
            })
          }
        }
        deviceType={fcuData.machineChassis.deviceType}
        waterPipeList={fcuData.machineChassis.waterPipeList}
      />
    </>
  );
};
export default FcuDetail;
