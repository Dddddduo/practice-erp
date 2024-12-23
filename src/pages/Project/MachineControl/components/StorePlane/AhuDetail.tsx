import React from 'react';
import { AhuData, ClickEnum , ModelTypeEnum , FieldType } from '@/viewModel/Project/useMachineControl';
import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import NewSelect from '@/pages/Project/MachineControl/components/Select';
import ModelInput from '@/pages/Project/MachineControl/components/ModelInput';
import DevicePlane from '@/pages/Project/MachineControl/components/StorePlane/DevicePlane';
interface Props {
  ahuData: AhuData;
  handleOnChange: (path: string, value: any) => void;
}

const AhuDetail: React.FC<Props> = (props) => {
  const { ahuData, handleOnChange } = props;
  return (
    <>
      {/* AHU模式 工变频切换 启停模式 开关机 */}
      <div className={'flex flex-wrap'}>
        {ahuData.switchBarList.map((item, index) => (
          <BlockCard key={index} title={item.title} style={{ marginRight: 12 ,marginBottom:12}}>
            <NewSwitch
              value={item.value}
              valueKey={'switchBarList-value'}
              onChange={(arg:any) => {
                handleOnChange('AHUData', {
                  model: ModelTypeEnum.AHU,
                  index: index,
                  key: arg.key,
                  value: arg.value,
                });
              }}
              httpParams={{
                type: item.tag,
                machine: ahuData.deviceName ?? '',
                floor: ahuData.floor,
                store_id: ahuData.storeId,
              }}
            />
          </BlockCard>
        ))}
      </div>

      <div className={'flex mb-4 flex-wrap '} style={{ width: 800, gap: 12 }}>
        {ahuData.mixinBarList.map((item, index) => {
          //设置高、中、低速
          if (item.fieldType === FieldType.Input) {
            return (
              <BlockCard key={index} title={item.title}>
                <ModelInput
                  value={item.value}
                  valueKey={'mixinBarList-value'}
                  unit={item.unit ?? ''}
                  rule={[]}
                  onChange={(arg: any) => {
                    handleOnChange('AHUData', {
                      model: ModelTypeEnum.AHU,
                      index: index,
                      key: arg.key,
                      value: arg.value,
                    });
                  }}
                  httpParams={{
                    type: item.tag,
                    machine: ahuData.deviceName,
                    floor: ahuData.floor,
                    store_id: ahuData.storeId,
                  }}
                />
              </BlockCard>
            );
          }
          //风速
          if (item.fieldType === FieldType.Select) {
            return (
              <BlockCard key={index} title={item.title}>
                <NewSelect
                  value={item.value}
                  valueKey={'mixinBarList-value'}
                  onChange={(arg:any) => {
                    handleOnChange('AHUData', {
                      model: ModelTypeEnum.AHU,
                      index: index,
                      key: arg.key,
                      value: arg.value,
                    });
                  }}
                  // @ts-ignore
                  options={item.options ?? []}
                  httpParams={{
                    type: item.tag,
                    machine: ahuData.deviceName,
                    floor: ahuData.floor,
                    store_id: ahuData.storeId,
                  }}
                />
              </BlockCard>
            );
          }
          //速度设定、频率反馈
          if (item.fieldType === FieldType.Text) {
            return (
              <BlockCard key={index} title={item.title}>
                <div>
                  {item.value}
                  {item.unit}
                </div>
              </BlockCard>
            );
          }

          if (item.fieldType === FieldType.Placeholder) {
            return (
              <BlockCard key={index} title={''} style={{ backgroundColor: 'white' }}>
                <div></div>
              </BlockCard>
            );
          }

          return <></>;
        })}
      </div>

      <DevicePlane
        deviceName={ahuData.deviceName}
        fanAnimationDuration={ahuData.machineChassis.fanAnimationDuration}
        fanImagePath={ahuData.machineChassis.fanImagePath}
        fcuStatus={ahuData.machineChassis.fcuStatus}
        temperature={{
          title: ahuData.machineChassis.temperatureTitle,
          value: ahuData.machineChassis.temperatureValue,
          valueKey: 'temperature-value',
          unit: ahuData.machineChassis.temperatureUnit,
          tag: ahuData.machineChassis.temperatureTag,
          deviceName: ahuData.deviceName,
          floor: ahuData.floor,
          storeId: ahuData.storeId,
        }}
        windTemperature={`${ahuData.machineChassis.windTemperatureTitle}: ${ahuData.machineChassis.windTemperatureFormatVal}`}
        onSetTemperatureChange={
          (arg) => {
            handleOnChange('AHUData', {
              model: ModelTypeEnum.AHU,
              index: 0,
              key: arg.key,
              value: arg.value,
            })
          }
        }
        deviceType={ahuData.machineChassis.deviceType}
        waterPipeList={ahuData.machineChassis.waterPipeList}
        givingFeedbackTextList={ahuData.machineChassis.givingFeedbackTextList}
      ></DevicePlane>
    </>
  );
};
export default AhuDetail;
