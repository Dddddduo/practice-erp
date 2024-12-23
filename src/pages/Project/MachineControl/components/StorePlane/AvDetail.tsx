import React from 'react';
import { GroupData , ClickEnum , ModelTypeEnum , FieldType } from '@/viewModel/Project/useMachineControl';
import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import ModelInput from '@/pages/Project/MachineControl/components/ModelInput';
import NewSelect from '@/pages/Project/MachineControl/components/Select';
import AVDevicePlane from '@/pages/Project/MachineControl/components/StorePlane/AVDevicePlane';
interface Props {
  groupData: GroupData;
  handleOnChange: (path: string, value: any) => void;
}

const AvDetail: React.FC<Props> = (props) => {
  const { groupData, handleOnChange } = props;
  return (
    <>
      <div className={'flex flex-wrap'}>
        {
          groupData.switchBarList.map((item, index) => (
            <BlockCard
              key={index}
              title={item.title}
              style={{ marginRight: 12 ,marginBottom:12}}
            >
              <NewSwitch
                value={item.value}
                valueKey={'switchBarList-value'}
                onChange={(arg:any) => {
                  handleOnChange('GroupData', {
                    model: ModelTypeEnum.AV,
                    index: index,
                    key: arg.key,
                    value: arg.value,
                  })
                }}
                httpParams={{
                  type: item.tag + '_group',
                  machine: groupData.ahuDeviceName ?? '',
                  floor: groupData.floor,
                  store_id: groupData.storeId,
                }}
              />
            </BlockCard>
          ))
        }
      </div>
      <div className={'flex mb-4 flex-wrap'} style={{ width: 800, gap: 12 }}>
        {
          groupData.mixinBarList.map((item, index) => {
            if (item.fieldType === FieldType.Input) {
              return (
                <BlockCard
                  key={index}
                  title={item.title}
                >
                  <ModelInput
                    value={item.value}
                    valueKey={'mixinBarList-value'}
                    unit={item.unit ?? ''}
                    rule={[]}
                    onChange={(arg) => {
                      handleOnChange('GroupData', {
                        model: ModelTypeEnum.AV,
                        index: index,
                        key: arg.key,
                        value: arg.value,
                      })
                    }}
                    httpParams={{
                      type: item.tag + '_group',
                      machine: groupData.ahuDeviceName,
                      floor: groupData.floor,
                      store_id: groupData.storeId,
                    }}
                  />
                </BlockCard>
              )
            }

            if (item.fieldType === FieldType.Select) {
              console.log('item.deviceType--item.deviceType',item)
              return (
                <BlockCard
                  key={index}
                  title={item.title}
                >
                  <NewSelect
                    value={item.value}
                    valueKey={'mixinBarList-value'}
                    onChange={(arg:any) => {
                      handleOnChange('GroupData', {
                        model: ModelTypeEnum.AV,
                        index: index,
                        key: arg.key,
                        value: arg.value,
                      })
                    }}
                    // @ts-ignore
                    options={item.options ?? []}
                    httpParams={
                      {
                        type: item.tag + '_group',
                        machine: item.title === 'VRV风速' ? groupData.vrvDeviceName : groupData.ahuDeviceName,
                        floor: groupData.floor,
                        store_id: groupData.storeId,
                      }
                    }
                  />
                </BlockCard>
              )
            }

            if (item.fieldType === FieldType.Text) {
              return (
                <BlockCard
                  key={index}
                  title={item.title}
                >
                  <div>
                    {item.value}{item.unit}
                  </div>
                </BlockCard>
              )
            }

            if (item.fieldType === FieldType.Placeholder) {
              return (
                <BlockCard
                  key={index}
                  title={''}
                  style={{ backgroundColor: 'white' }}
                >
                  <div></div>
                </BlockCard>
              )
            }

            return <></>
          })
        }
      </div>

      <AVDevicePlane
        ahuDeviceName={groupData.ahuDeviceName}
        vrvDeviceName={groupData.vrvDeviceName}
        ahuFanAnimationDuration={groupData.machineChassis.ahuHanAnimationDuration}
        ahuFanImagePath={groupData.machineChassis.ahuFanImagePath}
        ahuStatus={groupData.machineChassis.ahuStatus}
        vrvFanAnimationDuration={groupData.machineChassis.vrvFanAnimationDuration}
        vrvFanImagePath={groupData.machineChassis.vrvFanImagePath}
        vrvStatus={groupData.machineChassis.vrvStatus}
        temperature={{
          title: groupData.machineChassis.temperatureTitle,
          value: groupData.machineChassis.temperatureValue,
          valueKey: 'temperature-value',
          unit: groupData.machineChassis.temperatureUnit,
          tag: groupData.machineChassis.temperatureTag,
          deviceName: groupData.ahuDeviceName,
          floor: groupData.floor,
          storeId: groupData.storeId,
        }}
        windTemperature={`${groupData.machineChassis.windTemperatureTitle}: ${groupData.machineChassis.windTemperatureFormatVal}`}
        onSetTemperatureChange={
          (arg) => {
            handleOnChange('GroupData', {
              model: ModelTypeEnum.AV,
              index: 0,
              key: arg.key,
              value: arg.value,
            })
          }
        }
      ></AVDevicePlane>
    </>
  )
};
export default AvDetail;
