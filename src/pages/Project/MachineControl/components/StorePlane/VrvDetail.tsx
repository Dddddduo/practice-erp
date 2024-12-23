import React from 'react';
import { VrvData , ClickEnum , ModelTypeEnum  , FieldType } from '@/viewModel/Project/useMachineControl';
import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import NewSelect from '@/pages/Project/MachineControl/components/Select';
import DevicePlane from '@/pages/Project/MachineControl/components/StorePlane/DevicePlane';
interface Props {
  vrvData: VrvData;
  handleOnChange: (path: string, value: any) => void;
}
const VrvDetail: React.FC<Props> = (props) => {
  const { vrvData, handleOnChange } = props;
  return (
    <>
      <div className={'flex mb-4'}>
        {
          vrvData.switchBarList.map((item, index) => (
            <BlockCard
              key={index}
              title={item.title}
              style={{ marginRight: 12 }}
            >
              <NewSwitch
                value={item.value}
                valueKey={'switchBarList-value'}
                onChange={(arg:any) => {
                  handleOnChange('VrvData', {
                    model: ModelTypeEnum.VRV,
                    index: index,
                    key: arg.key,
                    value: arg.value,
                  })
                }}
                httpParams={{
                  type: item.tag,
                  machine: vrvData.deviceName ?? '',
                  floor: vrvData.floor,
                  store_id: vrvData.storeId,
                }}
              />
            </BlockCard>
          ))
        }
      </div>

      <div className={'flex mb-4 flex-wrap'} style={{ width: 800, gap: 12 }}>
        {
          vrvData.mixinBarList.map((item, index) => {
            if (item.fieldType === FieldType.Select) {
              return (
                <BlockCard
                  key={index}
                  title={item.title}
                >
                  <NewSelect
                    value={item.value}
                    valueKey={'mixinBarList-value'}
                    onChange={(arg:any) => {
                      handleOnChange('VrvData', {
                        model: ModelTypeEnum.VRV,
                        index: index,
                        key: arg.key,
                        value: arg.value,
                      })
                    }}
                    // @ts-ignore
                    options={item.options ?? []}
                    httpParams={
                      {
                        type: item.tag,
                        machine: vrvData.deviceName,
                        floor: vrvData.floor,
                        store_id: vrvData.storeId,
                      }
                    }
                  />
                </BlockCard>
              )
            }

            return <></>
          })
        }
      </div>

      <DevicePlane
        deviceName={vrvData.deviceName}
        fanAnimationDuration={vrvData.machineChassis.fanAnimationDuration}
        fanImagePath={vrvData.machineChassis.fanImagePath}
        fcuStatus={vrvData.machineChassis.fcuStatus}
        temperature={{
          title: vrvData.machineChassis.temperatureTitle,
          value: vrvData.machineChassis.temperatureValue,
          valueKey: 'temperature-value',
          unit: vrvData.machineChassis.temperatureUnit,
          tag: vrvData.machineChassis.temperatureTag,
          deviceName: vrvData.deviceName,
          floor: vrvData.floor,
          storeId: vrvData.storeId,
        }}
        windTemperature={`${vrvData.machineChassis.windTemperatureTitle}: ${vrvData.machineChassis.windTemperatureFormatVal}`}
        onSetTemperatureChange={
          (arg) => {
            handleOnChange('VrvData', {
              model: ModelTypeEnum.VRV,
              index: 0,
              key: arg.key,
              value: arg.value,
            })
          }
        }
        deviceType={''}
        waterPipeList={[]}
      ></DevicePlane>
    </>
  )
};
export default VrvDetail;
